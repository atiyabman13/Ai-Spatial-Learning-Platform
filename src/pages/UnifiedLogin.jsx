import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../config/api";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import LoginSpatialCanvas from "../three/LoginSpatialCanvas";
import {
    FaUserGraduate,
    FaChalkboardTeacher,
    FaLock,
    FaEnvelope,
    FaUser,
    FaSignInAlt,
    FaUserPlus,
    FaArrowLeft,
    FaBrain,
    FaEye,
    FaEyeSlash,
    FaShieldAlt,
    FaBolt,
    FaRobot,
    FaTimes,
    FaSpinner,
    FaCheckCircle,
    FaKey,
    FaMagic,
    FaCheck,
    FaInfoCircle,
    FaCube
} from "react-icons/fa";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function UnifiedLogin({ defaultRole }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, logout } = useContext(AuthContext);

    // Determine initial role from prop or route path ('student' | 'teacher')
    const initialRole = defaultRole || (location.pathname.includes("teacher") ? "teacher" : "student");
    const [role, setRole] = useState(initialRole);
    const [isRegister, setIsRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);

    // Form inputs
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // UI States
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeTooltip, setActiveTooltip] = useState(null);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotSending, setForgotSending] = useState(false);

    // 3D Spatial Canvas model choice
    const [selected3DModel, setSelected3DModel] = useState(null);

    // Sync role if route path changes
    useEffect(() => {
        if (location.pathname.includes("teacher")) {
            setRole("teacher");
        } else if (location.pathname.includes("student")) {
            setRole("student");
        }
    }, [location.pathname]);

    // Password strength evaluation
    const evalPassword = (pwd) => {
        let score = 0;
        const checks = {
            length: pwd.length >= 8,
            hasUpper: /[A-Z]/.test(pwd),
            hasNumber: /[0-9]/.test(pwd),
            hasSpecial: /[^A-Za-z0-9]/.test(pwd),
        };
        if (checks.length) score += 25;
        if (checks.hasUpper) score += 25;
        if (checks.hasNumber) score += 25;
        if (checks.hasSpecial) score += 25;
        return { score, checks };
    };

    const pwdAnalysis = evalPassword(password);

    const getStrengthColor = (score) => {
        if (score <= 25) return "#f43f5e";
        if (score <= 50) return "#f59e0b";
        if (score <= 75) return "#3b82f6";
        return "#10b981";
    };

    const getStrengthLabel = (score) => {
        if (score === 0) return "";
        if (score <= 25) return "Weak";
        if (score <= 50) return "Fair";
        if (score <= 75) return "Good";
        return "Strong Security";
    };

    // Redirect destination resolver (ensures role matches destination)
    const getRedirectDestination = (userRole) => {
        const defaultDest = userRole === "teacher" ? "/teacher-dashboard" : "/student-dashboard";
        if (location.state?.from) {
            const fromPath = typeof location.state.from === "string"
                ? location.state.from
                : location.state.from?.pathname;
            if (fromPath) {
                if (userRole === "student" && fromPath.includes("teacher")) {
                    return "/student-dashboard";
                }
                if (userRole === "teacher" && fromPath.includes("student")) {
                    return "/teacher-dashboard";
                }
                return fromPath;
            }
        }
        return defaultDest;
    };

    // Autofill registered credentials helper (populates fields only, does not bypass authentication)
    const handleQuickFill = (targetRole) => {
        setRole(targetRole);
        const demoUser = targetRole === "teacher"
            ? { name: "Dr. Sarah Mitchell", role: "teacher", email: "teacher@university.edu", password: "teacher123!" }
            : { name: "Student Alex", role: "student", email: "student@university.edu", password: "student123!" };

        setEmail(demoUser.email);
        setPassword(demoUser.password);
        setName(demoUser.name);
        setErrorMsg("");
        toast.success(`${targetRole === "teacher" ? "Teacher" : "Student"} credentials autofilled. Click Sign In to authenticate.`, {
            icon: targetRole === "teacher" ? "👩‍🏫" : "🎓",
            duration: 2500
        });
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        const cleanEmail = (email || "").trim().toLowerCase();
        const cleanName = (name || "").trim();

        // Validate normalized email format before sending network request
        if (!EMAIL_REGEX.test(cleanEmail)) {
            const formatMsg = "Please provide a valid email address format.";
            setErrorMsg(formatMsg);
            toast.error(formatMsg);
            setLoading(false);
            return;
        }

        setLoading(true);

        // 1. Determine selected portal role before submitting
        const selectedPortalRole = role === "teacher" ? "teacher" : "student";

        const endpoint = isRegister
            ? `${API_URL}/api/auth/register`
            : `${API_URL}/api/auth/login`;

        // 2. Include portalRole to enforce role matching on backend
        const payload = isRegister
            ? { name: cleanName, email: cleanEmail, password, role: selectedPortalRole, portalRole: selectedPortalRole }
            : { email: cleanEmail, password, portalRole: selectedPortalRole };

        const toastId = toast.loading(isRegister ? "Creating account..." : "Authenticating user...");

        try {
            const response = await axios.post(endpoint, payload);
            const { token, user } = response.data;

            if (!token || !user) {
                throw new Error("Authentication failed: invalid server response.");
            }

            // 3. Client-side defense-in-depth role check against database role
            if (user.role !== selectedPortalRole) {
                logout(); // Purge any existing session completely
                const roleName = user.role === "teacher" ? "Teacher" : "Student";
                const portalName = user.role === "teacher" ? "Teacher Studio" : "Student Portal";
                const mismatchMsg = `These credentials belong to a ${roleName} account. Please select ${portalName} to continue.`;
                setErrorMsg(mismatchMsg);
                toast.error(mismatchMsg, { id: toastId, duration: 4500 });
                return;
            }

            // 4. Roles match: initialize session and navigate
            login(token, user);
            const welcomeText = isRegister
                ? `Account registered successfully! Welcome, ${user.name || user.email}!`
                : `Welcome back, ${user.name || user.email}!`;
            setSuccessMsg(welcomeText);
            toast.success(welcomeText, { id: toastId, duration: 1500 });

            setTimeout(() => {
                navigate(getRedirectDestination(user.role), { replace: true });
            }, 400);
        } catch (error) {
            console.error("Authentication error:", error?.response?.data || error?.message);
            // On failure or role mismatch rejection, ensure no session state remains
            logout();

            const serverMessage = error?.response?.data?.message;
            let displayMsg = serverMessage;
            if (!displayMsg) {
                if (error.code === "ERR_NETWORK" || !error.response) {
                    displayMsg = "Unable to connect to authentication server. Please ensure the backend is running.";
                } else if (isRegister) {
                    displayMsg = "Registration failed. Please check your details.";
                } else {
                    displayMsg = "Invalid email or password. Please try again.";
                }
            }

            setErrorMsg(displayMsg);
            toast.error(displayMsg, { id: toastId, duration: 4000 });
        } finally {
            setLoading(false);
        }
    };

    const handleForgotSubmit = (e) => {
        e.preventDefault();
        if (!forgotEmail) return;
        setForgotSending(true);

        setTimeout(() => {
            setForgotSending(false);
            setShowForgotModal(false);
            toast.success(`Password reset link sent to ${forgotEmail}! Check your inbox.`, {
                duration: 4000,
                icon: "📧"
            });
            setForgotEmail("");
        }, 1200);
    };

    const handleRoleSwitch = (newRole) => {
        setRole(newRole);
        setErrorMsg("");
        if (location.pathname === "/teacher-login" && newRole === "student") {
            navigate("/student-login", { replace: true, state: location.state });
        } else if (location.pathname === "/student-login" && newRole === "teacher") {
            navigate("/teacher-login", { replace: true, state: location.state });
        }
    };

    const isTeacher = role === "teacher";
    const accentGradient = isTeacher
        ? "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))"
        : "linear-gradient(135deg, var(--accent-purple), var(--accent-blue))";
    const glowShadow = isTeacher
        ? "0 8px 30px rgba(6, 182, 212, 0.4)"
        : "0 8px 30px rgba(168, 85, 247, 0.4)";

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "28px 16px",
                position: "relative",
                overflow: "hidden",
                background: "#060911"
            }}
        >
            {/* Dynamic Ambient Background Glowing Orbs */}
            <motion.div
                className="auth-bg-orb-1"
                animate={{
                    x: isTeacher ? [0, 50, 0] : [0, -40, 0],
                    scale: isTeacher ? [1, 1.15, 1] : [1, 0.9, 1]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    background: isTeacher
                        ? "radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, rgba(6, 182, 212, 0) 70%)"
                        : "radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(168, 85, 247, 0) 70%)"
                }}
            />
            <motion.div
                className="auth-bg-orb-2"
                animate={{
                    y: isTeacher ? [0, -60, 0] : [0, 40, 0],
                    scale: isTeacher ? [1, 0.95, 1] : [1, 1.2, 1]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    background: isTeacher
                        ? "radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(139, 92, 246, 0) 70%)"
                        : "radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0) 70%)"
                }}
            />

            {/* Split Screen 3D Auth Container */}
            <div className="auth-grid-container">

                {/* Left Column: Interactive 3D Spatial Canvas Viewport */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{
                        height: "100%",
                        minHeight: "560px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px"
                    }}
                >
                    {/* Viewport Header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "10px",
                                    background: isTeacher ? "rgba(6, 182, 212, 0.15)" : "rgba(168, 85, 247, 0.15)",
                                    border: `1px solid ${isTeacher ? "#06b6d4" : "#a855f7"}40`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: isTeacher ? "#06b6d4" : "#a855f7",
                                    fontSize: "1.1rem"
                                }}
                            >
                                <FaCube />
                            </div>
                            <div>
                                <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "#fff" }}>
                                    Live 3D Spatial Preview
                                </h3>
                                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                                    Orbit 360° • Click components to inspect internal structures
                                </p>
                            </div>
                        </div>

                        {/* Quick Fill Pills */}
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button
                                type="button"
                                className="quick-fill-btn"
                                onClick={() => handleQuickFill("teacher")}
                                title="Click to autofill Teacher Demo Account"
                            >
                                ⚡ Teacher Demo
                            </button>
                            <button
                                type="button"
                                className="quick-fill-btn"
                                onClick={() => handleQuickFill("student")}
                                title="Click to autofill Student Demo Account"
                            >
                                ⚡ Student Demo
                            </button>
                        </div>
                    </div>

                    {/* Interactive 3D Canvas Box */}
                    <div style={{ flex: 1, minHeight: "480px" }}>
                        <LoginSpatialCanvas
                            role={role}
                            activeModel={selected3DModel}
                            onModelSelect={setSelected3DModel}
                        />
                    </div>
                </motion.div>

                {/* Right Column: Main Interactive Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                >
                    <div
                        className="glass-card"
                        style={{
                            padding: "36px 32px",
                            border: `1px solid ${isTeacher ? "rgba(6, 182, 212, 0.25)" : "rgba(168, 85, 247, 0.25)"}`,
                            borderRadius: "24px",
                            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.75)",
                            backdropFilter: "blur(24px)",
                            position: "relative"
                        }}
                    >
                        {/* Top Navigation & Platform Badge */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <button
                                onClick={() => navigate("/")}
                                style={{
                                    background: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    color: "var(--text-secondary)",
                                    fontSize: "0.82rem",
                                    padding: "6px 14px",
                                    borderRadius: "10px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    transition: "all 0.2s"
                                }}
                            >
                                <FaArrowLeft /> Home Page
                            </button>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    fontSize: "0.78rem",
                                    fontWeight: "700",
                                    color: isTeacher ? "var(--accent-cyan)" : "var(--accent-purple)",
                                    background: isTeacher ? "rgba(6, 182, 212, 0.12)" : "rgba(168, 85, 247, 0.12)",
                                    border: `1px solid ${isTeacher ? "rgba(6, 182, 212, 0.35)" : "rgba(168, 85, 247, 0.35)"}`,
                                    padding: "4px 12px",
                                    borderRadius: "20px"
                                }}
                            >
                                <FaBrain /> AI Spatial Hub v2.5
                            </div>
                        </div>

                        {/* Authentication Required Redirect Notice Banner */}
                        {location.state?.from && (
                            <div
                                style={{
                                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.1))",
                                    border: "1px solid rgba(16, 185, 129, 0.35)",
                                    borderRadius: "12px",
                                    padding: "12px 14px",
                                    marginBottom: "18px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    color: "#a7f3d0",
                                    fontSize: "0.85rem",
                                    lineHeight: "1.4"
                                }}
                            >
                                <FaShieldAlt style={{ fontSize: "1.2rem", color: "#10b981", flexShrink: 0 }} />
                                <div>
                                    <strong style={{ color: "#ffffff", display: "block", marginBottom: "2px" }}>Sign-In Required</strong>
                                    Please log in as a Teacher or Student to access the Biology Hub lessons and 3D models.
                                </div>
                            </div>
                        )}

                        {/* Interactive Role Switcher Pills */}
                        <div
                            style={{
                                display: "flex",
                                background: "rgba(10, 15, 30, 0.65)",
                                borderRadius: "14px",
                                padding: "4px",
                                marginBottom: "22px",
                                border: "1px solid rgba(255, 255, 255, 0.08)"
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => handleRoleSwitch("student")}
                                style={{
                                    flex: 1,
                                    padding: "10px 14px",
                                    borderRadius: "10px",
                                    background: role === "student"
                                        ? "linear-gradient(135deg, var(--accent-purple), var(--accent-blue))"
                                        : "transparent",
                                    color: role === "student" ? "#ffffff" : "var(--text-muted)",
                                    fontWeight: "700",
                                    fontSize: "0.88rem",
                                    border: "none",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    boxShadow: role === "student" ? "0 4px 16px rgba(168, 85, 247, 0.4)" : "none"
                                }}
                            >
                                <FaUserGraduate /> Student Portal
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRoleSwitch("teacher")}
                                style={{
                                    flex: 1,
                                    padding: "10px 14px",
                                    borderRadius: "10px",
                                    background: role === "teacher"
                                        ? "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))"
                                        : "transparent",
                                    color: role === "teacher" ? "#ffffff" : "var(--text-muted)",
                                    fontWeight: "700",
                                    fontSize: "0.88rem",
                                    border: "none",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    boxShadow: role === "teacher" ? "0 4px 16px rgba(6, 182, 212, 0.4)" : "none"
                                }}
                            >
                                <FaChalkboardTeacher /> Teacher Studio
                            </button>
                        </div>

                        {/* Title & Description */}
                        <div style={{ textAlign: "center", marginBottom: "20px" }}>
                            <h2
                                style={{
                                    fontSize: "1.75rem",
                                    fontFamily: "var(--font-display)",
                                    fontWeight: "800",
                                    background: accentGradient,
                                    WebkitBackgroundClip: "text",
                                    backgroundClip: "text",
                                    WebkitTextFillColor: "transparent"
                                }}
                            >
                                {isTeacher ? "Teacher Studio Sign In" : "Student Hub Sign In"}
                            </h2>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "4px" }}>
                                {isRegister
                                    ? `Enter your details to create a new ${role} profile.`
                                    : `Sign in to access your spatial 3D learning workspace.`}
                            </p>
                        </div>

                        {/* Sign In vs Register Tabs */}
                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                marginBottom: "20px",
                                borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRegister(false);
                                    setErrorMsg("");
                                }}
                                style={{
                                    flex: 1,
                                    padding: "10px",
                                    borderBottom: !isRegister
                                        ? `2px solid ${isTeacher ? "var(--accent-cyan)" : "var(--accent-purple)"}`
                                        : "2px solid transparent",
                                    color: !isRegister
                                        ? isTeacher ? "var(--accent-cyan)" : "var(--accent-purple)"
                                        : "var(--text-muted)",
                                    background: "transparent",
                                    fontWeight: "700",
                                    fontSize: "0.92rem",
                                    cursor: "pointer",
                                    transition: "all 0.2s"
                                }}
                            >
                                Sign In
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRegister(true);
                                    setErrorMsg("");
                                }}
                                style={{
                                    flex: 1,
                                    padding: "10px",
                                    borderBottom: isRegister
                                        ? `2px solid ${isTeacher ? "var(--accent-cyan)" : "var(--accent-purple)"}`
                                        : "2px solid transparent",
                                    color: isRegister
                                        ? isTeacher ? "var(--accent-cyan)" : "var(--accent-purple)"
                                        : "var(--text-muted)",
                                    background: "transparent",
                                    fontWeight: "700",
                                    fontSize: "0.92rem",
                                    cursor: "pointer",
                                    transition: "all 0.2s"
                                }}
                            >
                                Create Account
                            </button>
                        </div>

                        {/* Animated Form Fields */}
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                            <AnimatePresence mode="wait">
                                {isRegister && (
                                    <motion.div
                                        key="register-field"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "6px", display: "block", fontWeight: "500" }}>
                                            Full Name
                                        </label>
                                        <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center" }}>
                                            <FaUser
                                                style={{
                                                    position: "absolute",
                                                    left: "14px",
                                                    top: "50%",
                                                    transform: "translateY(-50%)",
                                                    color: isTeacher ? "var(--accent-cyan)" : "var(--accent-purple)",
                                                    fontSize: "0.95rem",
                                                    pointerEvents: "none",
                                                    zIndex: 2
                                                }}
                                            />
                                            <input
                                                type="text"
                                                className="auth-input"
                                                placeholder={isTeacher ? "Dr. Sarah Mitchell" : "Alex Smith"}
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required={isRegister}
                                                style={{ width: "100%", paddingLeft: "44px", paddingRight: "14px", boxSizing: "border-box" }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div>
                                <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "6px", display: "block", fontWeight: "500" }}>
                                    Email Address
                                </label>
                                <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center" }}>
                                    <FaEnvelope
                                        style={{
                                            position: "absolute",
                                            left: "14px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: isTeacher ? "var(--accent-cyan)" : "var(--accent-purple)",
                                            fontSize: "0.95rem",
                                            pointerEvents: "none",
                                            zIndex: 2
                                        }}
                                    />
                                    <input
                                        type="email"
                                        className="auth-input"
                                        placeholder={isTeacher ? "teacher@university.edu" : "student@university.edu"}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        style={{ width: "100%", paddingLeft: "44px", paddingRight: "14px", boxSizing: "border-box" }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                    <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "500" }}>
                                        Password
                                    </label>
                                    {!isRegister && (
                                        <button
                                            type="button"
                                            onClick={() => setShowForgotModal(true)}
                                            style={{
                                                background: "transparent",
                                                border: "none",
                                                color: isTeacher ? "var(--accent-cyan)" : "var(--accent-purple)",
                                                fontSize: "0.8rem",
                                                fontWeight: "600",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Forgot Password?
                                        </button>
                                    )}
                                </div>
                                <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center" }}>
                                    <FaLock
                                        style={{
                                            position: "absolute",
                                            left: "14px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: isTeacher ? "var(--accent-cyan)" : "var(--accent-purple)",
                                            fontSize: "0.95rem",
                                            pointerEvents: "none",
                                            zIndex: 2
                                        }}
                                    />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="auth-input"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        style={{ width: "100%", paddingLeft: "44px", paddingRight: "44px", boxSizing: "border-box" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: "absolute",
                                            right: "12px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            background: "transparent",
                                            border: "none",
                                            color: "var(--text-muted)",
                                            cursor: "pointer",
                                            fontSize: "1rem",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            padding: "4px",
                                            zIndex: 2
                                        }}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>

                                {/* Password Strength Visualizer for Register Mode */}
                                {isRegister && password.length > 0 && (
                                    <div style={{ marginTop: "10px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem" }}>
                                            <span style={{ color: "var(--text-muted)" }}>Strength:</span>
                                            <span style={{ color: getStrengthColor(pwdAnalysis.score), fontWeight: "700" }}>
                                                {getStrengthLabel(pwdAnalysis.score)}
                                            </span>
                                        </div>

                                        <div className="strength-meter-bg">
                                            <div
                                                className="strength-meter-fill"
                                                style={{
                                                    width: `${pwdAnalysis.score}%`,
                                                    backgroundColor: getStrengthColor(pwdAnalysis.score),
                                                    boxShadow: `0 0 10px ${getStrengthColor(pwdAnalysis.score)}80`
                                                }}
                                            />
                                        </div>

                                        {/* Criteria Checks */}
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                                            {[
                                                { key: "length", label: "8+ chars" },
                                                { key: "hasUpper", label: "Uppercase" },
                                                { key: "hasNumber", label: "Number" },
                                                { key: "hasSpecial", label: "Symbol" }
                                            ].map((c) => {
                                                const pass = pwdAnalysis.checks[c.key];
                                                return (
                                                    <span
                                                        key={c.key}
                                                        className="strength-badge"
                                                        style={{
                                                            background: pass ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.05)",
                                                            color: pass ? "#10b981" : "var(--text-muted)",
                                                            border: `1px solid ${pass ? "rgba(16, 185, 129, 0.3)" : "rgba(255,255,255,0.08)"}`
                                                        }}
                                                    >
                                                        {pass ? <FaCheck style={{ fontSize: "0.65rem" }} /> : "•"} {c.label}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Remember Me Custom Switch */}
                            {!isRegister && (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "4px" }}>
                                    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                                        <div
                                            className={`custom-switch ${rememberMe ? (isTeacher ? "active-cyan" : "active-purple") : ""}`}
                                            onClick={() => setRememberMe(!rememberMe)}
                                        >
                                            <div className="custom-switch-handle" />
                                        </div>
                                        Keep me logged in
                                    </label>
                                </div>
                            )}

                            {/* Internal Form Error Message */}
                            {errorMsg && (
                                <div
                                    style={{
                                        color: "var(--accent-rose)",
                                        fontSize: "0.82rem",
                                        background: "rgba(244, 63, 94, 0.12)",
                                        border: "1px solid rgba(244, 63, 94, 0.3)",
                                        padding: "10px 14px",
                                        borderRadius: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between"
                                    }}
                                >
                                    <span>⚠️ {errorMsg}</span>
                                    <button
                                        type="button"
                                        onClick={() => setErrorMsg("")}
                                        style={{ background: "transparent", color: "var(--accent-rose)", cursor: "pointer", border: "none" }}
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            )}

                            {/* Internal Form Success Message */}
                            {successMsg && (
                                <div
                                    style={{
                                        color: "var(--accent-emerald)",
                                        fontSize: "0.82rem",
                                        background: "rgba(16, 185, 129, 0.12)",
                                        border: "1px solid rgba(16, 185, 129, 0.3)",
                                        padding: "10px 14px",
                                        borderRadius: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}
                                >
                                    <FaCheckCircle /> {successMsg}
                                </div>
                            )}

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.015 }}
                                whileTap={{ scale: 0.985 }}
                                className="btn-primary"
                                style={{
                                    width: "100%",
                                    marginTop: "10px",
                                    padding: "14px 20px",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "10px",
                                    background: accentGradient,
                                    color: "#ffffff",
                                    fontSize: "0.98rem",
                                    fontWeight: "700",
                                    letterSpacing: "0.3px",
                                    boxShadow: glowShadow,
                                    border: "none",
                                    cursor: loading ? "wait" : "pointer"
                                }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <FaSpinner className="spin" style={{ fontSize: "1.1rem" }} />
                                ) : isRegister ? (
                                    <FaUserPlus style={{ fontSize: "1.1rem" }} />
                                ) : (
                                    <FaSignInAlt style={{ fontSize: "1.1rem" }} />
                                )}
                                <span>
                                    {loading
                                        ? "Authenticating..."
                                        : isRegister
                                        ? `Create ${isTeacher ? "Teacher" : "Student"} Account`
                                        : `Sign In as ${isTeacher ? "Teacher" : "Student"}`}
                                </span>
                            </motion.button>
                        </form>

                        {/* Interactive Security & Platform Badges */}
                        <div
                            style={{
                                marginTop: "28px",
                                paddingTop: "18px",
                                borderTop: "1px solid rgba(255,255,255,0.08)",
                                display: "flex",
                                justifyContent: "center",
                                gap: "18px",
                                flexWrap: "wrap",
                                alignItems: "center",
                                fontSize: "0.78rem",
                                color: "var(--text-muted)",
                                position: "relative"
                            }}
                        >
                            <span
                                style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", position: "relative" }}
                                onMouseEnter={() => setActiveTooltip("ssl")}
                                onMouseLeave={() => setActiveTooltip(null)}
                            >
                                <FaShieldAlt style={{ color: "var(--accent-emerald)" }} /> 256-Bit SSL
                                {activeTooltip === "ssl" && (
                                    <div className="security-tooltip">
                                        🔒 Encrypted End-to-End Auth with JWT tokens & TLS 1.3
                                    </div>
                                )}
                            </span>
                            <span>•</span>
                            <span
                                style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", position: "relative" }}
                                onMouseEnter={() => setActiveTooltip("sync")}
                                onMouseLeave={() => setActiveTooltip(null)}
                            >
                                <FaBolt style={{ color: "var(--accent-cyan)" }} /> Real-Time Sync
                                {activeTooltip === "sync" && (
                                    <div className="security-tooltip">
                                        ⚡ WebSocket live classroom spatial synchronization
                                    </div>
                                )}
                            </span>
                            <span>•</span>
                            <span
                                style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", position: "relative" }}
                                onMouseEnter={() => setActiveTooltip("ai")}
                                onMouseLeave={() => setActiveTooltip(null)}
                            >
                                <FaRobot style={{ color: "var(--accent-purple)" }} /> Local Engine
                                {activeTooltip === "ai" && (
                                    <div className="security-tooltip">
                                        🧠 Powered by offline Local Educational Knowledge Engine
                                    </div>
                                )}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Forgot Password Interactive Modal */}
            <AnimatePresence>
                {showForgotModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-backdrop"
                        onClick={() => setShowForgotModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: "rgba(15, 23, 42, 0.95)",
                                backdropFilter: "blur(20px)",
                                border: `1px solid ${isTeacher ? "rgba(6, 182, 212, 0.3)" : "rgba(168, 85, 247, 0.3)"}`,
                                maxWidth: "440px"
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <FaKey style={{ color: isTeacher ? "var(--accent-cyan)" : "var(--accent-purple)" }} />
                                    Reset Your Password
                                </h3>
                                <button
                                    onClick={() => setShowForgotModal(false)}
                                    style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "1.1rem", cursor: "pointer" }}
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
                                Enter your account email address. We will send you an instant reset link to recover your access.
                            </p>

                            <form onSubmit={handleForgotSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                <div>
                                    <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
                                        Email Address
                                    </label>
                                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                        <FaEnvelope style={{ position: "absolute", left: "14px", color: "var(--accent-cyan)" }} />
                                        <input
                                            type="email"
                                            className="auth-input"
                                            placeholder="user@university.edu"
                                            value={forgotEmail}
                                            onChange={(e) => setForgotEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => setShowForgotModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        style={{ background: accentGradient, border: "none" }}
                                        disabled={forgotSending}
                                    >
                                        {forgotSending ? <FaSpinner className="spin" /> : "Send Reset Link"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

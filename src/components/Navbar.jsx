import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaBrain, FaUserGraduate, FaChalkboardTeacher, FaSignOutAlt, FaHome, FaCube, FaDna } from "react-icons/fa";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, logout } = useContext(AuthContext);

    const isDashboard = location.pathname.includes("dashboard");
    const isTeacherRoute = location.pathname.includes("teacher");
    const isStudentRoute = location.pathname.includes("student");
    const isBiologyRoute = location.pathname.startsWith("/biology");

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav
            className="navbar"
            style={{
                height: "64px",
                background: "rgba(10, 15, 30, 0.88)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 24px",
                position: "sticky",
                top: 0,
                zIndex: 100
            }}
        >
            {/* Brand Logo */}
            <div
                className="navbar-brand"
                onClick={() => navigate("/")}
                style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontFamily: "var(--font-display)",
                    fontWeight: "800",
                    fontSize: "1.2rem",
                    letterSpacing: "-0.3px"
                }}
            >
                <div
                    style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2))",
                        border: "1px solid rgba(6, 182, 212, 0.35)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <FaBrain style={{ color: "var(--accent-cyan)", fontSize: "1.25rem" }} />
                </div>
                <span
                    style={{
                        background: "linear-gradient(135deg, #ffffff 40%, var(--accent-cyan))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}
                >
                    AI Spatial Platform
                </span>
            </div>

            {/* Right Navigation Controls */}
            <div className="navbar-nav" style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <button
                    className={`btn-secondary ${location.pathname === "/" ? "active" : ""}`}
                    onClick={() => navigate("/")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "0.82rem",
                        padding: "7px 14px",
                        borderRadius: "10px"
                    }}
                >
                    <FaHome /> Home
                </button>

                {/* Biology Hub Quick Nav Button - Accessible for authenticated Teachers and Students */}
                {isAuthenticated && user && (
                    <button
                        className={`btn-emerald ${isBiologyRoute ? "active" : ""}`}
                        onClick={() => navigate("/biology")}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "0.82rem",
                            padding: "7px 14px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            boxShadow: isBiologyRoute ? "0 0 14px rgba(16, 185, 129, 0.5)" : "0 2px 8px rgba(16, 185, 129, 0.2)"
                        }}
                    >
                        <FaDna /> Biology (Classes 6–12)
                    </button>
                )}

                {isDashboard || isTeacherRoute || isStudentRoute ? (
                    /* Dashboard Viewport Navigation */
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                fontSize: "0.78rem",
                                fontWeight: "700",
                                color: isTeacherRoute ? "var(--accent-cyan)" : "var(--accent-purple)",
                                background: isTeacherRoute ? "rgba(6, 182, 212, 0.12)" : "rgba(168, 85, 247, 0.12)",
                                border: `1px solid ${isTeacherRoute ? "rgba(6, 182, 212, 0.28)" : "rgba(168, 85, 247, 0.28)"}`,
                                padding: "5px 12px",
                                borderRadius: "14px"
                            }}
                        >
                            {isTeacherRoute ? <FaChalkboardTeacher /> : <FaUserGraduate />}
                            {isTeacherRoute ? "Teacher Command Studio" : "Student Learning Hub"}
                        </div>

                        {user && (
                            <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "5px" }}>
                                <strong style={{ color: "var(--text-primary)" }}>{user.name || user.email}</strong>
                            </span>
                        )}

                        <button
                            className="btn-secondary"
                            onClick={handleLogout}
                            title="Sign out of spatial session"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                fontSize: "0.82rem",
                                padding: "7px 12px",
                                borderRadius: "10px",
                                background: "rgba(244, 63, 94, 0.1)",
                                border: "1px solid rgba(244, 63, 94, 0.25)",
                                color: "#fca5a5"
                            }}
                        >
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>
                ) : (
                    /* Public / Landing Page Navigation */
                    !isAuthenticated ? (
                        <>
                            <button
                                className="btn-secondary"
                                onClick={() => navigate("/teacher-login")}
                                style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.84rem", padding: "8px 14px", borderRadius: "10px" }}
                            >
                                <FaChalkboardTeacher /> Teacher Portal
                            </button>
                            <button
                                className="btn-primary"
                                onClick={() => navigate("/student-login")}
                                style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.84rem", padding: "8px 14px", borderRadius: "10px" }}
                            >
                                <FaUserGraduate /> Student Portal
                            </button>
                        </>
                    ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {user?.role === "teacher" ? (
                                <button className="btn-primary" onClick={() => navigate("/teacher-dashboard")} style={{ padding: "8px 14px", borderRadius: "10px", fontSize: "0.84rem" }}>
                                    <FaCube /> Teacher Studio
                                </button>
                            ) : (
                                <button className="btn-primary" onClick={() => navigate("/student-dashboard")} style={{ padding: "8px 14px", borderRadius: "10px", fontSize: "0.84rem" }}>
                                    <FaCube /> Student Dashboard
                                </button>
                            )}
                            <button
                                className="btn-secondary"
                                onClick={handleLogout}
                                style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", padding: "7px 12px", borderRadius: "10px" }}
                            >
                                <FaSignOutAlt /> Logout
                            </button>
                        </div>
                    )
                )}
            </div>
        </nav>
    );
}

export default Navbar;
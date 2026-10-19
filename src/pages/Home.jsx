import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import LoginSpatialCanvas from "../three/LoginSpatialCanvas";
import { AuthContext } from "../context/AuthContext";
import {
    FaBrain,
    FaChalkboardTeacher,
    FaUserGraduate,
    FaCube,
    FaBroadcastTower,
    FaRobot,
    FaBookOpen,
    FaArrowRight,
    FaCheckCircle,
    FaMagic,
    FaGraduationCap,
    FaMicrophone,
    FaProjectDiagram,
    FaLayerGroup,
    FaDna
} from "react-icons/fa";

function Home() {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useContext(AuthContext);
    const [selectedHeroModel, setSelectedHeroModel] = useState("Heart");
    const [activeCapabilityTab, setActiveCapabilityTab] = useState("ai-teacher");

    const capabilities = [
        {
            id: "ai-teacher",
            title: "Synchronized AI Teacher & Real-World 3D Flow",
            icon: <FaGraduationCap style={{ color: "var(--accent-cyan)" }} />,
            badge: "Core Feature",
            gradient: "linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))",
            description: "The AI Teacher narrates concepts step-by-step while the 3D model automatically rotates, zooms, highlights, explodes, and slices cross-sections to match the explanation.",
            highlights: ["Step-by-Step Voice Narration & Speech", "Automated Camera Lerps & Zoom Focus", "Emissive Mesh Highlight Shaders", "Exploded View & Section Slice Cues"]
        },
        {
            id: "2d-to-3d",
            title: "2D Textbook Diagram ➔ Interactive 3D Converter",
            icon: <FaMagic style={{ color: "var(--accent-purple)" }} />,
            badge: "Vision AI",
            gradient: "linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))",
            description: "Upload any 2D textbook diagram. Vision AI extracts labeled parts, pointer arrows, and structural relations, generating an interactive rotatable 3D model with cross-highlighting.",
            highlights: ["Multimodal Component Detection", "Dual Canvas Side-by-Side View", "Interactive SVG/HTML Hotspot Pins", "2D ↔ 3D Real-Time Cross-Highlighting"]
        },
        {
            id: "multi-chapter",
            title: "Multi-Subject 3D Curriculum (All Chapters)",
            icon: <FaCube style={{ color: "var(--accent-emerald)" }} />,
            badge: "Biology / Physics / Chem",
            gradient: "linear-gradient(135deg, var(--accent-emerald), #059669)",
            description: "Dedicated interactive 3D learning modules for all chapters: Human Heart, Plant Cell, DC Electric Motor, Bohr Atom Model, Solar System, Brain, and Skeleton.",
            highlights: ["Human Cardiovascular Anatomy", "Eukaryotic Cell Organelles", "DC Motor Commutator & B-Field", "Quantized Bohr Atomic Shells"]
        },
        {
            id: "doubt-qa",
            title: "Interactive Voice & Text Doubt Clearance",
            icon: <FaRobot style={{ color: "var(--accent-blue)" }} />,
            badge: "Interactive Q&A",
            gradient: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
            description: "Students can pause narration anytime to ask questions via mic or text chat. The AI Teacher answers and dynamically rotates, zooms, or slices the 3D model to demonstrate.",
            highlights: ["Web Speech Mic Recognition", "Contextual Local Knowledge Solver", "Dynamic 3D Camera Manipulation", "Audio Answer Narration"]
        }
    ];

    const activeCap = capabilities.find((c) => c.id === activeCapabilityTab) || capabilities[0];

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#060911", overflowX: "hidden" }}>

            {/* Top Navigation Bar */}
            <Navbar />

            {/* Hero Section */}
            <section style={{ padding: "60px 40px", maxWidth: "1560px", margin: "0 auto", width: "100%" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: "40px", alignItems: "center" }}>

                    {/* Left Hero Text Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span style={{
                            fontSize: "0.82rem",
                            fontWeight: "800",
                            textTransform: "uppercase",
                            letterSpacing: "1.5px",
                            color: "var(--accent-cyan)",
                            background: "rgba(6, 182, 212, 0.12)",
                            border: "1px solid rgba(6, 182, 212, 0.3)",
                            padding: "6px 16px",
                            borderRadius: "20px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "20px"
                        }}>
                            🎓 AI Teacher + 3D Multi-Chapter Learning System
                        </span>

                        <h1 style={{ fontSize: "3.2rem", fontFamily: "var(--font-display)", fontWeight: "800", lineHeight: "1.15", marginBottom: "20px" }}>
                            AI Teacher & <br />
                            <span style={{
                                background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple), var(--accent-blue))",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                WebkitTextFillColor: "transparent"
                            }}>
                                Synchronized 3D Flow
                            </span> Platform
                        </h1>

                        <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", marginBottom: "32px", lineHeight: "1.7", maxWidth: "600px" }}>
                            Transform textbook education into a real-world teaching experience. The AI Teacher explains concepts step-by-step while 3D models automatically highlight, zoom, rotate, explode, and slice cross-sections in real time.
                        </p>

                        {/* Interactive Hero Action Buttons */}
                        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "36px" }}>
                            {isAuthenticated && (
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="btn-emerald"
                                    style={{ padding: "16px 28px", fontSize: "1rem", borderRadius: "14px", fontWeight: "700", boxShadow: "0 8px 25px rgba(16, 185, 129, 0.4)" }}
                                    onClick={() => navigate("/biology")}
                                >
                                    <FaDna /> Biology (Classes 6–12) <FaArrowRight />
                                </motion.button>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="btn-primary"
                                style={{ padding: "16px 32px", fontSize: "1rem", borderRadius: "14px", fontWeight: "700", boxShadow: "0 8px 25px rgba(6, 182, 212, 0.4)" }}
                                onClick={() => navigate(isAuthenticated ? (user?.role === "teacher" ? "/teacher-dashboard" : "/student-dashboard") : "/student-login")}
                            >
                                <FaUserGraduate /> {isAuthenticated ? "Open Dashboard" : "Student Portal"} <FaArrowRight />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="btn-secondary"
                                style={{ padding: "16px 32px", fontSize: "1rem", borderRadius: "14px", fontWeight: "700" }}
                                onClick={() => navigate(isAuthenticated ? (user?.role === "teacher" ? "/teacher-dashboard" : "/student-dashboard") : "/teacher-login")}
                            >
                                <FaChalkboardTeacher /> {isAuthenticated ? (user?.role === "teacher" ? "Teacher Studio" : "My Learning") : "Teacher Portal"}
                            </motion.button>
                        </div>

                        {/* Quick Platform Metrics */}
                        <div style={{ display: "flex", gap: "24px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.08)", flexWrap: "wrap" }}>
                            <div>
                                <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "#fff" }}>5+ 3D Subjects</div>
                                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Heart, Cell, Motor, Atom, Solar</div>
                            </div>
                            <div style={{ borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: "24px" }}>
                                <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--accent-cyan)" }}>2D ➔ 3D AI</div>
                                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Diagram Conversion Engine</div>
                            </div>
                            <div style={{ borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: "24px" }}>
                                <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--accent-purple)" }}>Voice Q&A</div>
                                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Interactive Doubt Clearance</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Hero Column: 3D Spatial Canvas Stage */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        style={{ height: "540px", position: "relative" }}
                    >
                        <LoginSpatialCanvas role="student" activeModel={selectedHeroModel} />
                    </motion.div>
                </div>
            </section>

            {/* Platform Core Capabilities Interactive Section */}
            <section style={{ padding: "60px 40px", maxWidth: "1560px", margin: "0 auto", width: "100%" }}>
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <h2 style={{ fontSize: "2.2rem", fontFamily: "var(--font-display)", fontWeight: "800", color: "#fff" }}>
                        Project Workflow & Next-Gen Capabilities
                    </h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "8px" }}>
                        Textbook / Chapter ➔ 2D Diagram ➔ 2D-to-3D Mapping ➔ AI Teacher Synchronized Voice & 3D Flow ➔ Doubt Clearance
                    </p>
                </div>

                {/* Capability Selector Tabs */}
                <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "32px", flexWrap: "wrap" }}>
                    {capabilities.map((cap) => {
                        const isActive = activeCapabilityTab === cap.id;
                        return (
                            <button
                                key={cap.id}
                                onClick={() => setActiveCapabilityTab(cap.id)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    padding: "12px 20px",
                                    borderRadius: "14px",
                                    background: isActive ? cap.gradient : "rgba(255, 255, 255, 0.04)",
                                    border: isActive ? "none" : "1px solid rgba(255, 255, 255, 0.08)",
                                    color: "#ffffff",
                                    fontWeight: "700",
                                    fontSize: "0.9rem",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease"
                                }}
                            >
                                {cap.icon} {cap.title.split("&")[0]}
                            </button>
                        );
                    })}
                </div>

                {/* Capability Feature Card */}
                <div className="glass-card" style={{ padding: "36px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "32px", alignItems: "center" }}>
                    <div>
                        <span style={{ fontSize: "0.78rem", fontWeight: "800", textTransform: "uppercase", color: "var(--accent-cyan)", background: "rgba(6, 182, 212, 0.15)", padding: "4px 12px", borderRadius: "10px" }}>
                            {activeCap.badge}
                        </span>
                        <h3 style={{ fontSize: "1.8rem", fontFamily: "var(--font-display)", marginTop: "12px", marginBottom: "16px" }}>
                            {activeCap.title}
                        </h3>
                        <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: "1.7", marginBottom: "24px" }}>
                            {activeCap.description}
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                            {activeCap.highlights.map((h, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.88rem", color: "#ffffff" }}>
                                    <FaCheckCircle style={{ color: "var(--accent-cyan)" }} /> {h}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        background: "rgba(10, 15, 30, 0.8)",
                        border: "1px solid var(--border-glass)",
                        borderRadius: "20px",
                        padding: "24px",
                        textAlign: "center"
                    }}>
                        <FaGraduationCap style={{ fontSize: "3.5rem", color: "var(--accent-cyan)", marginBottom: "16px" }} />
                        <h4 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>Try Interactive Platform</h4>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
                            Experience synchronized 3D lectures, AI voice narration, and 2D-to-3D textbook conversions directly inside your browser.
                        </p>
                        <button
                            className="btn-primary"
                            onClick={() => navigate(isAuthenticated ? "/student-dashboard" : "/student-login")}
                            style={{ width: "100%", justifyContent: "center", borderRadius: "12px" }}
                        >
                            {isAuthenticated ? "Open Student Dashboard ➔" : "Access Student Portal ➔"}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaCube,
    FaBook,
    FaVideo,
    FaRobot,
    FaTrophy,
    FaMagic,
    FaGraduationCap,
    FaDna,
    FaArrowRight,
    FaLayerGroup,
    FaBroadcastTower
} from "react-icons/fa";

function Sidebar({ activeTab, setActiveTab, role = "student" }) {
    const navigate = useNavigate();
    const isTeacher = role === "teacher";

    // Teacher navigation items mapped 1-to-1 to TeacherDashboard tabs
    const teacherItems = [
        { id: "overview", label: "Broadcast Command Deck", icon: <FaBroadcastTower />, badge: "LIVE" },
        { id: "spatial", label: "3D Spatial Studio", icon: <FaCube />, badge: "3D" },
        { id: "2d-to-3d", label: "2D Image ➔ 3D Converter", icon: <FaMagic />, badge: "VISION" },
        { id: "quizzes", label: "Quiz & Roster Manager", icon: <FaTrophy />, badge: "QUIZ" },
        { id: "chapters", label: "Chapter & PDF Manager", icon: <FaBook />, badge: null },
        { id: "ai-assistant", label: "AI Medical Educator", icon: <FaRobot />, badge: "AI" },
    ];

    // Student navigation items mapped 1-to-1 to StudentDashboard tabs
    const studentItems = [
        { id: "multi-chapter", label: "AI Teacher 3D Curriculum", icon: <FaGraduationCap />, badge: "PRIMARY" },
        { id: "2d-to-3d", label: "2D Diagram ➔ 3D Converter", icon: <FaMagic />, badge: "VISION" },
        { id: "explorer", label: "3D Model Stage", icon: <FaCube />, badge: "3D" },
        { id: "live-class", label: "Join Live 3D Class", icon: <FaVideo />, badge: "LIVE" },
        { id: "quiz", label: "3D Anatomy Quiz", icon: <FaTrophy />, badge: "HOT" },
        { id: "subject-wise", label: "Subject-wise (6–12)", icon: <FaLayerGroup />, badge: "NEW" },
        { id: "chapters", label: "Chapter Library", icon: <FaBook />, badge: null },
        { id: "ai-assistant", label: "AI Doubt Assistant", icon: <FaRobot />, badge: "Q&A" },
    ];

    const menuItems = isTeacher ? teacherItems : studentItems;
    const accentColor = isTeacher ? "var(--accent-cyan)" : "var(--accent-purple)";

    return (
        <aside
            className="sidebar"
            style={{
                userSelect: "none",
                background: "rgba(10, 15, 30, 0.72)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderRight: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "20px 14px",
                display: "flex",
                flexDirection: "column",
                gap: "6px"
            }}
        >
            {/* Header Category Title */}
            <div
                style={{
                    padding: "4px 10px 14px 10px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <span
                    style={{
                        fontSize: "0.72rem",
                        textTransform: "uppercase",
                        letterSpacing: "1.2px",
                        color: "var(--text-muted)",
                        fontWeight: "700"
                    }}
                >
                    {isTeacher ? "Teacher Studio" : "Student Hub"}
                </span>
                <span
                    style={{
                        fontSize: "0.68rem",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        background: isTeacher ? "rgba(6, 182, 212, 0.14)" : "rgba(168, 85, 247, 0.14)",
                        color: accentColor,
                        fontWeight: "700",
                        border: `1px solid ${accentColor}30`
                    }}
                >
                    v3.0 🚀
                </span>
            </div>

            {/* Interactive Menu Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {menuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <motion.div
                            key={item.id}
                            whileHover={{ x: 3 }}
                            whileTap={{ scale: 0.98 }}
                            className={`sidebar-item ${isActive ? "active" : ""}`}
                            onClick={() => setActiveTab && setActiveTab(item.id)}
                            style={{
                                position: "relative",
                                overflow: "hidden",
                                borderLeft: isActive ? `3px solid ${accentColor}` : "3px solid transparent",
                                background: isActive
                                    ? isTeacher
                                        ? "linear-gradient(90deg, rgba(6, 182, 212, 0.16), rgba(59, 130, 246, 0.08))"
                                        : "linear-gradient(90deg, rgba(168, 85, 247, 0.16), rgba(59, 130, 246, 0.08))"
                                    : "transparent",
                                color: isActive ? "#ffffff" : "var(--text-secondary)",
                                borderRadius: "10px",
                                padding: "10px 14px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                transition: "all 0.18s ease",
                                border: isActive
                                    ? isTeacher
                                        ? "1px solid rgba(6, 182, 212, 0.28)"
                                        : "1px solid rgba(168, 85, 247, 0.28)"
                                    : "1px solid transparent"
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", fontWeight: isActive ? "700" : "500", fontSize: "0.88rem" }}>
                                <span style={{ fontSize: "1.05rem", color: isActive ? accentColor : "var(--text-muted)", display: "flex", alignItems: "center" }}>
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </div>

                            {item.badge && (
                                <span
                                    style={{
                                        fontSize: "0.64rem",
                                        fontWeight: "800",
                                        padding: "2px 6px",
                                        borderRadius: "6px",
                                        background: item.badge === "LIVE"
                                            ? "#ef4444"
                                            : item.badge === "PRIMARY" || item.badge === "VISION"
                                                ? "linear-gradient(135deg, #06b6d4, #3b82f6)"
                                                : item.badge === "HOT"
                                                    ? "#f59e0b"
                                                    : "rgba(255, 255, 255, 0.1)",
                                        color: "#ffffff",
                                        letterSpacing: "0.4px"
                                    }}
                                >
                                    {item.badge}
                                </span>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Biology Hub Quick Jump Card */}
            <div style={{ marginTop: "18px", paddingTop: "14px", borderTop: "1px solid rgba(255, 255, 255, 0.07)" }}>
                <div
                    onClick={() => navigate("/biology")}
                    style={{
                        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.16), rgba(6, 182, 212, 0.06))",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        borderRadius: "12px",
                        padding: "12px 14px",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#10b981";
                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(16, 185, 129, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.3)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "#10b981", display: "flex", alignItems: "center", gap: "6px" }}>
                            <FaDna /> Biology Hub
                        </span>
                        <span style={{ fontSize: "0.65rem", padding: "1px 6px", borderRadius: "6px", background: "rgba(16, 185, 129, 0.2)", color: "#10b981", fontWeight: "800" }}>
                            6–12
                        </span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: "1.3" }}>
                        Explore 5 Modules & 3D Models
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.72rem", color: "#10b981", fontWeight: "600", marginTop: "6px" }}>
                        Launch Dashboard <FaArrowRight style={{ fontSize: "0.65rem" }} />
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import {
    BIOLOGY_MODULES,
    BIOLOGY_CHAPTERS,
    getChaptersByGrade,
    getChaptersByModule
} from "../data/biologyCurriculumData";
import {
    FaDna,
    FaHeartbeat,
    FaMicroscope,
    FaSearch,
    FaGraduationCap,
    FaCube,
    FaCheckCircle,
    FaClock,
    FaBookOpen,
    FaArrowRight,
    FaShieldAlt,
    FaFilter,
    FaSeedling,
    FaTrophy,
    FaArrowLeft
} from "react-icons/fa";

export default function BiologyDashboard() {
    const navigate = useNavigate();

    // Filters & Search
    const [selectedGrade, setSelectedGrade] = useState("all");
    const [selectedModule, setSelectedModule] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Completion Tracking from localStorage
    const [completedMap, setCompletedMap] = useState({});

    useEffect(() => {
        const loaded = {};
        (BIOLOGY_CHAPTERS || []).forEach(ch => {
            const key = `bio_quiz_${ch.id}_score`;
            const saved = localStorage.getItem(key);
            if (saved !== null) {
                try {
                    loaded[ch.id] = JSON.parse(saved);
                } catch (e) {
                    // ignore parse error
                }
            }
        });
        setCompletedMap(loaded);
    }, []);

    // Filter Logic
    const filteredChapters = useMemo(() => {
        let list = BIOLOGY_CHAPTERS;

        if (selectedGrade !== "all") {
            const gNum = parseInt(selectedGrade, 10);
            list = list.filter(ch => ch.targetGrades.includes(gNum));
        }

        if (selectedModule !== "all") {
            list = list.filter(ch => ch.moduleId === selectedModule);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(ch => {
                const titleMatch = ch.title?.toLowerCase().includes(q);
                const summaryText = typeof ch.summary === "string"
                    ? ch.summary
                    : (Array.isArray(ch.summary) ? ch.summary.join(" ") : (ch.overview || ""));
                const summaryMatch = summaryText.toLowerCase().includes(q);
                const modelMatch = ch.modelName?.toLowerCase().includes(q);
                const gradeMatch = ch.gradeRange?.toLowerCase().includes(q);
                return titleMatch || summaryMatch || modelMatch || gradeMatch;
            });
        }

        return list;
    }, [selectedGrade, selectedModule, searchQuery]);

    // Statistics
    const totalChapters = BIOLOGY_CHAPTERS.length;
    const completedCount = Object.keys(completedMap).length;
    const completionPercent = Math.round((completedCount / totalChapters) * 100);

    const grades = [
        { id: "all", label: "All Classes (6–12)" },
        { id: "6", label: "Class 6" },
        { id: "7", label: "Class 7" },
        { id: "8", label: "Class 8" },
        { id: "9", label: "Class 9" },
        { id: "10", label: "Class 10" },
        { id: "11", label: "Class 11" },
        { id: "12", label: "Class 12" }
    ];

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
            <Navbar />

            <div style={{ maxWidth: "1500px", margin: "0 auto", padding: "32px 24px" }}>
                {/* Return to Platform Link */}
                <div style={{ marginBottom: "18px" }}>
                    <button
                        onClick={() => navigate("/")}
                        style={{
                            background: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid var(--border-glass)",
                            color: "var(--text-secondary)",
                            padding: "8px 16px",
                            borderRadius: "10px",
                            fontSize: "0.85rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = "#10b981";
                            e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = "var(--text-secondary)";
                            e.currentTarget.style.borderColor = "var(--border-glass)";
                        }}
                    >
                        <FaArrowLeft /> Return to Spatial Platform Home
                    </button>
                </div>

                {/* Hero Header with Emerald/Teal Theme */}
                <div
                    style={{
                        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 50%, rgba(15, 23, 42, 0.8) 100%)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        borderRadius: "24px",
                        padding: "36px 32px",
                        marginBottom: "32px",
                        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                        position: "relative",
                        overflow: "hidden"
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "24px" }}>
                        <div style={{ maxWidth: "800px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                                <span style={{
                                    fontSize: "0.75rem",
                                    fontWeight: "800",
                                    letterSpacing: "1px",
                                    textTransform: "uppercase",
                                    padding: "4px 12px",
                                    borderRadius: "12px",
                                    background: "rgba(16, 185, 129, 0.2)",
                                    color: "#10b981",
                                    border: "1px solid rgba(16, 185, 129, 0.4)"
                                }}>
                                    🌱 Secondary & Higher Secondary Education
                                </span>
                                <span style={{
                                    fontSize: "0.75rem",
                                    fontWeight: "700",
                                    padding: "4px 12px",
                                    borderRadius: "12px",
                                    background: "rgba(6, 182, 212, 0.15)",
                                    color: "#06b6d4",
                                    border: "1px solid rgba(6, 182, 212, 0.3)"
                                }}>
                                    Classes 6 to 12
                                </span>
                            </div>

                            <h1 style={{
                                fontSize: "2.4rem",
                                fontFamily: "var(--font-display)",
                                fontWeight: "800",
                                background: "linear-gradient(135deg, #ffffff 40%, #10b981 80%, #06b6d4 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                marginBottom: "10px",
                                letterSpacing: "-0.5px"
                            }}>
                                🧬 3D Biology Learning Dashboard
                            </h1>

                            <p style={{ color: "var(--text-secondary)", fontSize: "1.02rem", lineHeight: "1.6" }}>
                                Explore comprehensive school biology through interactive 3D spatial models, grade-aligned lesson chapters,
                                terminology glossaries, and instant self-assessment quizzes across 5 core disciplines.
                            </p>
                        </div>

                        {/* Student Progress Badge */}
                        <div style={{
                            background: "rgba(15, 23, 42, 0.7)",
                            border: "1px solid rgba(16, 185, 129, 0.35)",
                            borderRadius: "18px",
                            padding: "20px 24px",
                            minWidth: "240px",
                            backdropFilter: "blur(12px)"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                                    <FaTrophy style={{ color: "#f59e0b" }} /> Your Progress
                                </span>
                                <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#10b981" }}>
                                    {completionPercent}%
                                </span>
                            </div>
                            <div style={{ width: "100%", height: "8px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "6px", overflow: "hidden", marginBottom: "12px" }}>
                                <div style={{
                                    width: `${completionPercent}%`,
                                    height: "100%",
                                    background: "linear-gradient(90deg, #10b981, #06b6d4)",
                                    borderRadius: "6px",
                                    transition: "width 0.4s ease"
                                }} />
                            </div>
                            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                                <strong style={{ color: "var(--text-primary)" }}>{completedCount}</strong> of {totalChapters} chapters completed
                            </div>
                        </div>
                    </div>

                    {/* Stats Pill Row */}
                    <div style={{ display: "flex", gap: "16px", marginTop: "24px", flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(15, 23, 42, 0.6)", padding: "8px 14px", borderRadius: "10px", fontSize: "0.85rem", border: "1px solid var(--border-glass)" }}>
                            <FaBookOpen style={{ color: "#10b981" }} /> <strong>5</strong> Modules
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(15, 23, 42, 0.6)", padding: "8px 14px", borderRadius: "10px", fontSize: "0.85rem", border: "1px solid var(--border-glass)" }}>
                            <FaCube style={{ color: "#06b6d4" }} /> <strong>6+</strong> Real 3D Models
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(15, 23, 42, 0.6)", padding: "8px 14px", borderRadius: "10px", fontSize: "0.85rem", border: "1px solid var(--border-glass)" }}>
                            <FaGraduationCap style={{ color: "#8b5cf6" }} /> <strong>Classes 6–12</strong> CBSE/ICSE Compatible
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(15, 23, 42, 0.6)", padding: "8px 14px", borderRadius: "10px", fontSize: "0.85rem", border: "1px solid var(--border-glass)" }}>
                            <FaCheckCircle style={{ color: "#f59e0b" }} /> <strong>60+</strong> Interactive Quiz Questions
                        </div>
                    </div>
                </div>

                {/* Grade Selection Filter Bar */}
                <div style={{ marginBottom: "28px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "var(--text-secondary)", fontSize: "0.88rem", fontWeight: "600" }}>
                        <FaFilter style={{ color: "#10b981" }} /> Filter by School Grade:
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {grades.map(g => {
                            const isSelected = selectedGrade === g.id;
                            return (
                                <button
                                    key={g.id}
                                    onClick={() => setSelectedGrade(g.id)}
                                    style={{
                                        padding: "8px 16px",
                                        borderRadius: "10px",
                                        fontSize: "0.85rem",
                                        fontWeight: isSelected ? "700" : "500",
                                        background: isSelected
                                            ? "linear-gradient(135deg, #10b981, #059669)"
                                            : "rgba(15, 23, 42, 0.7)",
                                        color: isSelected ? "#ffffff" : "var(--text-secondary)",
                                        border: `1px solid ${isSelected ? "#10b981" : "var(--border-glass)"}`,
                                        cursor: "pointer",
                                        boxShadow: isSelected ? "0 4px 14px rgba(16, 185, 129, 0.3)" : "none",
                                        transition: "all 0.2s ease"
                                    }}
                                >
                                    {g.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 5 Core Biology Modules Showcase */}
                <div style={{ marginBottom: "36px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                        <h2 style={{ fontSize: "1.3rem", fontWeight: "700", fontFamily: "var(--font-display)", display: "flex", alignItems: "center", gap: "10px" }}>
                            📚 Core Biology Learning Modules
                        </h2>
                        {selectedModule !== "all" && (
                            <button
                                onClick={() => setSelectedModule("all")}
                                style={{
                                    background: "transparent",
                                    color: "#10b981",
                                    fontSize: "0.82rem",
                                    fontWeight: "600",
                                    border: "none",
                                    cursor: "pointer"
                                }}
                            >
                                Reset Module Filter ✕
                            </button>
                        )}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
                        {BIOLOGY_MODULES.map(m => {
                            const isSelected = selectedModule === m.id;
                            return (
                                <motion.div
                                    key={m.id}
                                    whileHover={{ y: -4 }}
                                    onClick={() => setSelectedModule(isSelected ? "all" : m.id)}
                                    style={{
                                        background: isSelected ? m.gradient : "rgba(15, 23, 42, 0.7)",
                                        border: `1.5px solid ${isSelected ? m.badgeColor : "var(--border-glass)"}`,
                                        borderRadius: "16px",
                                        padding: "20px",
                                        cursor: "pointer",
                                        transition: "all 0.25s ease",
                                        boxShadow: isSelected ? `0 8px 24px ${m.borderColor}` : "none",
                                        position: "relative"
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                        <span style={{ fontSize: "1.8rem" }}>{m.icon}</span>
                                        <span style={{
                                            fontSize: "0.72rem",
                                            fontWeight: "700",
                                            padding: "3px 8px",
                                            borderRadius: "8px",
                                            background: `rgba(255, 255, 255, 0.08)`,
                                            color: m.badgeColor
                                        }}>
                                            {m.recommendedGrades}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: "1.05rem", fontWeight: "700", marginBottom: "6px", color: isSelected ? "#ffffff" : "var(--text-primary)" }}>
                                        {m.number}. {m.title}
                                    </h3>
                                    <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: "1.45", marginBottom: "14px" }}>
                                        {m.description}
                                    </p>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.78rem", color: "var(--text-muted)", borderTop: "1px solid var(--border-glass)", paddingTop: "10px" }}>
                                        <span>{m.topicsCount} Key Topics</span>
                                        <span style={{ color: isSelected ? m.badgeColor : "var(--text-secondary)", fontWeight: "600" }}>
                                            {isSelected ? "Active Filter ✓" : "Click to View →"}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Chapter Explorer with Search */}
                <div style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "16px" }}>
                        <div>
                            <h2 style={{ fontSize: "1.3rem", fontWeight: "700", fontFamily: "var(--font-display)", display: "flex", alignItems: "center", gap: "10px" }}>
                                📖 Interactive Chapter Curriculum
                            </h2>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "2px" }}>
                                Showing {filteredChapters.length} of {totalChapters} chapters
                            </p>
                        </div>

                        {/* Search Input */}
                        <div style={{ position: "relative", minWidth: "280px" }}>
                            <FaSearch style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                            <input
                                type="text"
                                placeholder="Search chapters, topics, or models..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: "100%",
                                    paddingLeft: "38px",
                                    background: "rgba(15, 23, 42, 0.8)",
                                    border: "1px solid var(--border-glass)",
                                    borderRadius: "12px",
                                    fontSize: "0.88rem"
                                }}
                            />
                        </div>
                    </div>

                    {/* Chapter Cards Grid */}
                    {filteredChapters.length === 0 ? (
                        <div style={{
                            textAlign: "center",
                            padding: "60px 20px",
                            background: "rgba(15, 23, 42, 0.5)",
                            borderRadius: "16px",
                            border: "1px dashed var(--border-glass)"
                        }}>
                            <FaSearch style={{ fontSize: "2rem", color: "var(--text-muted)", marginBottom: "12px" }} />
                            <h3 style={{ fontSize: "1.1rem", color: "var(--text-secondary)" }}>No chapters found</h3>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "4px" }}>
                                Try selecting "All Classes" or clearing your search term.
                            </p>
                            <button
                                className="btn-secondary"
                                onClick={() => { setSelectedGrade("all"); setSelectedModule("all"); setSearchQuery(""); }}
                                style={{ marginTop: "16px", fontSize: "0.85rem" }}
                            >
                                Reset All Filters
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
                            {filteredChapters.map(ch => {
                                const isCompleted = !!completedMap[ch.id];
                                const scoreData = completedMap[ch.id];

                                return (
                                    <motion.div
                                        key={ch.id}
                                        whileHover={{ y: -4 }}
                                        style={{
                                            background: "rgba(15, 23, 42, 0.85)",
                                            border: `1px solid ${isCompleted ? "rgba(16, 185, 129, 0.4)" : "var(--border-glass)"}`,
                                            borderRadius: "18px",
                                            padding: "24px",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                            transition: "all 0.2s ease",
                                            boxShadow: isCompleted ? "0 4px 20px rgba(16, 185, 129, 0.1)" : "0 4px 20px rgba(0, 0, 0, 0.3)"
                                        }}
                                    >
                                        <div>
                                            {/* Badges Row */}
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "6px" }}>
                                                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                                    <span style={{
                                                        fontSize: "0.72rem",
                                                        fontWeight: "800",
                                                        padding: "3px 8px",
                                                        borderRadius: "6px",
                                                        background: "rgba(16, 185, 129, 0.15)",
                                                        color: "#10b981",
                                                        border: "1px solid rgba(16, 185, 129, 0.3)"
                                                    }}>
                                                        {ch.gradeRange}
                                                    </span>
                                                    <span style={{
                                                        fontSize: "0.72rem",
                                                        fontWeight: "600",
                                                        padding: "3px 8px",
                                                        borderRadius: "6px",
                                                        background: "rgba(6, 182, 212, 0.12)",
                                                        color: "#06b6d4"
                                                    }}>
                                                        {ch.difficulty}
                                                    </span>
                                                </div>

                                                {/* 3D Model Badge */}
                                                <span style={{
                                                    fontSize: "0.72rem",
                                                    fontWeight: "700",
                                                    padding: "3px 8px",
                                                    borderRadius: "6px",
                                                    background: "rgba(139, 92, 246, 0.18)",
                                                    color: "#a78bfa",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "4px"
                                                }}>
                                                    <FaCube /> {ch.modelName} 3D
                                                </span>
                                            </div>

                                            {/* Chapter Title */}
                                            <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "10px", lineHeight: "1.35", color: "#ffffff" }}>
                                                {ch.title}
                                            </h3>

                                            {/* Summary */}
                                            <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: "1.5", marginBottom: "16px" }}>
                                                {ch.overview || (Array.isArray(ch.summary) ? ch.summary[0] : ch.summary) || ""}
                                            </p>

                                            {/* Learning Objectives Preview */}
                                            <div style={{ marginBottom: "18px" }}>
                                                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", fontWeight: "700" }}>
                                                    Key Objectives:
                                                </span>
                                                <ul style={{ paddingLeft: "18px", marginTop: "6px", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                                                    {(ch.learningObjectives || []).slice(0, 2).map((obj, i) => (
                                                        <li key={i}>{obj}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Bottom Action Footer */}
                                        <div style={{ borderTop: "1px solid var(--border-glass)", paddingTop: "16px" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                                                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                                    <FaClock /> {ch.readTime || ch.estimatedTime || "15 mins"}
                                                </span>
                                                <span>
                                                    {(ch.quiz || ch.reviewQuestions || []).length} Quiz Questions
                                                </span>
                                            </div>

                                            {/* Completed Score or Start Lesson */}
                                            {isCompleted && scoreData ? (
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                                    <span style={{ fontSize: "0.8rem", color: "#10b981", fontWeight: "700", display: "flex", alignItems: "center", gap: "5px" }}>
                                                        <FaCheckCircle /> Quiz Passed ({scoreData.score}/{scoreData.total})
                                                    </span>
                                                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                                        {Math.round((scoreData.score / scoreData.total) * 100)}%
                                                    </span>
                                                </div>
                                            ) : null}

                                            <button
                                                onClick={() => navigate(`/biology/lesson/${ch.id}`)}
                                                style={{
                                                    width: "100%",
                                                    background: isCompleted
                                                        ? "rgba(16, 185, 129, 0.15)"
                                                        : "linear-gradient(135deg, #10b981, #059669)",
                                                    color: isCompleted ? "#10b981" : "#ffffff",
                                                    border: isCompleted ? "1px solid rgba(16, 185, 129, 0.4)" : "none",
                                                    padding: "10px 16px",
                                                    borderRadius: "10px",
                                                    fontWeight: "700",
                                                    fontSize: "0.88rem",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: "8px",
                                                    cursor: "pointer",
                                                    transition: "all 0.2s ease",
                                                    boxShadow: isCompleted ? "none" : "0 4px 14px rgba(16, 185, 129, 0.35)"
                                                }}
                                            >
                                                {isCompleted ? "Review 3D Lesson & Quiz" : "Start 3D Lesson"} <FaArrowRight />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Educational Disclaimer Banner */}
                <div style={{
                    marginTop: "48px",
                    padding: "20px 24px",
                    background: "rgba(15, 23, 42, 0.6)",
                    border: "1px solid var(--border-glass)",
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px"
                }}>
                    <FaShieldAlt style={{ color: "var(--text-muted)", fontSize: "1.4rem", marginTop: "2px", flexShrink: 0 }} />
                    <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                        <strong style={{ color: "var(--text-primary)" }}>Curriculum & Educational Notice:</strong> The content, 3D anatomical models,
                        and evaluations in this Biology section are created exclusively for academic learning and secondary school science curricula (Classes 6–12).
                        They are not intended for clinical diagnostics or medical advice.
                    </div>
                </div>
            </div>
        </div>
    );
}

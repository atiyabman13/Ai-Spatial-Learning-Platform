import { useState, useEffect } from "react";
import { curriculumChapters } from "../data/curriculumData";
import AnatomyCanvas from "../three/AnatomyCanvas";
import AITeacherVoiceController from "./AITeacherVoiceController";
import StudentDoubtAssistant from "./StudentDoubtAssistant";
import toast from "react-hot-toast";
import {
    FaBook,
    FaRobot,
    FaCube,
    FaQuestionCircle,
    FaListUl,
    FaLightbulb,
    FaSearch,
    FaSlidersH,
    FaChevronRight,
    FaLayerGroup
} from "react-icons/fa";

export default function MultiChapterViewer() {
    const [selectedChapter, setSelectedChapter] = useState(curriculumChapters[0]);
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [actionCue, setActionCue] = useState(null);
    const [selectedPart, setSelectedPart] = useState(null);
    const [activeTab, setActiveTab] = useState("teacher"); // 'teacher', 'doubt', 'hierarchy'
    const [searchQuery, setSearchQuery] = useState("");

    // Reset step index when chapter changes
    const handleChapterSelect = (ch) => {
        setSelectedChapter(ch);
        setActiveStepIndex(0);
        setActionCue(null);
        setSelectedPart(null);
        toast.success(`Switched to: ${ch.title}`, { icon: "📚" });
    };

    const handleExecuteCue = (cue) => {
        setActionCue(cue);
        if (cue?.action?.targetMesh) {
            setSelectedPart(cue.action.targetMesh);
        }
    };

    const filteredChapters = curriculumChapters.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Header & API Key Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                <div>
                    <h2 style={{ fontSize: "1.8rem", fontFamily: "var(--font-display)", fontWeight: "800" }}>
                        🎓 AI Teacher Interactive 3D Multi-Chapter Learning Stage
                    </h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "4px" }}>
                        Synchronized 3D models across Biology, Physics, and Chemistry. The AI Teacher speaks while dynamically animating camera focus and mesh highlights.
                    </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                        style={{
                            background: "rgba(168, 85, 247, 0.12)",
                            border: "1px solid rgba(168, 85, 247, 0.3)",
                            color: "var(--accent-purple)",
                            padding: "6px 14px",
                            borderRadius: "10px",
                            fontSize: "0.82rem",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                        }}
                    >
                        <span>⚡ Local Knowledge Engine</span>
                    </div>
                </div>
            </div>

            {/* MAIN 3-COLUMN EDUCATIONAL WORKSPACE */}
            <div className="multi-chapter-grid" style={{ gap: "20px" }}>
                {/* COLUMN 1: MULTI-CHAPTER CURRICULUM SIDEBAR */}
                <div className="glass-card" style={{ display: "flex", flexDirection: "column", height: "clamp(500px, 70vh, 760px)", minHeight: "500px" }}>
                    <h3 style={{ fontSize: "1.05rem", fontFamily: "var(--font-display)", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaBook style={{ color: "var(--accent-cyan)" }} /> Curriculum Chapters
                    </h3>

                    {/* Search Bar */}
                    <div style={{ position: "relative", marginBottom: "14px" }}>
                        <FaSearch style={{ position: "absolute", left: "10px", top: "12px", color: "var(--text-muted)", fontSize: "0.8rem" }} />
                        <input
                            type="text"
                            placeholder="Filter Subject / Chapter..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: "100%", paddingLeft: "32px", fontSize: "0.85rem" }}
                        />
                    </div>

                    {/* Chapter Accordion List */}
                    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                        {filteredChapters.map((ch) => {
                            const isSelected = selectedChapter.id === ch.id;
                            return (
                                <div
                                    key={ch.id}
                                    onClick={() => handleChapterSelect(ch)}
                                    style={{
                                        padding: "12px 14px",
                                        borderRadius: "12px",
                                        background: isSelected ? "rgba(6, 182, 212, 0.15)" : "rgba(255, 255, 255, 0.03)",
                                        border: isSelected ? "1.5px solid var(--accent-cyan)" : "1px solid var(--border-glass)",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease"
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                        <span style={{
                                            fontSize: "0.72rem",
                                            fontWeight: "800",
                                            color: ch.subject === "Biology" ? "#22c55e" : ch.subject === "Physics" ? "#f59e0b" : "#a855f7",
                                            textTransform: "uppercase"
                                        }}>
                                            {ch.subject} • {ch.category}
                                        </span>
                                        {isSelected && <FaChevronRight style={{ color: "var(--accent-cyan)", fontSize: "0.8rem" }} />}
                                    </div>
                                    <h4 style={{ fontSize: "0.9rem", color: isSelected ? "#ffffff" : "var(--text-secondary)", lineHeight: "1.4" }}>
                                        {ch.title}
                                    </h4>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* COLUMN 2: CENTER INTERACTIVE 3D STAGE & PART INSPECTOR */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* Main Three.js R3F Stage Canvas */}
                    <div style={{ height: "clamp(500px, 70vh, 760px)", minHeight: "500px", borderRadius: "20px", overflow: "hidden", position: "relative" }}>
                        <AnatomyCanvas
                            activeModel={selectedChapter.modelName}
                            onModelChange={(newModel) => {
                                const matched = curriculumChapters.find(c => c.modelName === newModel);
                                if (matched && matched.id !== selectedChapter.id) {
                                    handleChapterSelect(matched);
                                }
                            }}
                            selectedPart={selectedPart}
                            onSelectPart={(part) => setSelectedPart(part)}
                            actionCue={actionCue}
                        />
                    </div>

                    {/* Chapter Overview & Selected Part Detail Card */}
                    <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h4 style={{ fontSize: "1rem", color: "var(--accent-cyan)", display: "flex", alignItems: "center", gap: "8px" }}>
                                <FaLightbulb /> Chapter Overview & Scientific Notes
                            </h4>
                            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                                Model: {selectedChapter.modelName}
                            </span>
                        </div>
                        <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: "1.6", whiteSpace: "pre-line" }}>
                            {selectedChapter.overviewText}
                        </p>
                    </div>
                </div>

                {/* COLUMN 3: RIGHT PANEL (AI TEACHER VOICE + SCRIPT + DOUBT Q&A) */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", height: "clamp(500px, 70vh, 760px)", minHeight: "500px" }}>
                    {/* Tab Navigation Buttons */}
                    <div style={{
                        display: "flex",
                        background: "rgba(15, 23, 42, 0.8)",
                        border: "1px solid var(--border-glass)",
                        borderRadius: "14px",
                        padding: "4px"
                    }}>
                        <button
                            onClick={() => setActiveTab("teacher")}
                            style={{
                                flex: 1,
                                background: activeTab === "teacher" ? "var(--accent-cyan)" : "transparent",
                                color: activeTab === "teacher" ? "#0a0d14" : "var(--text-secondary)",
                                border: "none",
                                borderRadius: "10px",
                                padding: "8px",
                                fontSize: "0.82rem",
                                fontWeight: "700",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px",
                                cursor: "pointer"
                            }}
                        >
                            <FaRobot /> AI Teacher Voice
                        </button>

                        <button
                            onClick={() => setActiveTab("doubt")}
                            style={{
                                flex: 1,
                                background: activeTab === "doubt" ? "var(--accent-purple)" : "transparent",
                                color: activeTab === "doubt" ? "#ffffff" : "var(--text-secondary)",
                                border: "none",
                                borderRadius: "10px",
                                padding: "8px",
                                fontSize: "0.82rem",
                                fontWeight: "700",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px",
                                cursor: "pointer"
                            }}
                        >
                            <FaQuestionCircle /> Student Q&A
                        </button>

                        <button
                            onClick={() => setActiveTab("hierarchy")}
                            style={{
                                flex: 1,
                                background: activeTab === "hierarchy" ? "rgba(255, 255, 255, 0.15)" : "transparent",
                                color: activeTab === "hierarchy" ? "#ffffff" : "var(--text-secondary)",
                                border: "none",
                                borderRadius: "10px",
                                padding: "8px",
                                fontSize: "0.82rem",
                                fontWeight: "700",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px",
                                cursor: "pointer"
                            }}
                        >
                            <FaLayerGroup /> 3D Hierarchy
                        </button>
                    </div>

                    {/* Tab 1: AI Teacher Voice & Script Controller */}
                    {activeTab === "teacher" && (
                        <AITeacherVoiceController
                            chapter={selectedChapter}
                            activeStepIndex={activeStepIndex}
                            onStepChange={(idx) => setActiveStepIndex(idx)}
                            onExecuteCue={handleExecuteCue}
                        />
                    )}

                    {/* Tab 2: Student Doubt Q&A Assistant */}
                    {activeTab === "doubt" && (
                        <StudentDoubtAssistant
                            chapter={selectedChapter}
                            activePart={selectedPart}
                            onExecuteActionCue={handleExecuteCue}
                        />
                    )}

                    {/* Tab 3: 3D Component Hierarchy Inspector */}
                    {activeTab === "hierarchy" && (
                        <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "12px", height: "100%", maxHeight: "640px", overflowY: "auto" }}>
                            <h4 style={{ fontSize: "0.95rem", color: "var(--accent-cyan)", display: "flex", alignItems: "center", gap: "6px" }}>
                                <FaLayerGroup /> Addressable 3D Component Hierarchy
                            </h4>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {selectedChapter.partsHierarchy.map((part) => {
                                    const isSelected = selectedPart && selectedPart.toLowerCase().includes(part.id);
                                    return (
                                        <div
                                            key={part.id}
                                            onClick={() => setSelectedPart(part.name)}
                                            style={{
                                                padding: "10px 12px",
                                                borderRadius: "10px",
                                                background: isSelected ? "rgba(6, 182, 212, 0.15)" : "rgba(255, 255, 255, 0.03)",
                                                border: isSelected ? `1.5px solid ${part.color}` : "1px solid var(--border-glass)",
                                                cursor: "pointer",
                                                transition: "all 0.2s ease"
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: part.color }} />
                                                <h5 style={{ fontSize: "0.85rem", color: isSelected ? "var(--accent-cyan)" : "#ffffff" }}>
                                                    {part.name}
                                                </h5>
                                            </div>
                                            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                                                {part.detail}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

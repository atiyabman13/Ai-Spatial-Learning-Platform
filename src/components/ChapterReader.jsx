import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { API_URL, getApiUrl } from "../config/api";
import {
    FaBook,
    FaSearch,
    FaFilePdf,
    FaDownload,
    FaFont,
    FaHighlighter,
    FaGraduationCap,
    FaLayerGroup,
    FaFilter,
    FaCheckCircle,
    FaInfoCircle,
    FaChevronRight
} from "react-icons/fa";
import {
    LEARNING_STAGES,
    SUBJECT_METADATA,
    SUBJECT_WISE_CHAPTERS
} from "../data/subjectWiseCurriculumData";
import FormattedMessage from "./FormattedMessage";

export default function ChapterReader({ initialMode = "subject-wise" }) {
    // Mode: 'subject-wise' (Curriculum Classes 6-12) or 'library' (Uploaded Documents)
    const [viewMode, setViewMode] = useState(initialMode);
    const [uploadedChapters, setUploadedChapters] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState(null);

    // Filters
    const [selectedStage, setSelectedStage] = useState("all");
    const [selectedClass, setSelectedClass] = useState("all");
    const [selectedSubject, setSelectedSubject] = useState("all");
    const [search, setSearch] = useState("");
    const [textSearch, setTextSearch] = useState("");
    const [fontSize, setFontSize] = useState(0.95); // in rem

    // Sync initialMode prop if passed
    useEffect(() => {
        if (initialMode) {
            setViewMode(initialMode);
        }
    }, [initialMode]);

    // Fetch existing uploaded chapters from MongoDB
    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/chapters/all`);
                const list = res.data.chapters || [];
                setUploadedChapters(list);
            } catch (error) {
                console.error("Fetch chapters error:", error);
            }
        };
        fetchChapters();
    }, []);

    // Combine and format chapters
    const combinedChapters = useMemo(() => {
        if (viewMode === "library") {
            return uploadedChapters.map(ch => ({
                id: ch._id,
                title: ch.title,
                subject: ch.subject || "General Anatomy",
                classNumber: ch.classNumber || 10,
                stageId: "core",
                description: ch.description || "Uploaded institutional learning material.",
                hasFullContent: Boolean(ch.extractedText && ch.extractedText.length > 20),
                extractedText: ch.extractedText || "Text extraction details unavailable for this file. Click Download Original PDF above to view complete document.",
                fileUrl: ch.fileUrl,
                fileName: ch.fileName,
                isUploaded: true
            }));
        }

        // Subject-wise mode: start with curated curriculum chapters
        let list = [...SUBJECT_WISE_CHAPTERS];

        // Also merge any uploaded chapters matching subjects so user uploads are visible
        uploadedChapters.forEach(up => {
            list.push({
                id: up._id,
                title: `${up.title} (Uploaded Note)`,
                subject: up.subject || "Anatomy",
                classNumber: up.classNumber || 10,
                stageId: "core",
                chapterNumber: 99,
                description: up.description || "Uploaded curriculum document.",
                hasFullContent: Boolean(up.extractedText && up.extractedText.length > 20),
                extractedText: up.extractedText || "",
                fileUrl: up.fileUrl,
                fileName: up.fileName,
                isUploaded: true,
                syllabusTopics: ["Uploaded Study Material", "Class Notes"],
                keyFormulas: [],
                learningObjectives: ["Study instructor provided supplementary notes"]
            });
        });

        // Apply Stage Filter
        if (selectedStage !== "all") {
            list = list.filter(c => c.stageId === selectedStage);
        }

        // Apply Class Filter
        if (selectedClass !== "all") {
            const cNum = parseInt(selectedClass, 10);
            list = list.filter(c => c.classNumber === cNum);
        }

        // Apply Subject Filter
        if (selectedSubject !== "all") {
            list = list.filter(c => c.subject.toLowerCase() === selectedSubject.toLowerCase());
        }

        // Apply Search Filter
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(c =>
                c.title.toLowerCase().includes(q) ||
                c.subject.toLowerCase().includes(q) ||
                (c.description && c.description.toLowerCase().includes(q)) ||
                (c.syllabusTopics && c.syllabusTopics.some(t => t.toLowerCase().includes(q)))
            );
        }

        return list;
    }, [viewMode, uploadedChapters, selectedStage, selectedClass, selectedSubject, search]);

    // Set initial selected chapter if none selected
    useEffect(() => {
        if (!selectedChapter && combinedChapters.length > 0) {
            setSelectedChapter(combinedChapters[0]);
        } else if (selectedChapter && !combinedChapters.some(c => c.id === selectedChapter.id) && combinedChapters.length > 0) {
            setSelectedChapter(combinedChapters[0]);
        }
    }, [combinedChapters, selectedChapter]);

    // Highlight searched text inside chapter body
    const renderHighlightedText = (text) => {
        if (!text) return "Text extraction details unavailable for this file. Click Download Original PDF above to view complete document.";
        if (!textSearch.trim()) return text;

        const regex = new RegExp(`(${textSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, i) =>
            regex.test(part) ? (
                <mark key={i} style={{ background: "#f59e0b", color: "#0f172a", padding: "2px 4px", borderRadius: "3px", fontWeight: "600" }}>
                    {part}
                </mark>
            ) : (
                part
            )
        );
    };

    const getStageBadge = (stageId) => {
        const stage = LEARNING_STAGES.find(s => s.id === stageId);
        return stage ? stage.name : "Curriculum";
    };

    return (
        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "24px" }}>
            {/* Left Chapter Selector Sidebar with Multi-Tier Filters */}
            <div className="glass-card" style={{ height: "760px", display: "flex", flexDirection: "column" }}>
                {/* Header & Mode Switcher */}
                <div style={{ marginBottom: "14px", borderBottom: "1px solid var(--border-glass)", paddingBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                        <h3 style={{ fontSize: "1.1rem", fontFamily: "var(--font-display)", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                            <FaBook style={{ color: "var(--accent-cyan)" }} /> Chapter Library
                        </h3>
                        <span style={{ fontSize: "0.72rem", background: "rgba(6, 182, 212, 0.15)", color: "var(--accent-cyan)", padding: "2px 8px", borderRadius: "8px", fontWeight: "700" }}>
                            Classes 6–12
                        </span>
                    </div>

                    {/* View Switcher Tabs */}
                    <div style={{ display: "flex", gap: "6px" }}>
                        <button
                            onClick={() => setViewMode("subject-wise")}
                            style={{
                                flex: 1,
                                padding: "6px 8px",
                                fontSize: "0.76rem",
                                borderRadius: "8px",
                                border: viewMode === "subject-wise" ? "1px solid var(--accent-cyan)" : "1px solid var(--border-glass)",
                                background: viewMode === "subject-wise" ? "rgba(6, 182, 212, 0.2)" : "rgba(15, 23, 42, 0.4)",
                                color: viewMode === "subject-wise" ? "#fff" : "var(--text-secondary)",
                                fontWeight: "700",
                                cursor: "pointer",
                                transition: "0.2s"
                            }}
                        >
                            📚 Subject-wise (6–12)
                        </button>
                        <button
                            onClick={() => setViewMode("library")}
                            style={{
                                flex: 1,
                                padding: "6px 8px",
                                fontSize: "0.76rem",
                                borderRadius: "8px",
                                border: viewMode === "library" ? "1px solid var(--accent-purple)" : "1px solid var(--border-glass)",
                                background: viewMode === "library" ? "rgba(168, 85, 247, 0.2)" : "rgba(15, 23, 42, 0.4)",
                                color: viewMode === "library" ? "#fff" : "var(--text-secondary)",
                                fontWeight: "700",
                                cursor: "pointer",
                                transition: "0.2s"
                            }}
                        >
                            📁 Uploaded PDFs ({uploadedChapters.length})
                        </button>
                    </div>
                </div>

                {/* Filters Row (Active in Subject-wise mode) */}
                {viewMode === "subject-wise" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px", borderBottom: "1px solid var(--border-glass)", paddingBottom: "12px" }}>
                        {/* 1. Stage Selector (Foundation, Core Science, Advanced Science) */}
                        <div style={{ display: "flex", gap: "4px" }}>
                            <button
                                onClick={() => { setSelectedStage("all"); setSelectedClass("all"); }}
                                style={{
                                    flex: 1,
                                    padding: "4px 6px",
                                    fontSize: "0.7rem",
                                    borderRadius: "6px",
                                    border: selectedStage === "all" ? "1px solid #38bdf8" : "1px solid var(--border-glass)",
                                    background: selectedStage === "all" ? "rgba(56, 189, 248, 0.2)" : "transparent",
                                    color: selectedStage === "all" ? "#38bdf8" : "var(--text-muted)",
                                    fontWeight: "700",
                                    cursor: "pointer"
                                }}
                            >
                                All Stages
                            </button>
                            {LEARNING_STAGES.map(st => (
                                <button
                                    key={st.id}
                                    onClick={() => { setSelectedStage(st.id); setSelectedClass("all"); }}
                                    style={{
                                        flex: 1,
                                        padding: "4px 6px",
                                        fontSize: "0.68rem",
                                        borderRadius: "6px",
                                        border: selectedStage === st.id ? `1px solid ${st.badgeColor}` : "1px solid var(--border-glass)",
                                        background: selectedStage === st.id ? `${st.badgeColor}25` : "transparent",
                                        color: selectedStage === st.id ? st.badgeColor : "var(--text-muted)",
                                        fontWeight: "700",
                                        cursor: "pointer"
                                    }}
                                    title={st.description}
                                >
                                    {st.name}
                                </button>
                            ))}
                        </div>

                        {/* 2. Class Selector Filter */}
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: "600" }}>Class:</span>
                            <div style={{ display: "flex", gap: "3px", overflowX: "auto", flex: 1, paddingBottom: "2px" }}>
                                <button
                                    onClick={() => setSelectedClass("all")}
                                    style={{
                                        padding: "2px 6px",
                                        fontSize: "0.68rem",
                                        borderRadius: "4px",
                                        background: selectedClass === "all" ? "var(--accent-cyan)" : "rgba(255, 255, 255, 0.08)",
                                        color: selectedClass === "all" ? "#000" : "var(--text-secondary)",
                                        border: "none",
                                        fontWeight: "700",
                                        cursor: "pointer"
                                    }}
                                >
                                    All
                                </button>
                                {[6, 7, 8, 9, 10, 11, 12].map(cNum => {
                                    const isStageMatch = selectedStage === "all" ||
                                        (selectedStage === "foundation" && [6, 7, 8].includes(cNum)) ||
                                        (selectedStage === "core" && [9, 10].includes(cNum)) ||
                                        (selectedStage === "advanced" && [11, 12].includes(cNum));
                                    if (!isStageMatch) return null;

                                    return (
                                        <button
                                            key={cNum}
                                            onClick={() => setSelectedClass(String(cNum))}
                                            style={{
                                                padding: "2px 6px",
                                                fontSize: "0.68rem",
                                                borderRadius: "4px",
                                                background: selectedClass === String(cNum) ? "var(--accent-cyan)" : "rgba(255, 255, 255, 0.08)",
                                                color: selectedClass === String(cNum) ? "#000" : "var(--text-secondary)",
                                                border: "none",
                                                fontWeight: "700",
                                                cursor: "pointer"
                                            }}
                                        >
                                            {cNum}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 3. Subject Selector Filter (Physics, Chemistry, Biology, Anatomy) */}
                        <div style={{ display: "flex", gap: "4px" }}>
                            {["all", "Physics", "Chemistry", "Biology", "Anatomy"].map(sub => {
                                const isAll = sub === "all";
                                const meta = SUBJECT_METADATA[sub];
                                const isSelected = selectedSubject === sub;
                                return (
                                    <button
                                        key={sub}
                                        onClick={() => setSelectedSubject(sub)}
                                        style={{
                                            flex: 1,
                                            padding: "3px 4px",
                                            fontSize: "0.67rem",
                                            borderRadius: "6px",
                                            border: isSelected ? `1px solid ${meta ? meta.color : "#38bdf8"}` : "1px solid var(--border-glass)",
                                            background: isSelected ? `${meta ? meta.color : "#38bdf8"}25` : "rgba(255, 255, 255, 0.04)",
                                            color: isSelected ? (meta ? meta.color : "#fff") : "var(--text-secondary)",
                                            fontWeight: "700",
                                            cursor: "pointer",
                                            whiteSpace: "nowrap"
                                        }}
                                    >
                                        {isAll ? "All Subjects" : `${meta?.icon || ""} ${sub}`}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Search Bar */}
                <div style={{ position: "relative", marginBottom: "12px" }}>
                    <FaSearch style={{ position: "absolute", left: "10px", top: "11px", color: "var(--text-muted)", fontSize: "0.8rem" }} />
                    <input
                        type="text"
                        placeholder="Search chapter or topic..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: "100%", paddingLeft: "32px", fontSize: "0.82rem", height: "34px" }}
                    />
                </div>

                {/* Chapter Cards List */}
                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", paddingRight: "4px" }}>
                    {combinedChapters.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "30px 10px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                            <FaInfoCircle style={{ fontSize: "1.5rem", marginBottom: "8px" }} />
                            <p>No chapters match the selected stage, class, or subject filters.</p>
                            <button
                                onClick={() => { setSelectedStage("all"); setSelectedClass("all"); setSelectedSubject("all"); setSearch(""); }}
                                className="tool-btn"
                                style={{ marginTop: "10px", fontSize: "0.75rem", padding: "4px 10px" }}
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        combinedChapters.map((ch) => {
                            const isSelected = selectedChapter?.id === ch.id;
                            const subMeta = SUBJECT_METADATA[ch.subject] || { color: "#06b6d4", icon: "📖" };

                            return (
                                <div
                                    key={ch.id}
                                    onClick={() => setSelectedChapter(ch)}
                                    style={{
                                        padding: "10px 12px",
                                        borderRadius: "var(--radius-sm)",
                                        background: isSelected ? "rgba(6, 182, 212, 0.15)" : "rgba(30, 41, 59, 0.4)",
                                        border: isSelected ? "1px solid var(--accent-cyan)" : "1px solid var(--border-glass)",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease"
                                    }}
                                >
                                    {/* Top Metadata Badges */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                            <span style={{ fontSize: "0.72rem", color: subMeta.color, fontWeight: "700" }}>
                                                {subMeta.icon} {ch.subject}
                                            </span>
                                            <span style={{ fontSize: "0.65rem", padding: "1px 5px", borderRadius: "4px", background: "rgba(255, 255, 255, 0.1)", color: "var(--text-secondary)", fontWeight: "600" }}>
                                                Class {ch.classNumber}
                                            </span>
                                        </div>

                                        {ch.hasFullContent ? (
                                            <span style={{ fontSize: "0.62rem", color: "var(--accent-emerald)", fontWeight: "700", display: "flex", alignItems: "center", gap: "3px" }}>
                                                <FaCheckCircle style={{ fontSize: "0.6rem" }} /> Available
                                            </span>
                                        ) : (
                                            <span style={{ fontSize: "0.62rem", color: "#f59e0b", fontWeight: "700" }}>
                                                Outline
                                            </span>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h4 style={{ fontSize: "0.85rem", color: isSelected ? "#fff" : "var(--text-primary)", margin: 0, fontWeight: "600", lineHeight: "1.3" }}>
                                        {ch.title}
                                    </h4>

                                    {/* Short summary snippet */}
                                    {ch.description && (
                                        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px", marginBottom: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {ch.description}
                                        </p>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Right Side: Chapter Text Reader & Syllabus Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {selectedChapter ? (
                    <>
                        {/* Chapter Header Card */}
                        <div className="glass-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                    <span style={{
                                        fontSize: "0.72rem",
                                        padding: "2px 8px",
                                        borderRadius: "6px",
                                        background: "rgba(6, 182, 212, 0.15)",
                                        color: "var(--accent-cyan)",
                                        fontWeight: "700"
                                    }}>
                                        Class {selectedChapter.classNumber}
                                    </span>
                                    <span style={{
                                        fontSize: "0.72rem",
                                        padding: "2px 8px",
                                        borderRadius: "6px",
                                        background: "rgba(168, 85, 247, 0.15)",
                                        color: "var(--accent-purple)",
                                        fontWeight: "700"
                                    }}>
                                        {getStageBadge(selectedChapter.stageId)} Stage
                                    </span>
                                    <span style={{
                                        fontSize: "0.72rem",
                                        padding: "2px 8px",
                                        borderRadius: "6px",
                                        background: "rgba(255, 255, 255, 0.08)",
                                        color: SUBJECT_METADATA[selectedChapter.subject]?.color || "#fff",
                                        fontWeight: "700"
                                    }}>
                                        {SUBJECT_METADATA[selectedChapter.subject]?.icon} {selectedChapter.subject}
                                    </span>
                                </div>
                                <h2 style={{ fontSize: "1.35rem", fontFamily: "var(--font-display)", margin: "4px 0" }}>
                                    {selectedChapter.title}
                                </h2>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: 0 }}>
                                    {selectedChapter.description}
                                </p>
                            </div>

                            {selectedChapter.fileUrl && (
                                <a
                                    href={getApiUrl(selectedChapter.fileUrl)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary"
                                    style={{ fontSize: "0.85rem", padding: "8px 14px" }}
                                >
                                    <FaDownload /> Download PDF
                                </a>
                            )}
                        </div>

                        {/* CASE A: Full Educational Content is Available */}
                        {selectedChapter.hasFullContent ? (
                            <div className="glass-card" style={{ height: "650px", display: "flex", flexDirection: "column" }}>
                                {/* Text Controls Header */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", paddingBottom: "10px", borderBottom: "1px solid var(--border-glass)" }}>
                                    <h4 style={{ fontSize: "0.95rem", color: "var(--accent-cyan)", display: "flex", alignItems: "center", gap: "6px", margin: 0 }}>
                                        <FaFilePdf /> Extracted Chapter Contents & Lesson Text
                                    </h4>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <FaFont style={{ fontSize: "0.8rem", color: "var(--text-muted)" }} />
                                        <button
                                            className="tool-btn"
                                            onClick={() => setFontSize((prev) => Math.max(0.75, prev - 0.1))}
                                            style={{ padding: "2px 8px", fontSize: "0.75rem" }}
                                            title="Decrease Font Size"
                                        >
                                            A-
                                        </button>
                                        <button
                                            className="tool-btn"
                                            onClick={() => setFontSize((prev) => Math.min(1.25, prev + 0.1))}
                                            style={{ padding: "2px 8px", fontSize: "0.75rem" }}
                                            title="Increase Font Size"
                                        >
                                            A+
                                        </button>
                                    </div>
                                </div>

                                {/* In-text Search Bar */}
                                <div style={{ position: "relative", marginBottom: "12px" }}>
                                    <FaHighlighter style={{ position: "absolute", left: "10px", top: "10px", color: "var(--accent-cyan)", fontSize: "0.8rem" }} />
                                    <input
                                        type="text"
                                        placeholder="Highlight medical / scientific term in text (e.g. Ventricle, Photosynthesis)..."
                                        value={textSearch}
                                        onChange={(e) => setTextSearch(e.target.value)}
                                        style={{ width: "100%", paddingLeft: "32px", fontSize: "0.85rem", height: "34px" }}
                                    />
                                </div>

                                {/* Main Text Reader */}
                                <div style={{ flex: 1, overflowY: "auto", paddingRight: "6px" }}>
                                    <FormattedMessage
                                        text={selectedChapter.extractedText || "Text extraction details unavailable for this file. Click Download Original PDF above to view complete document."}
                                        highlightTerm={textSearch}
                                        style={{
                                            fontSize: `${fontSize}rem`,
                                            lineHeight: "1.75",
                                            color: "var(--text-secondary)"
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            /* CASE B: Syllabus Outline (Document Pending Upload by Instructor) */
                            <div className="glass-card" style={{ height: "650px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "18px" }}>
                                {/* Informative Notice Banner */}
                                <div style={{
                                    background: "rgba(245, 158, 11, 0.12)",
                                    border: "1px solid rgba(245, 158, 11, 0.35)",
                                    borderRadius: "10px",
                                    padding: "14px 16px",
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "12px"
                                }}>
                                    <FaInfoCircle style={{ color: "#f59e0b", fontSize: "1.2rem", marginTop: "2px", flexShrink: 0 }} />
                                    <div>
                                        <h4 style={{ color: "#f59e0b", fontSize: "0.95rem", margin: "0 0 4px 0", fontWeight: "700" }}>
                                            Syllabus Outline — Supplementary PDF Pending Upload
                                        </h4>
                                        <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", margin: 0, lineHeight: "1.4" }}>
                                            This curriculum unit is registered in the <strong>Class {selectedChapter.classNumber} {selectedChapter.subject}</strong> syllabus. Your teacher has not uploaded a supplementary PDF notes file for this specific chapter yet. The verified curriculum outline, core topics, and formulas are detailed below.
                                        </p>
                                    </div>
                                </div>

                                {/* 1. Core Syllabus Topics */}
                                {selectedChapter.syllabusTopics && selectedChapter.syllabusTopics.length > 0 && (
                                    <div style={{ background: "rgba(15, 23, 42, 0.4)", border: "1px solid var(--border-glass)", borderRadius: "10px", padding: "16px" }}>
                                        <h4 style={{ fontSize: "0.95rem", color: "var(--accent-cyan)", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                                            <FaLayerGroup /> Core Syllabus Topics Covered
                                        </h4>
                                        <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                                            {selectedChapter.syllabusTopics.map((topic, idx) => (
                                                <li key={idx} style={{ color: "var(--text-primary)", fontSize: "0.85rem", lineHeight: "1.5" }}>
                                                    {topic}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* 2. Learning Objectives */}
                                {selectedChapter.learningObjectives && selectedChapter.learningObjectives.length > 0 && (
                                    <div style={{ background: "rgba(15, 23, 42, 0.4)", border: "1px solid var(--border-glass)", borderRadius: "10px", padding: "16px" }}>
                                        <h4 style={{ fontSize: "0.95rem", color: "var(--accent-emerald)", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                                            <FaGraduationCap /> Target Learning Objectives
                                        </h4>
                                        <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                                            {selectedChapter.learningObjectives.map((obj, idx) => (
                                                <li key={idx} style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: "1.5" }}>
                                                    {obj}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* 3. Key Formulas & Principles */}
                                {selectedChapter.keyFormulas && selectedChapter.keyFormulas.length > 0 && (
                                    <div style={{ background: "rgba(15, 23, 42, 0.4)", border: "1px solid var(--border-glass)", borderRadius: "10px", padding: "16px" }}>
                                        <h4 style={{ fontSize: "0.95rem", color: "var(--accent-purple)", marginBottom: "10px" }}>
                                            📐 Key Scientific Formulas & Principles
                                        </h4>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                            {selectedChapter.keyFormulas.map((f, idx) => (
                                                <code key={idx} style={{
                                                    background: "rgba(168, 85, 247, 0.12)",
                                                    border: "1px solid rgba(168, 85, 247, 0.25)",
                                                    padding: "6px 10px",
                                                    borderRadius: "6px",
                                                    fontSize: "0.82rem",
                                                    color: "#fff"
                                                }}>
                                                    {f}
                                                </code>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* AI Doubt Assistant Helper Card */}
                                <div style={{
                                    background: "rgba(6, 182, 212, 0.08)",
                                    border: "1px solid rgba(6, 182, 212, 0.25)",
                                    borderRadius: "10px",
                                    padding: "14px 16px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <div>
                                        <h5 style={{ fontSize: "0.88rem", color: "var(--accent-cyan)", margin: "0 0 2px 0" }}>
                                            Have questions about {selectedChapter.title}?
                                        </h5>
                                        <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: 0 }}>
                                            You can ask the offline AI Doubt Assistant any question about this syllabus topic anytime.
                                        </p>
                                    </div>
                                    <span style={{ fontSize: "0.78rem", color: "var(--accent-cyan)", fontWeight: "700" }}>
                                        AI Engine Ready ⚡
                                    </span>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="glass-card" style={{ textAlign: "center", padding: "60px" }}>
                        <FaBook style={{ fontSize: "3rem", color: "var(--text-muted)", marginBottom: "16px" }} />
                        <h3>Select a chapter from the syllabus to start reading.</h3>
                    </div>
                )}
            </div>
        </div>
    );
}



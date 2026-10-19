import { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { API_URL } from "../config/api";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import AnatomyCanvas from "../three/AnatomyCanvas";
import { FaTrophy, FaFire, FaCheckCircle, FaTimesCircle, FaRedo, FaLightbulb, FaArrowRight, FaCube } from "react-icons/fa";

/**
 * 3D Model Attribution Notice (Preserved in code per CC-BY 4.0 license):
 * "Realistic Human Heart" by neshallads (https://sketchfab.com/neshallads)
 * Licensed under Creative Commons Attribution 4.0 International (CC-BY 4.0)
 * Note: Visual banner overlay is suppressed specifically in quiz assessment mode.
 */

/**
 * Normalizes any landmark/structure identifier or name for tolerant comparisons.
 * Strips ASCII hyphens, Unicode dashes, spaces, underscores, and case.
 */
const normalizeString = (str) => {
    if (!str || str === "null" || str === "undefined") return "";
    return String(str)
        .toLowerCase()
        .replace(/[\u2010-\u2015\u2212\s_-]/g, "")
        .trim();
};

/**
 * Canonical landmark catalog for 3D anatomy quiz models.
 * Maps any variant (ID, raw name, alias) to standard ID and human-readable display name.
 */
const CANONICAL_MODEL_CATALOG = {
    Heart: [
        { id: "ventricle_l", name: "Left Ventricle", aliases: ["left-ventricle", "ventricle_l", "left ventricle", "ventricle left"] },
        { id: "ventricle_r", name: "Right Ventricle", aliases: ["right-ventricle", "ventricle_r", "right ventricle"] },
        { id: "aorta", name: "Aorta & Aortic Arch", aliases: ["aorta", "aortic arch", "main artery"] },
        { id: "pulmonary", name: "Pulmonary Artery & Trunk", aliases: ["pulmonary", "pulmonary artery", "pulmonary trunk"] },
        { id: "venacava", name: "Superior Vena Cava", aliases: ["venacava", "vena cava", "superior vena cava"] },
        { id: "atrium_l", name: "Left Atrium", aliases: ["left-atrium", "atrium_l", "left atrium"] },
        { id: "atrium_r", name: "Right Atrium", aliases: ["right-atrium", "atrium_r", "right atrium"] },
        { id: "valves", name: "Atrioventricular (AV) Valves", aliases: ["valves", "valve", "av valves", "atrioventricular valves"] }
    ],
    Brain: [
        { id: "frontal-left", name: "Frontal Lobe (Left)", aliases: ["frontal-left", "frontal lobe", "frontal", "frontal left"] },
        { id: "frontal-right", name: "Frontal Lobe (Right)", aliases: ["frontal-right", "frontal lobe", "frontal", "frontal right"] },
        { id: "parietal-left", name: "Parietal Lobe (Left)", aliases: ["parietal-left", "parietal lobe", "parietal"] },
        { id: "parietal-right", name: "Parietal Lobe (Right)", aliases: ["parietal-right", "parietal lobe", "parietal"] },
        { id: "temporal-left", name: "Temporal Lobe (Left)", aliases: ["temporal-left", "temporal lobe", "temporal"] },
        { id: "temporal-right", name: "Temporal Lobe (Right)", aliases: ["temporal-right", "temporal lobe", "temporal"] },
        { id: "occipital", name: "Occipital Lobe", aliases: ["occipital", "occipital lobe"] },
        { id: "cerebellum", name: "Cerebellum", aliases: ["cerebellum"] },
        { id: "brainstem", name: "Brainstem & Pons", aliases: ["brainstem", "pons"] }
    ],
    Skeleton: [
        { id: "skull", name: "Skull", aliases: ["skull", "cranium", "head bone", "skull bone"] },
        { id: "cervical-spine", name: "Cervical Spine", aliases: ["cervical", "cervical spine", "neck vertebrae"] },
        { id: "ribcage", name: "Ribcage", aliases: ["ribcage", "ribs", "sternum", "sternum-ribcage"] },
        { id: "pelvis", name: "Pelvis", aliases: ["pelvis", "pelvic girdle", "hip"] },
        { id: "right-femur", name: "Right Femur", aliases: ["right femur", "femur right", "right-femur"] },
        { id: "left-femur", name: "Left Femur", aliases: ["left femur", "femur left", "left-femur"] },
        { id: "right-humerus", name: "Right Humerus", aliases: ["right humerus", "humerus right"] },
        { id: "left-humerus", name: "Left Humerus", aliases: ["left humerus", "humerus left"] }
    ],
    Eye: [
        { id: "cornea", name: "Cornea & Anterior Chamber", aliases: ["cornea", "anterior chamber", "cornea anterior chamber", "cornea dome"] },
        { id: "iris", name: "Iris & Pupil", aliases: ["iris", "pupil", "iris and pupil"] },
        { id: "lens", name: "Crystalline Lens", aliases: ["lens", "crystalline lens"] },
        { id: "sclera", name: "Sclera (Outer Coat)", aliases: ["sclera", "sclera outer coat"] },
        { id: "retina", name: "Retina & Macula", aliases: ["retina", "macula", "retina macula"] },
        { id: "optic-nerve", name: "Optic Nerve (CN II)", aliases: ["optic nerve", "optic-nerve", "cn ii"] }
    ]
};

/**
 * Resolves a raw structure identifier/string to a canonical object { id, name }.
 */
function resolveCanonicalPart(modelName, raw) {
    if (!raw || raw === "null" || raw === "undefined") return null;
    const rawStr = typeof raw === "object" ? (raw.name || raw.id || "") : String(raw);
    if (!rawStr || rawStr === "null" || rawStr === "undefined" || rawStr.trim() === "") return null;

    const catalog = CANONICAL_MODEL_CATALOG[modelName] || [];
    const norm = normalizeString(rawStr);
    if (!norm) return null;

    // 1. Exact match on normalized canonical ID or name
    for (const item of catalog) {
        if (normalizeString(item.id) === norm || normalizeString(item.name) === norm) {
            return { id: item.id, name: item.name };
        }
    }

    // 2. Exact match on aliases
    for (const item of catalog) {
        if (item.aliases && item.aliases.some(a => normalizeString(a) === norm)) {
            return { id: item.id, name: item.name };
        }
    }

    // 3. Substring match
    for (const item of catalog) {
        const itemNormName = normalizeString(item.name);
        const itemNormId = normalizeString(item.id);
        if (itemNormName.includes(norm) || norm.includes(itemNormName) ||
            itemNormId.includes(norm) || norm.includes(itemNormId)) {
            return { id: item.id, name: item.name };
        }
    }

    return { id: norm, name: rawStr };
}

const QUESTION_BANK = [
    {
        id: 1,
        model: "Heart",
        question: "Locate and click on the Left Ventricle (the thickest chamber that pumps oxygen-rich blood into the aorta).",
        targetId: "ventricle_l",
        alternateTargetId: "left-ventricle",
        targetIds: ["ventricle_l", "left-ventricle"],
        targetNames: ["Left Ventricle"],
        hint: "Look at the lower left apex of the heart model (colored crimson/dark red)."
    },
    {
        id: 2,
        model: "Brain",
        question: "Select the Frontal Lobe (responsible for decision making, reasoning, and voluntary movement).",
        targetId: "frontal-left",
        alternateTargetId: "frontal-right",
        targetIds: ["frontal-left", "frontal-right", "frontal"],
        targetNames: ["Frontal Lobe (Left)", "Frontal Lobe (Right)", "Frontal Lobe"],
        hint: "Look at the top anterior (front) section of the brain model (colored purple)."
    },
    {
        id: 3,
        model: "Skeleton",
        question: "Click on the Cranium / Skull (the bony structure that encloses and protects the brain).",
        targetId: "skull",
        alternateTargetId: "cranium",
        targetIds: ["skull", "cranium"],
        targetNames: ["Skull", "Cranium / Skull", "Cranium"],
        hint: "Look at the topmost bone group of the skeleton."
    },
    {
        id: 4,
        model: "Eye",
        question: "Identify the Cornea & Anterior Chamber (the clear outer dome at the front of the eye).",
        targetId: "cornea",
        alternateTargetId: "cornea-anterior",
        targetIds: ["cornea", "anterior-chamber"],
        targetNames: ["Cornea & Anterior Chamber", "Cornea"],
        hint: "Click the transparent blue dome at the very front of the eye model."
    },
    {
        id: 5,
        model: "Heart",
        question: "Locate the Aorta & Main Artery (the primary artery distributing oxygenated blood to the body).",
        targetId: "aorta",
        alternateTargetId: "aortic-arch",
        targetIds: ["aorta", "aortic-arch"],
        targetNames: ["Aorta & Aortic Arch", "Aorta"],
        hint: "Look at the top central red vessel curving upward from the heart."
    }
];

/**
 * Calculates mathematically correct accuracy percentage based on answer counts.
 * Accuracy = (correctly answered questions / questions attempted) * 100.
 * Clamped strictly to 0-100%, safely handles zero attempts.
 */
export const calculateAccuracy = (correctCount, attemptedCount) => {
    if (!attemptedCount || attemptedCount <= 0) return 0;
    const rawPct = (correctCount / attemptedCount) * 100;
    return Math.min(100, Math.max(0, Math.round(rawPct)));
};

export default function AnatomyQuiz() {
    const { user } = useContext(AuthContext);
    const [publishedQuizzes, setPublishedQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [quizMode, setQuizMode] = useState("3d-spatial");

    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [attemptedQuestions, setAttemptedQuestions] = useState([]);
    const [correctQuestions, setCorrectQuestions] = useState([]);
    const [selectedPart, setSelectedPart] = useState(null);
    const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect' | null
    const [showHint, setShowHint] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [saving, setSaving] = useState(false);

    const stageRef = useRef(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/quiz/all`);
                setPublishedQuizzes(res.data.quizzes || []);
            } catch (err) {
                console.warn("Fetch published quizzes notice:", err.message);
            }
        };
        fetchQuizzes();
    }, []);

    const currentQ = QUESTION_BANK[currentIdx];

    // Safely suppress only the specific attribution badge element, never touching canvas ancestors
    useEffect(() => {
        const stageEl = stageRef.current;
        if (!stageEl) return;

        const hideAttributionBadge = () => {
            const anchors = stageEl.querySelectorAll('a[href*="sketchfab"], a[href*="neshallads"]');
            anchors.forEach((a) => {
                // Find the immediate badge pill div that directly wraps the anchor link
                const badge = a.parentElement;
                if (
                    badge &&
                    badge.tagName === "DIV" &&
                    badge !== stageEl &&
                    !badge.classList.contains("canvas-wrapper") &&
                    !badge.classList.contains("anatomy-quiz-stage")
                ) {
                    badge.style.setProperty("display", "none", "important");
                    badge.style.setProperty("visibility", "hidden", "important");
                    badge.style.setProperty("pointer-events", "none", "important");
                }
            });
        };

        hideAttributionBadge();
        const observer = new MutationObserver(hideAttributionBadge);
        observer.observe(stageEl, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, [currentIdx, currentQ?.model]);

    const handlePartSelect = (part) => {
        if (feedback === "correct") return; // Already answered correctly, awaiting Next Question
        if (!part || part === "null" || part === "undefined") return;

        let rawIdentifier = "";
        if (typeof part === "object" && part !== null) {
            rawIdentifier = part.name || part.id || "";
        } else {
            rawIdentifier = String(part);
        }
        if (!rawIdentifier || rawIdentifier.trim() === "" || rawIdentifier === "null" || rawIdentifier === "undefined") {
            return;
        }

        const resolved = resolveCanonicalPart(currentQ.model, rawIdentifier);
        const selectedObj = {
            id: resolved?.id || normalizeString(rawIdentifier),
            name: resolved?.name || rawIdentifier
        };
        setSelectedPart(selectedObj);

        // Record question attempt without inflating count on repeated clicks
        setAttemptedQuestions((prev) => (prev.includes(currentQ.id) ? prev : [...prev, currentQ.id]));

        const normInputId = normalizeString(selectedObj.id);
        const normInputName = normalizeString(selectedObj.name);

        const checkMatch = (target) => {
            if (!target) return false;
            const normTarget = normalizeString(target);
            return normInputId === normTarget || normInputName === normTarget;
        };

        const isTarget =
            checkMatch(currentQ.targetId) ||
            (currentQ.alternateTargetId && checkMatch(currentQ.alternateTargetId)) ||
            (currentQ.targetIds && currentQ.targetIds.some(checkMatch)) ||
            (currentQ.targetNames && currentQ.targetNames.some(checkMatch));

        if (isTarget) {
            // Record correct answer without inflating count on repeated clicks
            setCorrectQuestions((prev) => (prev.includes(currentQ.id) ? prev : [...prev, currentQ.id]));
            setFeedback("correct");
            const bonus = streak * 20;
            setScore((prev) => prev + 100 + bonus);
            setStreak((prev) => prev + 1);
        } else {
            setFeedback("incorrect");
            setStreak(0);
        }
    };

    const handleNext = async () => {
        setFeedback(null);
        setSelectedPart(null);
        setShowHint(false);

        if (currentIdx + 1 < QUESTION_BANK.length) {
            setCurrentIdx((prev) => prev + 1);
        } else {
            setQuizCompleted(true);
            const finalScore = score;
            const finalPct = calculateAccuracy(correctQuestions.length, attemptedQuestions.length);

            // Persist Quiz Attempt to MongoDB Backend
            try {
                setSaving(true);
                await axios.post(`${API_URL}/api/quiz/attempt`, {
                    studentId: user?.id || user?._id || null,
                    studentName: user?.name || "Student Alex",
                    modelName: "3D Spatial Anatomy",
                    score: finalScore,
                    totalQuestions: QUESTION_BANK.length,
                    percentage: finalPct,
                    streakCount: streak
                });
                toast.success("🏆 Quiz results saved to your profile progress!", { icon: "📊" });
            } catch (err) {
                console.warn("Quiz save notice:", err.message);
            } finally {
                setSaving(false);
            }
        }
    };

    const handleRestart = () => {
        setCurrentIdx(0);
        setScore(0);
        setStreak(0);
        setAttemptedQuestions([]);
        setCorrectQuestions([]);
        setSelectedPart(null);
        setFeedback(null);
        setShowHint(false);
        setQuizCompleted(false);
    };

    if (quizCompleted) {
        const accuracyPercentage = calculateAccuracy(correctQuestions.length, attemptedQuestions.length);
        return (
            <div className="glass-card" style={{ maxWidth: "600px", margin: "40px auto", textAlign: "center", padding: "40px 30px" }}>
                <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "linear-gradient(135deg, #f59e0b, #ec4899)", margin: "0 auto 20px auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", color: "#fff" }}>
                    <FaTrophy />
                </div>
                <h2 style={{ fontSize: "1.8rem", fontFamily: "var(--font-display)", marginBottom: "8px" }}>
                    Quiz Completed!
                </h2>
                <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
                    Great job practicing 3D anatomical structure identification!
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "30px" }}>
                    <div style={{ background: "rgba(6, 182, 212, 0.1)", border: "1px solid rgba(6, 182, 212, 0.3)", padding: "16px", borderRadius: "12px" }}>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block" }}>Final Score</span>
                        <span style={{ fontSize: "1.8rem", fontWeight: "700", color: "var(--accent-cyan)" }}>{score} pts</span>
                    </div>
                    <div style={{ background: "rgba(168, 85, 247, 0.1)", border: "1px solid rgba(168, 85, 247, 0.3)", padding: "16px", borderRadius: "12px" }}>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block" }}>Accuracy Rating</span>
                        <span style={{ fontSize: "1.8rem", fontWeight: "700", color: "var(--accent-purple)" }}>{accuracyPercentage}%</span>
                    </div>
                </div>

                <button className="btn-primary" onClick={handleRestart} style={{ margin: "0 auto", padding: "12px 28px" }}>
                    <FaRedo /> Try Quiz Again
                </button>
            </div>
        );
    }

    const liveAccuracy = calculateAccuracy(correctQuestions.length, attemptedQuestions.length);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px", width: "100%", maxWidth: "1040px", margin: "0 auto" }}>
            {/* Scoped styles strictly for AnatomyQuiz */}
            <style>{`
                /* Prevent global form styles from bloating the range slider */
                .anatomy-quiz-stage input[type="range"] {
                    padding: 0 !important;
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    height: 6px !important;
                    cursor: pointer;
                    accent-color: #06b6d4;
                }
                .anatomy-quiz-stage .canvas-toolbar {
                    top: 12px !important;
                    left: 12px !important;
                    right: 12px !important;
                }
                /* Ensure canvas and its wrappers are always visible and full size */
                .anatomy-quiz-stage .canvas-wrapper {
                    display: block !important;
                    visibility: visible !important;
                    width: 100% !important;
                    height: 100% !important;
                    min-height: 520px !important;
                    opacity: 1 !important;
                }
                .anatomy-quiz-stage canvas {
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                }
                /* Bug 2: Suppress floating anatomical name hover tooltips, inspection badges, and info cards strictly within quiz */
                .anatomy-quiz-stage .pointer-events-none {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                }
                .anatomy-quiz-stage .synchronized-inspection-badge {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                }
                .anatomy-quiz-stage .info-overlay {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                }
            `}</style>

            {/* Assessment Category Selector (if published quizzes exist) */}
            {publishedQuizzes.length > 0 && (
                <div
                    style={{
                        background: "rgba(10, 15, 30, 0.75)",
                        backdropFilter: "blur(14px)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "14px",
                        padding: "12px 18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "12px"
                    }}
                >
                    <div>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#f8fafc", display: "flex", alignItems: "center", gap: "6px" }}>
                            <FaTrophy style={{ color: "#f59e0b" }} /> Assessment Mode
                        </h4>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                            Select interactive 3D spatial pinpointing or teacher-assigned assessments.
                        </p>
                    </div>

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <button
                            onClick={() => { setQuizMode("3d-spatial"); setSelectedQuiz(null); handleRestart(); }}
                            style={{
                                background: quizMode === "3d-spatial" ? "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))" : "rgba(255,255,255,0.06)",
                                color: "#fff",
                                border: quizMode === "3d-spatial" ? "1px solid rgba(6, 182, 212, 0.5)" : "1px solid rgba(255,255,255,0.1)",
                                padding: "7px 14px",
                                borderRadius: "8px",
                                fontSize: "0.82rem",
                                fontWeight: "700",
                                cursor: "pointer",
                                transition: "all 0.2s ease"
                            }}
                        >
                            🫀 3D Spatial Pinpoint Quiz
                        </button>

                        {publishedQuizzes.map((pq) => (
                            <button
                                key={pq._id}
                                onClick={() => {
                                    setQuizMode("published");
                                    setSelectedQuiz(pq);
                                    handleRestart();
                                }}
                                style={{
                                    background: selectedQuiz?._id === pq._id ? "linear-gradient(135deg, var(--accent-purple), #c084fc)" : "rgba(255,255,255,0.06)",
                                    color: "#fff",
                                    border: selectedQuiz?._id === pq._id ? "1px solid rgba(168, 85, 247, 0.5)" : "1px solid rgba(255,255,255,0.1)",
                                    padding: "7px 14px",
                                    borderRadius: "8px",
                                    fontSize: "0.82rem",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                📝 {pq.title}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Top Scorebar & Question Card */}
            <div
                style={{
                    background: "rgba(10, 15, 30, 0.85)",
                    backdropFilter: "blur(14px)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "16px",
                    padding: "16px 22px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "14px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)"
                }}
            >
                <div style={{ flex: 1, minWidth: "260px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", background: "rgba(6, 182, 212, 0.12)", padding: "3px 8px", borderRadius: "6px", border: "1px solid rgba(6, 182, 212, 0.3)" }}>
                            Question {currentIdx + 1} of {QUESTION_BANK.length}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600" }}>
                            Model: <strong style={{ color: "#38bdf8" }}>{currentQ.model}</strong>
                        </span>
                    </div>
                    <h3 style={{ fontSize: "1.1rem", fontFamily: "var(--font-display)", color: "#f8fafc", margin: "4px 0 0 0", lineHeight: 1.4 }}>
                        {currentQ.question}
                    </h3>
                </div>

                <div style={{ display: "flex", gap: "12px", alignItems: "center", flexShrink: 0 }}>
                    {streak > 1 && (
                        <div style={{ background: "rgba(245, 158, 11, 0.15)", border: "1px solid #f59e0b", padding: "6px 14px", borderRadius: "20px", color: "#fbbf24", fontSize: "0.84rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                            <FaFire /> {streak}x Streak!
                        </div>
                    )}

                    <div style={{ background: "rgba(6, 182, 212, 0.12)", border: "1px solid rgba(6, 182, 212, 0.4)", padding: "6px 16px", borderRadius: "20px", color: "var(--accent-cyan)", fontSize: "0.88rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                        <FaTrophy style={{ color: "#f59e0b" }} /> Score: {score} pts
                    </div>

                    <div style={{ background: "rgba(168, 85, 247, 0.12)", border: "1px solid rgba(168, 85, 247, 0.4)", padding: "6px 16px", borderRadius: "20px", color: "var(--accent-purple)", fontSize: "0.88rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                        Accuracy: {liveAccuracy}%
                    </div>

                    {/* Highly accessible Next Question button visible in the top card as soon as correct answer is reached */}
                    {feedback === "correct" && (
                        <button
                            onClick={handleNext}
                            style={{
                                background: "linear-gradient(135deg, #10b981, #059669)",
                                color: "#ffffff",
                                border: "1px solid rgba(255, 255, 255, 0.3)",
                                padding: "8px 18px",
                                borderRadius: "20px",
                                fontWeight: "700",
                                fontSize: "0.86rem",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                boxShadow: "0 0 16px rgba(16, 185, 129, 0.5)",
                                animation: "pulse 1.8s infinite"
                            }}
                        >
                            Next Question <FaArrowRight />
                        </button>
                    )}
                </div>
            </div>

            {/* Main Interactive 3D Canvas Stage */}
            <div
                ref={stageRef}
                className="anatomy-quiz-stage"
                style={{
                    position: "relative",
                    width: "100%",
                    height: "580px",
                    borderRadius: "18px",
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    background: "radial-gradient(circle at center, #111827 0%, #030712 100%)",
                    boxShadow: "0 16px 40px rgba(0, 0, 0, 0.55)"
                }}
            >
                <AnatomyCanvas
                    key={`${currentQ.id}-${currentQ.model}`}
                    activeModel={currentQ.model}
                    onSelectPart={handlePartSelect}
                    showModelSelector={false}
                    showToolbar={true}
                />

                {/* Feedback Overlay Modal Banner */}
                {feedback && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: "28px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 50,
                            pointerEvents: "auto",
                            background: feedback === "correct" ? "rgba(6, 78, 59, 0.95)" : "rgba(127, 29, 29, 0.95)",
                            border: feedback === "correct" ? "1px solid rgba(16, 185, 129, 0.6)" : "1px solid rgba(239, 68, 68, 0.6)",
                            color: "#fff",
                            padding: "12px 24px",
                            borderRadius: "14px",
                            boxShadow: "0 12px 35px rgba(0, 0, 0, 0.65)",
                            display: "flex",
                            alignItems: "center",
                            gap: "18px",
                            backdropFilter: "blur(12px)",
                            maxWidth: "92%"
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.95rem", fontWeight: "600" }}>
                            {feedback === "correct" ? (
                                <FaCheckCircle style={{ fontSize: "1.25rem", color: "#34d399", flexShrink: 0 }} />
                            ) : (
                                <FaTimesCircle style={{ fontSize: "1.25rem", color: "#f87171", flexShrink: 0 }} />
                            )}
                            <span>
                                {feedback === "correct"
                                    ? `Correct! Identified: ${selectedPart?.name || "Target Structure"}. (+${100 + streak * 20} pts)`
                                    : `Incorrect selection (${selectedPart?.name || "Non-target part"}). Try again!`}
                            </span>
                        </div>

                        {feedback === "correct" && (
                            <button
                                onClick={handleNext}
                                style={{
                                    background: "linear-gradient(135deg, #10b981, #059669)",
                                    color: "#ffffff",
                                    border: "1px solid rgba(255, 255, 255, 0.25)",
                                    padding: "7px 18px",
                                    borderRadius: "8px",
                                    fontWeight: "700",
                                    fontSize: "0.85rem",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                    boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                Next Question →
                            </button>
                        )}
                    </div>
                )}

                {/* Hint Button Overlay */}
                {!feedback && (
                    <div style={{ position: "absolute", bottom: "24px", right: "20px", zIndex: 15, pointerEvents: "auto" }}>
                        <button
                            onClick={() => setShowHint(!showHint)}
                            style={{
                                background: "rgba(10, 15, 30, 0.88)",
                                border: "1px solid rgba(251, 191, 36, 0.4)",
                                color: "#fbbf24",
                                padding: "8px 14px",
                                borderRadius: "10px",
                                fontSize: "0.82rem",
                                fontWeight: "600",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                cursor: "pointer",
                                backdropFilter: "blur(10px)",
                                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
                                transition: "all 0.2s ease"
                            }}
                        >
                            <FaLightbulb style={{ color: "#f59e0b" }} /> {showHint ? "Hide Hint" : "Need a Hint?"}
                        </button>
                    </div>
                )}
            </div>

            {/* Anatomical Hint Drawer Box */}
            {showHint && !feedback && (
                <div
                    style={{
                        background: "rgba(15, 23, 42, 0.9)",
                        backdropFilter: "blur(14px)",
                        border: "1px solid rgba(251, 191, 36, 0.35)",
                        borderLeft: "4px solid #fbbf24",
                        padding: "14px 20px",
                        borderRadius: "12px",
                        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.35)"
                    }}
                >
                    <span style={{ color: "#fbbf24", fontWeight: "700", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
                        💡 Anatomical Landmark Hint:
                    </span>
                    <p style={{ color: "#cbd5e1", fontSize: "0.9rem", marginTop: "4px", lineHeight: 1.4 }}>
                        {currentQ.hint}
                    </p>
                </div>
            )}
        </div>
    );
}

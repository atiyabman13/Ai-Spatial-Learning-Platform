import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { API_URL, SOCKET_URL } from "../config/api";

import Navbar from "../components/Navbar";
import AnatomyCanvas from "../three/AnatomyCanvas";
import ClassroomChatWidget from "../components/ClassroomChatWidget";
import { AuthContext } from "../context/AuthContext";
import { BIOLOGY_CHAPTERS, BIOLOGY_MODULES } from "../data/biologyCurriculumData";
import { clearStudentDoubt } from "../services/geminiService";
import FormattedMessage, { stripFormattingForSpeech } from "../components/FormattedMessage";

import {
    FaArrowLeft,
    FaArrowRight,
    FaCube,
    FaBookOpen,
    FaQuestionCircle,
    FaRobot,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaGraduationCap,
    FaLightbulb,
    FaColumns,
    FaRedo,
    FaPaperPlane,
    FaVolumeUp,
    FaVolumeMute,
    FaTrophy,
    FaUsers,
    FaChalkboardTeacher,
    FaBroadcastTower,
    FaStepForward,
    FaStepBackward,
    FaComments,
    FaCompass
} from "react-icons/fa";

export default function BiologyChapterDetail() {
    const { chapterId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // Find current chapter with resilient id and alias matching
    const chapterIndex = (BIOLOGY_CHAPTERS || []).findIndex(c => {
        if (!c || !c.id) return false;
        if (c.id === chapterId) return true;
        if (chapterId && (c.id.includes(chapterId) || chapterId.includes(c.id))) return true;
        // Known semantic aliases
        if (chapterId) {
            const low = chapterId.toLowerCase();
            if ((low.includes("heart") || low.includes("circulat")) && c.id.includes("heart")) return true;
            if (low.includes("dna") && c.id.includes("dna")) return true;
            if (low.includes("plant-cell") && c.id.includes("cell-structure")) return true;
            if (low.includes("respirat") && c.id.includes("respiration")) return true;
            if (low.includes("digest") && c.id.includes("digestion")) return true;
            if (low.includes("mitos") && c.id.includes("cell-division")) return true;
            if (low.includes("skelet") && c.id.includes("skeleton")) return true;
            if ((low.includes("nerv") || low.includes("brain")) && c.id.includes("brain")) return true;
            if (low.includes("eye") && c.id.includes("eye")) return true;
            if (low.includes("photo") && c.id.includes("photosynthesis")) return true;
            if (low.includes("transport") && c.id.includes("plant-transport")) return true;
        }
        return false;
    });

    const chapter = chapterIndex !== -1 ? BIOLOGY_CHAPTERS[chapterIndex] : null;

    // Sub-arrays & normalized properties
    const quizList = chapter ? (chapter.quiz || chapter.reviewQuestions || []) : [];
    const termList = chapter ? (chapter.glossary || chapter.terms || []) : [];
    const sectionList = chapter ? (chapter.sections || []) : [];
    const objList = chapter ? (chapter.learningObjectives || []) : [];
    const refList = chapter ? (chapter.references || []) : [];
    const guidedSteps = chapter ? (chapter.guidedSteps || []) : [];
    const readTimeStr = chapter ? (chapter.readTime || chapter.estimatedTime || "15 mins") : "15 mins";
    const difficultyStr = chapter ? (chapter.difficulty || "Core Curriculum") : "Core Curriculum";
    const overviewStr = chapter ? (chapter.overview || (Array.isArray(chapter.summary) ? chapter.summary.join(". ") : chapter.summary) || "") : "";

    const prevChapter = chapterIndex > 0 ? BIOLOGY_CHAPTERS[chapterIndex - 1] : null;
    const nextChapter = chapterIndex < BIOLOGY_CHAPTERS.length - 1 ? BIOLOGY_CHAPTERS[chapterIndex + 1] : null;
    const moduleObj = chapter ? BIOLOGY_MODULES.find(m => m.id === chapter.moduleId) : null;

    // View & Layout States
    const [activeTab, setActiveTab] = useState("guided"); // "guided" | "theory" | "quiz" | "ai" | "sync"
    const [splitScreen, setSplitScreen] = useState(true);
    const [selectedPart, setSelectedPart] = useState(null);
    const [actionCue, setActionCue] = useState(null);

    // Guided Learning Stepper State
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    // Quiz State
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizScore, setQuizScore] = useState(null);

    // AI Doubt Tutor State
    const [aiMessages, setAiMessages] = useState([]);
    const [aiInput, setAiInput] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [ttsEnabled, setTtsEnabled] = useState(false);

    // Socket.IO Classroom Sync State
    const [socket, setSocket] = useState(null);
    const [roomId, setRoomId] = useState("bio-101");
    const [isJoinedRoom, setIsJoinedRoom] = useState(false);
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [syncPing, setSyncPing] = useState(null);
    const isTeacher = user?.role === "teacher";



    // Socket.IO Connection Setup
    useEffect(() => {
        const socketUrl = SOCKET_URL;
        let newSocket;
        try {
            newSocket = io(socketUrl, {
                reconnectionAttempts: 3,
                timeout: 5000
            });
            setSocket(newSocket);

            newSocket.on("connect", () => {
                setSyncPing(18);
            });

            newSocket.on("room-participants", (data) => {
                if (data?.room) {
                    const students = data.room.students || [];
                    const teacher = data.room.teacher ? [data.room.teacher] : [];
                    setConnectedUsers([...teacher, ...students]);
                }
            });

            // Listen for teacher's spatial and step broadcasts
            newSocket.on("student-spatial-update", (data) => {
                if (!data) return;
                if (data.activePart) {
                    setSelectedPart(data.activePart);
                }
                if (data.guidedStep !== undefined) {
                    setCurrentStepIndex(data.guidedStep);
                }
                if (data.actionCue) {
                    setActionCue(data.actionCue);
                }
                toast.success("Classroom 3D synchronized with teacher", { icon: "⚡", id: "sync-toast" });
            });
        } catch (e) {
            console.warn("Socket.IO initialization notice:", e);
        }

        return () => {
            if (newSocket) newSocket.close();
        };
    }, []);

    // Initialize or Reset Chapter State on chapterId change
    useEffect(() => {
        if (!chapter) return;

        window.scrollTo({ top: 0, behavior: "smooth" });
        setCurrentStepIndex(0);
        setSelectedPart(null);
        setActionCue(null);

        // Load saved quiz
        const saved = localStorage.getItem(`bio_quiz_${chapter.id}_score`);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setQuizScore(parsed);
                setQuizSubmitted(true);
            } catch (e) {
                // ignore
            }
        } else {
            setQuizAnswers({});
            setQuizSubmitted(false);
            setQuizScore(null);
        }

        // Initialize AI tutor welcome message
        setAiMessages([
            {
                sender: "ai",
                text: `Welcome to "${chapter.title}"! I am your AI Biology Study Assistant for ${chapter.gradeRange}. Select any 3D structure or step to explore, or ask me any question!`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ]);
    }, [chapterId]);

    // Handle Guided Step Navigation
    const goToStep = useCallback((stepIdx) => {
        if (!guidedSteps || stepIdx < 0 || stepIdx >= guidedSteps.length) return;
        setCurrentStepIndex(stepIdx);
        const step = guidedSteps[stepIdx];

        if (step.targetStructure) {
            setSelectedPart(step.targetStructure);
        }

        // Trigger smooth camera and explosion cue
        const cue = {
            action: {
                targetMesh: step.targetStructure,
                cameraPosition: step.cameraPos || undefined,
                cameraTarget: step.cameraTarget || undefined,
                explode: step.explode || 0,
                slice: step.slice || false,
                zoom: 1.4
            }
        };
        setActionCue(cue);

        // Broadcast if teacher
        if (isBroadcasting && socket && isJoinedRoom) {
            socket.emit("teacher-spatial-control", {
                roomId,
                model: chapter.modelName,
                activePart: step.targetStructure,
                guidedStep: stepIdx,
                actionCue: cue
            });
        }
    }, [guidedSteps, isBroadcasting, socket, isJoinedRoom, roomId, chapter?.modelName]);

    // Reset Entire Lesson to Step 1 with fitted model view
    const handleResetLesson = () => {
        setCurrentStepIndex(0);
        setSelectedPart(null);
        setActionCue({
            action: {
                isReset: true,
                explode: 0,
                slice: false
            }
        });
        toast.success("Lesson reset to Step 1", { icon: "🔄" });
    };

    // Calculate part detail dynamically from glossary or guided step
    const getActivePartDetail = () => {
        if (!selectedPart) return null;
        const partName = String(selectedPart).toLowerCase();

        // 1. Look in glossary
        const foundTerm = termList.find(t => 
            t.term.toLowerCase() === partName || 
            partName.includes(t.term.toLowerCase()) || 
            t.term.toLowerCase().includes(partName)
        );
        if (foundTerm) {
            return {
                name: foundTerm.term,
                description: foundTerm.definition
            };
        }

        // 2. Look in guided steps
        const foundStep = guidedSteps.find(s => 
            s.targetStructure && (
                s.targetStructure.toLowerCase() === partName ||
                partName.includes(s.targetStructure.toLowerCase())
            )
        );
        if (foundStep) {
            return {
                name: foundStep.targetStructure,
                description: `${foundStep.concept}: ${foundStep.explanation}`
            };
        }

        return {
            name: selectedPart,
            description: `Key anatomical structure of ${chapter?.modelName || 'this system'} with camera focus active.`
        };
    };

    // Socket Classroom Join/Leave Handlers
    const handleJoinClassroom = () => {
        if (!socket || !roomId.trim()) {
            toast.error("Socket not connected or invalid Room ID");
            return;
        }

        socket.emit("join-room", {
            roomId: roomId.trim(),
            user: {
                name: user?.name || (isTeacher ? "Dr. Sarah Mitchell" : "Biology Student"),
                role: user?.role || "student"
            }
        });

        setIsJoinedRoom(true);
        toast.success(`Connected to Classroom Room: ${roomId}`, { icon: "🏫" });
    };

    const handleLeaveClassroom = () => {
        setIsJoinedRoom(false);
        setIsBroadcasting(false);
        toast("Disconnected from Classroom", { icon: "🚪" });
    };

    const handleBroadcastSpatial = (controlData) => {
        if (!isBroadcasting || !socket || !isJoinedRoom) return;
        socket.emit("teacher-spatial-control", {
            roomId,
            ...controlData,
            guidedStep: currentStepIndex
        });
    };

    // Handle Quiz Selection
    const handleSelectOption = (qIdx, optIdx) => {
        if (quizSubmitted) return;
        setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    };

    // Submit Quiz
    const handleSubmitQuiz = () => {
        if (!chapter) return;
        const total = quizList.length;
        const answeredCount = Object.keys(quizAnswers).length;

        if (answeredCount < total) {
            toast.error(`Please answer all ${total} questions before submitting!`, { icon: "⚠️" });
            return;
        }

        let correct = 0;
        quizList.forEach((q, i) => {
            if (quizAnswers[i] === q.correctIndex) {
                correct++;
            }
        });

        const scoreObj = { score: correct, total, date: new Date().toISOString() };
        setQuizScore(scoreObj);
        setQuizSubmitted(true);
        localStorage.setItem(`bio_quiz_${chapter.id}_score`, JSON.stringify(scoreObj));

        if (correct / total >= 0.7) {
            toast.success(`🎉 Excellent! You scored ${correct}/${total}!`, { duration: 4000 });
        } else {
            toast(`You scored ${correct}/${total}. Review the explanations below and retry!`, { icon: "💡", duration: 4000 });
        }
    };

    // Retake Quiz
    const handleRetakeQuiz = () => {
        setQuizAnswers({});
        setQuizSubmitted(false);
        setQuizScore(null);
        localStorage.removeItem(`bio_quiz_${chapter?.id}_score`);
    };

    // Send AI Doubt Question
    const handleSendAiDoubt = async (questionText) => {
        const query = questionText || aiInput;
        if (!query.trim() || aiLoading) return;

        const userMsg = {
            sender: "user",
            text: query,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setAiMessages(prev => [...prev, userMsg]);
        setAiInput("");
        setAiLoading(true);

        try {
            const promptContext = `Target syllabus: ${chapter.gradeRange}. Chapter: ${chapter.title}. Active structure: ${selectedPart || 'General'}. Student question: ${query}`;
            let answerText = "";
            let action = null;

            // 1. Try existing backend AI endpoint first
            try {
                const apiRes = await fetch(`${API_URL}/api/ai/ask`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        question: query,
                        context: {
                            activeModel: chapter.modelName,
                            selectedPart: selectedPart || undefined,
                            gradeRange: chapter.gradeRange,
                            chapterTitle: chapter.title
                        }
                    })
                });
                if (apiRes.ok) {
                    const data = await apiRes.json();
                    if (data && data.answer) {
                        answerText = data.answer;
                    }
                }
            } catch (backendErr) {
                // fall through to client gemini or simulation
            }

            // 2. If backend didn't provide answer, use client Gemini / smart simulation responder
            if (!answerText) {
                const res = await clearStudentDoubt(promptContext, chapter, selectedPart);
                answerText = res.answerText;
                action = res.action;
            } else if (!action && selectedPart) {
                action = {
                    targetMesh: selectedPart,
                    cameraPosition: [0, 0.5, 3.5],
                    zoom: 1.4
                };
            }

            const aiReply = {
                sender: "ai",
                text: answerText || `Regarding ${chapter.title}: This biological mechanism maintains structural homeostasis and physiologic equilibrium.`,
                action: action,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setAiMessages(prev => [...prev, aiReply]);

            if (action) {
                setActionCue({ action });
                if (action.targetMesh) {
                    setSelectedPart(action.targetMesh);
                }
            }

            if (ttsEnabled && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utter = new SpeechSynthesisUtterance(stripFormattingForSpeech(answerText));
                utter.rate = 1.0;
                window.speechSynthesis.speak(utter);
            }
        } catch (err) {
            console.error(err);
            setAiMessages(prev => [
                ...prev,
                {
                    sender: "ai",
                    text: `Regarding ${chapter.title} in ${chapter.gradeRange}: This physiological mechanism ensures homeostasis and cellular transport.`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        } finally {
            setAiLoading(false);
        }
    };

    // FALLBACK PAGE FOR INVALID CHAPTER ID
    if (!chapter) {
        return (
            <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", display: "flex", flexDirection: "column" }}>
                <Navbar />
                <div style={{ maxWidth: "900px", margin: "80px auto", padding: "40px 24px", textAlign: "center" }}>
                    <div style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "24px",
                        background: "rgba(244, 63, 94, 0.15)",
                        border: "1px solid rgba(244, 63, 94, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 24px auto",
                        color: "#f43f5e",
                        fontSize: "2rem"
                    }}>
                        <FaCube />
                    </div>

                    <h1 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "12px", fontFamily: "var(--font-display)" }}>
                        Biology Chapter Not Found
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: "600px", margin: "0 auto 32px auto", lineHeight: "1.6" }}>
                        We could not locate a 3D lesson matching identifier <code style={{ color: "#00ffcc", background: "rgba(0,0,0,0.4)", padding: "2px 8px", borderRadius: "6px" }}>{chapterId}</code>.
                        Please select from the verified Biology curriculum chapters below:
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px", marginBottom: "40px", textAlign: "left" }}>
                        {(BIOLOGY_CHAPTERS || []).map((ch) => (
                            <div
                                key={ch.id}
                                onClick={() => navigate(`/biology/lesson/${ch.id}`)}
                                style={{
                                    background: "rgba(15, 23, 42, 0.75)",
                                    border: "1px solid var(--border-glass)",
                                    borderRadius: "14px",
                                    padding: "16px",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "rgba(0, 255, 204, 0.5)";
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "var(--border-glass)";
                                    e.currentTarget.style.transform = "translateY(0)";
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                    <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: "700" }}>{ch.gradeRange}</span>
                                    <span style={{ fontSize: "0.75rem", color: "#06b6d4" }}>3D {ch.modelName}</span>
                                </div>
                                <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#ffffff", margin: "0 0 6px 0" }}>{ch.title}</h4>
                                <span style={{ fontSize: "0.8rem", color: "#00ffcc", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                    Start 3D Lesson <FaArrowRight style={{ fontSize: "0.7rem" }} />
                                </span>
                            </div>
                        ))}
                    </div>

                    <button
                        className="btn-emerald"
                        onClick={() => navigate("/biology")}
                        style={{ padding: "12px 28px", fontSize: "0.95rem" }}
                    >
                        <FaArrowLeft /> Back to Biology Curriculum Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Progress computation
    const totalSteps = guidedSteps.length || 5;
    const stepProgress = Math.round(((currentStepIndex + 1) / totalSteps) * 100);
    const currentPartDetail = getActivePartDetail();
    const activeStep = guidedSteps[currentStepIndex] || null;

function renderGuidedStepperConsole() {
                if (!activeStep) return null;

                return (
                    <div style={{
                        background: "rgba(15, 23, 42, 0.88)",
                        border: "1px solid rgba(0, 255, 204, 0.3)",
                        borderRadius: "16px",
                        padding: "18px 22px",
                        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5)"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "10px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <span style={{
                                    background: "rgba(0, 255, 204, 0.15)",
                                    border: "1px solid rgba(0, 255, 204, 0.4)",
                                    color: "#00ffcc",
                                    fontSize: "0.78rem",
                                    fontWeight: "800",
                                    padding: "3px 10px",
                                    borderRadius: "8px"
                                }}>
                                    Step {currentStepIndex + 1} of {totalSteps}
                                </span>
                                <span style={{
                                    background: "rgba(16, 185, 129, 0.15)",
                                    color: "#10b981",
                                    fontSize: "0.78rem",
                                    fontWeight: "700",
                                    padding: "3px 10px",
                                    borderRadius: "8px"
                                }}>
                                    Concept: {activeStep.concept}
                                </span>
                            </div>

                            {/* Step navigation buttons */}
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <button
                                    onClick={() => goToStep(currentStepIndex - 1)}
                                    disabled={currentStepIndex === 0}
                                    style={{
                                        background: "rgba(255, 255, 255, 0.06)",
                                        border: "1px solid var(--border-glass)",
                                        color: currentStepIndex === 0 ? "var(--text-muted)" : "var(--text-secondary)",
                                        padding: "6px 12px",
                                        borderRadius: "8px",
                                        fontSize: "0.8rem",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        cursor: currentStepIndex === 0 ? "not-allowed" : "pointer"
                                    }}
                                >
                                    <FaStepBackward /> Prev
                                </button>

                                <button
                                    onClick={() => goToStep(currentStepIndex + 1)}
                                    disabled={currentStepIndex === totalSteps - 1}
                                    style={{
                                        background: currentStepIndex === totalSteps - 1 ? "rgba(255, 255, 255, 0.06)" : "rgba(16, 185, 129, 0.2)",
                                        border: `1px solid ${currentStepIndex === totalSteps - 1 ? "var(--border-glass)" : "#10b981"}`,
                                        color: currentStepIndex === totalSteps - 1 ? "var(--text-muted)" : "#10b981",
                                        padding: "6px 14px",
                                        borderRadius: "8px",
                                        fontSize: "0.8rem",
                                        fontWeight: "700",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        cursor: currentStepIndex === totalSteps - 1 ? "not-allowed" : "pointer"
                                    }}
                                >
                                    Next <FaStepForward />
                                </button>

                                <button
                                    onClick={handleResetLesson}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "#94a3b8",
                                        fontSize: "0.8rem",
                                        padding: "6px 8px",
                                        cursor: "pointer",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px"
                                    }}
                                    title="Reset to Step 1"
                                >
                                    <FaRedo /> Reset
                                </button>
                            </div>
                        </div>

                        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#ffffff", margin: "0 0 6px 0" }}>
                            {activeStep.title}
                        </h3>

                        <p style={{ fontSize: "0.88rem", color: "#cbd5e1", lineHeight: "1.6", margin: "0 0 12px 0" }}>
                            {activeStep.explanation}
                        </p>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Target 3D Structure:</span>
                                <button
                                    onClick={() => goToStep(currentStepIndex)}
                                    style={{
                                        background: "rgba(0, 255, 204, 0.12)",
                                        border: "1px solid #00ffcc",
                                        color: "#00ffcc",
                                        borderRadius: "8px",
                                        padding: "4px 10px",
                                        fontSize: "0.8rem",
                                        fontWeight: "700",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        cursor: "pointer"
                                    }}
                                >
                                    <FaCube /> {activeStep.targetStructure || "Entire System"} (Focus View)
                                </button>
                            </div>

                            {/* Quick Step Indicator Dots */}
                            <div style={{ display: "flex", gap: "6px" }}>
                                {guidedSteps.map((st, i) => (
                                    <button
                                        key={i}
                                        onClick={() => goToStep(i)}
                                        style={{
                                            width: "28px",
                                            height: "28px",
                                            borderRadius: "50%",
                                            border: `1px solid ${i === currentStepIndex ? "#00ffcc" : "rgba(255, 255, 255, 0.15)"}`,
                                            background: i === currentStepIndex ? "#00ffcc" : (i < currentStepIndex ? "rgba(16, 185, 129, 0.3)" : "rgba(255, 255, 255, 0.05)"),
                                            color: i === currentStepIndex ? "#000000" : "#ffffff",
                                            fontSize: "0.75rem",
                                            fontWeight: "700",
                                            cursor: "pointer"
                                        }}
                                        title={`Jump to Step ${i + 1}: ${st.title}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            }

            {/* Sub-component: Guided Steps Full List Tab */}
            function renderGuidedStepsListTab() {
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#00ffcc", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                                <FaCompass /> Chapter Guided Steps ({guidedSteps.length})
                            </h3>
                            <button
                                onClick={handleResetLesson}
                                className="btn-secondary"
                                style={{ fontSize: "0.78rem", padding: "4px 10px" }}
                            >
                                <FaRedo /> Reset Lesson
                            </button>
                        </div>

                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                            Follow the structured curriculum sequence below. Clicking any step repositions the 3D camera, highlights its anatomical component, and aligns explosion/slice views.
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
                            {guidedSteps.map((step, idx) => {
                                const isCurrent = currentStepIndex === idx;
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => goToStep(idx)}
                                        style={{
                                            background: isCurrent ? "rgba(0, 255, 204, 0.08)" : "rgba(255, 255, 255, 0.02)",
                                            border: `1px solid ${isCurrent ? "#00ffcc" : "var(--border-glass)"}`,
                                            borderRadius: "14px",
                                            padding: "16px",
                                            cursor: "pointer",
                                            transition: "all 0.2s"
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                            <span style={{
                                                fontSize: "0.75rem",
                                                fontWeight: "800",
                                                color: isCurrent ? "#00ffcc" : "#94a3b8",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "6px"
                                            }}>
                                                Step {step.step || idx + 1} • {step.concept}
                                            </span>
                                            {isCurrent && (
                                                <span style={{
                                                    fontSize: "0.72rem",
                                                    fontWeight: "700",
                                                    background: "rgba(0, 255, 204, 0.2)",
                                                    color: "#00ffcc",
                                                    padding: "2px 8px",
                                                    borderRadius: "6px"
                                                }}>
                                                    Active Step
                                                </span>
                                            )}
                                        </div>
                                        <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#ffffff", margin: "0 0 6px 0" }}>
                                            {step.title}
                                        </h4>
                                        <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: "1.5", margin: "0 0 10px 0" }}>
                                            {step.explanation}
                                        </p>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "#10b981", fontWeight: "600" }}>
                                            <FaCube /> Structure: {step.targetStructure}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            }

            {/* Sub-component: Syllabus Theory & Objectives Tab */}
            function renderTheoryTab() {
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        {/* Core Objectives */}
                        <div style={{
                            background: "rgba(16, 185, 129, 0.08)",
                            border: "1px solid rgba(16, 185, 129, 0.3)",
                            borderRadius: "16px",
                            padding: "20px"
                        }}>
                            <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "#10b981", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                                <FaLightbulb /> Core Learning Objectives
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {objList.map((obj, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.85rem", color: "#e2e8f0" }}>
                                        <FaCheckCircle style={{ color: "#10b981", marginTop: "3px", flexShrink: 0 }} />
                                        <span>{obj}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Detailed Syllabus Sections */}
                        {sectionList.map((sec, idx) => (
                            <div
                                key={idx}
                                style={{
                                    background: "rgba(15, 23, 42, 0.75)",
                                    border: "1px solid var(--border-glass)",
                                    borderRadius: "16px",
                                    padding: "22px"
                                }}
                            >
                                <h3 style={{
                                    fontSize: "1.15rem",
                                    fontWeight: "700",
                                    color: "#ffffff",
                                    marginBottom: "10px",
                                    borderLeft: "3px solid #10b981",
                                    paddingLeft: "12px"
                                }}>
                                    {sec.heading}
                                </h3>
                                <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: "1.65", marginBottom: "14px" }}>
                                    {sec.content}
                                </p>
                                {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                                    <ul style={{ paddingLeft: "18px", margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                                        {sec.bulletPoints.map((bp, bIdx) => (
                                            <li key={bIdx} style={{ fontSize: "0.83rem", color: "#cbd5e1", lineHeight: "1.5" }}>
                                                {bp}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}

                        {/* Key Terminology Glossary Table */}
                        <div style={{
                            background: "rgba(15, 23, 42, 0.75)",
                            border: "1px solid var(--border-glass)",
                            borderRadius: "16px",
                            padding: "20px"
                        }}>
                            <h3 style={{ fontSize: "1.05rem", fontWeight: "700", marginBottom: "14px", color: "#06b6d4", display: "flex", alignItems: "center", gap: "8px" }}>
                                📖 Key Scientific Terminology Glossary
                            </h3>
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                                    <thead>
                                        <tr style={{ borderBottom: "1px solid var(--border-glass)", textAlign: "left", color: "var(--text-muted)" }}>
                                            <th style={{ padding: "8px 10px", width: "32%" }}>Scientific Term</th>
                                            <th style={{ padding: "8px 10px" }}>Definition & Biological Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {termList.map((g, gIdx) => (
                                            <tr key={gIdx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                                                <td style={{ padding: "10px", fontWeight: "700", color: "#10b981" }}>
                                                    {g.term}
                                                </td>
                                                <td style={{ padding: "10px", color: "var(--text-secondary)", lineHeight: "1.45" }}>
                                                    {g.definition}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* References & Standards */}
                        <div style={{
                            background: "rgba(15, 23, 42, 0.5)",
                            border: "1px solid var(--border-glass)",
                            borderRadius: "14px",
                            padding: "16px"
                        }}>
                            <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)" }}>
                                Curriculum Alignment:
                            </span>
                            <ul style={{ paddingLeft: "18px", marginTop: "6px", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                                {refList.map((ref, rIdx) => (
                                    <li key={rIdx}>{ref}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            }

            {/* Sub-component: Chapter Review Quiz Tab */}
            function renderQuizTab() {
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        {/* Quiz Summary Header */}
                        <div style={{
                            background: quizSubmitted
                                ? "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.08))"
                                : "rgba(15, 23, 42, 0.8)",
                            border: `1px solid ${quizSubmitted ? "rgba(16, 185, 129, 0.4)" : "var(--border-glass)"}`,
                            borderRadius: "16px",
                            padding: "20px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "14px"
                        }}>
                            <div>
                                <h3 style={{ fontSize: "1.15rem", fontWeight: "700", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                                    <FaTrophy style={{ color: "#f59e0b" }} /> Chapter Review & Assessment Quiz
                                </h3>
                                <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", marginTop: "4px", marginBottom: 0 }}>
                                    {quizSubmitted
                                        ? `Review your answers and scientific rationale below.`
                                        : `Answer all ${quizList.length} questions to verify your understanding.`}
                                </p>
                            </div>

                            {quizSubmitted && quizScore ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#10b981" }}>
                                            {quizScore.score} / {quizScore.total}
                                        </div>
                                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                            {Math.round((quizScore.score / quizScore.total) * 100)}% Score
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleRetakeQuiz}
                                        className="btn-secondary"
                                        style={{ fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
                                    >
                                        <FaRedo /> Retake
                                    </button>
                                </div>
                            ) : null}
                        </div>

                        {/* Question List */}
                        {quizList.map((q, qIdx) => {
                            const userAnswer = quizAnswers[qIdx];
                            const isCorrect = userAnswer === q.correctIndex;

                            return (
                                <div
                                    key={qIdx}
                                    style={{
                                        background: "rgba(15, 23, 42, 0.75)",
                                        border: `1px solid ${quizSubmitted ? (isCorrect ? "rgba(16, 185, 129, 0.4)" : "rgba(244, 63, 94, 0.4)") : "var(--border-glass)"}`,
                                        borderRadius: "14px",
                                        padding: "18px"
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                                        <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#ffffff", lineHeight: "1.4", margin: 0 }}>
                                            <span style={{ color: "#10b981", marginRight: "6px" }}>Q{qIdx + 1}.</span>
                                            {q.question}
                                        </h4>
                                        {quizSubmitted && (
                                            <span style={{
                                                fontSize: "0.75rem",
                                                fontWeight: "700",
                                                padding: "2px 8px",
                                                borderRadius: "6px",
                                                background: isCorrect ? "rgba(16, 185, 129, 0.2)" : "rgba(244, 63, 94, 0.2)",
                                                color: isCorrect ? "#10b981" : "#f43f5e",
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "4px"
                                            }}>
                                                {isCorrect ? <FaCheckCircle /> : <FaTimesCircle />}
                                                {isCorrect ? "Correct" : "Incorrect"}
                                            </span>
                                        )}
                                    </div>

                                    {/* Options */}
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "6px", marginBottom: "12px" }}>
                                        {q.options.map((opt, optIdx) => {
                                            const isSelected = userAnswer === optIdx;
                                            const isThisCorrect = q.correctIndex === optIdx;

                                            let optBorder = "var(--border-glass)";
                                            let optBg = "rgba(255, 255, 255, 0.03)";
                                            let optColor = "var(--text-secondary)";

                                            if (quizSubmitted) {
                                                if (isThisCorrect) {
                                                    optBorder = "#10b981";
                                                    optBg = "rgba(16, 185, 129, 0.15)";
                                                    optColor = "#10b981";
                                                } else if (isSelected && !isThisCorrect) {
                                                    optBorder = "#f43f5e";
                                                    optBg = "rgba(244, 63, 94, 0.15)";
                                                    optColor = "#f43f5e";
                                                }
                                            } else if (isSelected) {
                                                optBorder = "#06b6d4";
                                                optBg = "rgba(6, 182, 212, 0.15)";
                                                optColor = "#ffffff";
                                            }

                                            return (
                                                <div
                                                    key={optIdx}
                                                    onClick={() => handleSelectOption(qIdx, optIdx)}
                                                    style={{
                                                        padding: "10px 14px",
                                                        borderRadius: "8px",
                                                        border: `1px solid ${optBorder}`,
                                                        background: optBg,
                                                        color: optColor,
                                                        fontSize: "0.85rem",
                                                        cursor: quizSubmitted ? "default" : "pointer",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "10px",
                                                        transition: "all 0.15s ease"
                                                    }}
                                                >
                                                    <span style={{
                                                        width: "20px",
                                                        height: "20px",
                                                        borderRadius: "50%",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: "0.72rem",
                                                        fontWeight: "700",
                                                        background: isSelected ? (quizSubmitted ? (isThisCorrect ? "#10b981" : "#f43f5e") : "#06b6d4") : "rgba(255, 255, 255, 0.08)",
                                                        color: isSelected ? "#ffffff" : "var(--text-muted)"
                                                    }}>
                                                        {String.fromCharCode(65 + optIdx)}
                                                    </span>
                                                    <span>{opt}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Explanation on Submission */}
                                    {quizSubmitted && (
                                        <div style={{
                                            background: "rgba(0, 0, 0, 0.3)",
                                            borderRadius: "8px",
                                            padding: "10px 14px",
                                            fontSize: "0.82rem",
                                            color: "var(--text-secondary)",
                                            borderLeft: `3px solid ${isCorrect ? "#10b981" : "#f43f5e"}`
                                        }}>
                                            <strong style={{ color: "#ffffff" }}>Scientific Rationale: </strong>
                                            {q.explanation}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {!quizSubmitted && (
                            <div style={{ textAlign: "center", marginTop: "8px" }}>
                                <button
                                    onClick={handleSubmitQuiz}
                                    className="btn-emerald"
                                    style={{ padding: "12px 32px", fontSize: "0.95rem" }}
                                >
                                    Submit Quiz Answers & Check Score
                                </button>
                            </div>
                        )}
                    </div>
                );
            }

            {/* Sub-component: AI Doubt Tutor Tab */}
            function renderAiTutorTab() {
                const sampleDoubts = [
                    "Explain this structure in simple terms",
                    `Why is this organ or process critical in ${chapter.gradeRange}?`,
                    "What happens if there is a mutation or malfunction here?",
                    "Highlight the main component on the 3D stage"
                ];

                return (
                    <div style={{
                        background: "rgba(15, 23, 42, 0.8)",
                        border: "1px solid var(--border-glass)",
                        borderRadius: "16px",
                        display: "flex",
                        flexDirection: "column",
                        minHeight: "560px",
                        overflow: "hidden"
                    }}>
                        {/* AI Status Header */}
                        <div style={{
                            padding: "14px 18px",
                            borderBottom: "1px solid var(--border-glass)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "8px"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "10px",
                                    background: "linear-gradient(135deg, #10b981, #06b6d4)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#ffffff"
                                }}>
                                    <FaRobot />
                                </div>
                                <div>
                                    <div style={{ fontSize: "0.92rem", fontWeight: "700" }}>AI Biology Doubt Tutor</div>
                                    <div style={{ fontSize: "0.72rem", color: "var(--accent-purple)", display: "flex", alignItems: "center", gap: "4px", fontWeight: "600" }}>
                                        <span>⚡ Local Knowledge Engine</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setTtsEnabled(!ttsEnabled)}
                                style={{
                                    background: ttsEnabled ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.05)",
                                    border: `1px solid ${ttsEnabled ? "#10b981" : "var(--border-glass)"}`,
                                    color: ttsEnabled ? "#10b981" : "var(--text-muted)",
                                    padding: "4px 8px",
                                    borderRadius: "8px",
                                    fontSize: "0.75rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                {ttsEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
                                {ttsEnabled ? "Voice ON" : "Voice OFF"}
                            </button>
                        </div>

                        {/* Messages Body */}
                        <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", maxHeight: "360px" }}>
                            {aiMessages.map((msg, mIdx) => {
                                const isUser = msg.sender === "user";
                                return (
                                    <div
                                        key={mIdx}
                                        style={{
                                            alignSelf: isUser ? "flex-end" : "flex-start",
                                            maxWidth: "88%",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: isUser ? "flex-end" : "flex-start"
                                        }}
                                    >
                                        <div
                                            style={{
                                                padding: "12px 16px",
                                                borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                                                background: isUser ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(30, 41, 59, 0.9)",
                                                border: `1px solid ${isUser ? "transparent" : "var(--border-glass)"}`,
                                                color: "#ffffff",
                                                fontSize: "0.85rem",
                                                lineHeight: "1.5"
                                            }}
                                        >
                                            {isUser ? msg.text : <FormattedMessage text={msg.text} />}
                                            {msg.action && (
                                                <div style={{ marginTop: "8px", padding: "6px 10px", background: "rgba(0, 0, 0, 0.3)", borderRadius: "6px", fontSize: "0.75rem", color: "#00ffcc", display: "flex", alignItems: "center", gap: "6px" }}>
                                                    <FaCube /> 3D Spatial Action: Focused on {msg.action.targetMesh || "structure"}
                                                </div>
                                            )}
                                        </div>
                                        <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "2px" }}>
                                            {msg.time}
                                        </span>
                                    </div>
                                );
                            })}
                            {aiLoading && (
                                <div style={{ alignSelf: "flex-start", padding: "10px 14px", background: "rgba(30, 41, 59, 0.9)", borderRadius: "14px", fontSize: "0.8rem", color: "#10b981", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", animation: "pulse 1s infinite" }} />
                                    Analyzing doubt against {chapter.gradeRange} syllabus...
                                </div>
                            )}
                        </div>

                        {/* Preset Doubt Pills */}
                        <div style={{ padding: "8px 16px", display: "flex", gap: "6px", overflowX: "auto", borderTop: "1px solid var(--border-glass)" }}>
                            {sampleDoubts.map((doubt, dIdx) => (
                                <button
                                    key={dIdx}
                                    onClick={() => handleSendAiDoubt(doubt)}
                                    style={{
                                        background: "rgba(255, 255, 255, 0.04)",
                                        border: "1px solid var(--border-glass)",
                                        borderRadius: "20px",
                                        padding: "4px 10px",
                                        fontSize: "0.72rem",
                                        color: "var(--text-secondary)",
                                        whiteSpace: "nowrap",
                                        cursor: "pointer"
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = "#10b981"; e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.4)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border-glass)"; }}
                                >
                                    {doubt}
                                </button>
                            ))}
                        </div>

                        {/* Input Row */}
                        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border-glass)", display: "flex", gap: "8px" }}>
                            <input
                                type="text"
                                placeholder={`Ask any question about ${chapter.title}...`}
                                value={aiInput}
                                onChange={(e) => setAiInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") handleSendAiDoubt(); }}
                                style={{
                                    flex: 1,
                                    background: "rgba(30, 41, 59, 0.7)",
                                    border: "1px solid var(--border-glass)",
                                    borderRadius: "8px",
                                    fontSize: "0.85rem",
                                    padding: "8px 12px",
                                    color: "#ffffff"
                                }}
                            />
                            <button
                                onClick={() => handleSendAiDoubt()}
                                disabled={aiLoading || !aiInput.trim()}
                                className="btn-emerald"
                                style={{ padding: "8px 14px", opacity: aiLoading || !aiInput.trim() ? 0.6 : 1 }}
                            >
                                <FaPaperPlane />
                            </button>
                        </div>
                    </div>
                );
            }

            {/* Sub-component: Real-Time Classroom Sync Tab */}
            function renderSyncTab() {
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div style={{
                            background: "rgba(15, 23, 42, 0.8)",
                            border: "1px solid var(--border-glass)",
                            borderRadius: "16px",
                            padding: "20px"
                        }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#00ffcc", margin: "0 0 10px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                                <FaUsers /> Real-Time Spatial Classroom Room
                            </h3>
                            <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: "1.5", margin: "0 0 16px 0" }}>
                                Connect to an interactive multi-user classroom room. When the teacher navigates steps or rotates the 3D model, student viewports synchronize in real time via Socket.IO.
                            </p>

                            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginBottom: "16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <label style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Room Code:</label>
                                    <input
                                        type="text"
                                        value={roomId}
                                        disabled={isJoinedRoom}
                                        onChange={(e) => setRoomId(e.target.value.toLowerCase())}
                                        style={{
                                            background: "rgba(30, 41, 59, 0.8)",
                                            border: "1px solid var(--border-glass)",
                                            color: "#00ffcc",
                                            fontWeight: "700",
                                            padding: "6px 12px",
                                            borderRadius: "8px",
                                            width: "120px",
                                            fontSize: "0.85rem"
                                        }}
                                    />
                                </div>

                                {!isJoinedRoom ? (
                                    <button
                                        onClick={handleJoinClassroom}
                                        className="btn-emerald"
                                        style={{ padding: "6px 16px", fontSize: "0.82rem" }}
                                    >
                                        Join Classroom Room
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleLeaveClassroom}
                                        style={{
                                            background: "rgba(244, 63, 94, 0.2)",
                                            border: "1px solid #f43f5e",
                                            color: "#f43f5e",
                                            padding: "6px 14px",
                                            borderRadius: "8px",
                                            fontSize: "0.82rem",
                                            cursor: "pointer",
                                            fontWeight: "600"
                                        }}
                                    >
                                        Leave Room
                                    </button>
                                )}

                                {isJoinedRoom && (
                                    <button
                                        onClick={() => setIsChatOpen(!isChatOpen)}
                                        className="btn-secondary"
                                        style={{ padding: "6px 14px", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
                                    >
                                        <FaComments /> {isChatOpen ? "Hide Chat" : "Open Classroom Chat"}
                                    </button>
                                )}
                            </div>

                            {/* Teacher Broadcast Controller */}
                            {isJoinedRoom && (
                                <div style={{
                                    background: isBroadcasting ? "rgba(244, 63, 94, 0.08)" : "rgba(255, 255, 255, 0.03)",
                                    border: `1px solid ${isBroadcasting ? "rgba(244, 63, 94, 0.4)" : "var(--border-glass)"}`,
                                    borderRadius: "12px",
                                    padding: "14px",
                                    marginBottom: "16px"
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div>
                                            <strong style={{ fontSize: "0.88rem", color: isBroadcasting ? "#f43f5e" : "#ffffff", display: "flex", alignItems: "center", gap: "6px" }}>
                                                <FaChalkboardTeacher /> Teacher Live Broadcast Mode
                                            </strong>
                                            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginTop: "2px" }}>
                                                {isBroadcasting
                                                    ? "Active: Your 3D camera, step changes, and structure selections are streamed to students."
                                                    : "Toggle on to stream your 3D interactions to connected students."}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => {
                                                const next = !isBroadcasting;
                                                setIsBroadcasting(next);
                                                if (next) {
                                                    toast.success("Broadcast mode active! 3D controls streamed to room.", { icon: "📡" });
                                                } else {
                                                    toast("Broadcast mode deactivated.", { icon: "⏹️" });
                                                }
                                            }}
                                            style={{
                                                background: isBroadcasting ? "#f43f5e" : "rgba(255, 255, 255, 0.08)",
                                                color: "#ffffff",
                                                border: "none",
                                                borderRadius: "8px",
                                                padding: "6px 14px",
                                                fontSize: "0.8rem",
                                                fontWeight: "700",
                                                cursor: "pointer"
                                            }}
                                        >
                                            {isBroadcasting ? "Stop Broadcast" : "Start Broadcast"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Attendance / Room Members */}
                            {isJoinedRoom && (
                                <div>
                                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>
                                        Connected Participants ({connectedUsers.length}):
                                    </span>
                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                                        {connectedUsers.map((u, idx) => (
                                            <span
                                                key={idx}
                                                style={{
                                                    fontSize: "0.78rem",
                                                    padding: "4px 10px",
                                                    borderRadius: "20px",
                                                    background: "rgba(255, 255, 255, 0.05)",
                                                    border: "1px solid var(--border-glass)",
                                                    color: u.user?.role === "teacher" ? "#00ffcc" : "#cbd5e1"
                                                }}
                                            >
                                                {u.user?.role === "teacher" ? "👨‍🏫" : "🎓"} {u.user?.name || "Student"}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            }

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", display: "flex", flexDirection: "column" }}>
            <Navbar />

            {/* Top Navigation & Breadcrumbs Header */}
            <header style={{
                background: "rgba(15, 23, 42, 0.95)",
                borderBottom: "1px solid var(--border-glass)",
                backdropFilter: "blur(12px)",
                padding: "12px 24px",
                position: "sticky",
                top: "70px",
                zIndex: 80
            }}>
                <div style={{ maxWidth: "1680px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                    {/* Left: Back button & Breadcrumbs */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                        <button
                            onClick={() => navigate("/biology")}
                            style={{
                                background: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid var(--border-glass)",
                                color: "var(--text-secondary)",
                                padding: "6px 14px",
                                borderRadius: "8px",
                                fontSize: "0.82rem",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                cursor: "pointer",
                                transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = "#10b981"; e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.4)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border-glass)"; }}
                        >
                            <FaArrowLeft /> Biology Hub
                        </button>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                            <span>{moduleObj?.icon || "🔬"} {moduleObj?.title || "Biology Module"}</span>
                            <span>/</span>
                            <span style={{ color: "#ffffff", fontWeight: "700" }}>{chapter.title}</span>
                        </div>
                    </div>

                    {/* Middle: Step Progress Tracker */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                            Lesson Progress: <strong style={{ color: "#00ffcc" }}>{stepProgress}%</strong>
                        </span>
                        <div style={{ width: "120px", height: "6px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "3px", overflow: "hidden" }}>
                            <div style={{ width: `${stepProgress}%`, height: "100%", background: "linear-gradient(90deg, #10b981, #00ffcc)", transition: "width 0.3s ease" }} />
                        </div>
                    </div>

                    {/* Right: Split view toggle & Prev/Next Navigation */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {/* Classroom live badge */}
                        {isJoinedRoom && (
                            <span style={{
                                fontSize: "0.75rem",
                                fontWeight: "700",
                                padding: "4px 10px",
                                borderRadius: "8px",
                                background: isBroadcasting ? "rgba(244, 63, 94, 0.18)" : "rgba(16, 185, 129, 0.18)",
                                color: isBroadcasting ? "#f43f5e" : "#10b981",
                                border: `1px solid ${isBroadcasting ? "rgba(244, 63, 94, 0.4)" : "rgba(16, 185, 129, 0.4)"}`,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px"
                            }}>
                                <FaBroadcastTower /> {isBroadcasting ? "Broadcasting Live" : "Classroom Synced"} ({roomId})
                            </span>
                        )}

                        <button
                            onClick={() => setSplitScreen(!splitScreen)}
                            style={{
                                background: splitScreen ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.05)",
                                border: `1px solid ${splitScreen ? "#10b981" : "var(--border-glass)"}`,
                                color: splitScreen ? "#10b981" : "var(--text-secondary)",
                                padding: "6px 12px",
                                borderRadius: "8px",
                                fontSize: "0.82rem",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                cursor: "pointer"
                            }}
                            title="Toggle Split View"
                        >
                            <FaColumns /> {splitScreen ? "Split View" : "Full View"}
                        </button>

                        {prevChapter && (
                            <button
                                onClick={() => navigate(`/biology/lesson/${prevChapter.id}`)}
                                style={{
                                    background: "rgba(255, 255, 255, 0.05)",
                                    border: "1px solid var(--border-glass)",
                                    color: "var(--text-secondary)",
                                    padding: "6px 12px",
                                    borderRadius: "8px",
                                    fontSize: "0.82rem",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                <FaArrowLeft /> Prev
                            </button>
                        )}

                        {nextChapter && (
                            <button
                                onClick={() => navigate(`/biology/lesson/${nextChapter.id}`)}
                                style={{
                                    background: "rgba(16, 185, 129, 0.15)",
                                    border: "1px solid rgba(16, 185, 129, 0.4)",
                                    color: "#10b981",
                                    padding: "6px 14px",
                                    borderRadius: "8px",
                                    fontSize: "0.82rem",
                                    fontWeight: "600",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                Next <FaArrowRight />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Chapter Hero Title Strip */}
            <div style={{ maxWidth: "1680px", width: "100%", margin: "0 auto", padding: "16px 24px 8px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px" }}>
                    <div>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px", flexWrap: "wrap" }}>
                            <span style={{
                                fontSize: "0.75rem",
                                fontWeight: "800",
                                padding: "3px 10px",
                                borderRadius: "8px",
                                background: "rgba(16, 185, 129, 0.18)",
                                color: "#10b981",
                                border: "1px solid rgba(16, 185, 129, 0.35)"
                            }}>
                                🎓 {chapter.gradeRange}
                            </span>
                            <span style={{
                                fontSize: "0.75rem",
                                fontWeight: "600",
                                padding: "3px 10px",
                                borderRadius: "8px",
                                background: "rgba(6, 182, 212, 0.15)",
                                color: "#06b6d4",
                                border: "1px solid rgba(6, 182, 212, 0.3)"
                            }}>
                                {difficultyStr} Level
                            </span>
                            <span style={{
                                fontSize: "0.75rem",
                                fontWeight: "700",
                                padding: "3px 10px",
                                borderRadius: "8px",
                                background: "rgba(0, 255, 204, 0.15)",
                                color: "#00ffcc",
                                border: "1px solid rgba(0, 255, 204, 0.3)",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px"
                            }}>
                                <FaCube /> Interactive 3D {chapter.modelName}
                            </span>
                            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                                <FaClock /> {readTimeStr}
                            </span>
                        </div>

                        <h1 style={{ fontSize: "1.85rem", fontFamily: "var(--font-display)", fontWeight: "800", margin: "0 0 6px 0", color: "#ffffff" }}>
                            {chapter.title}
                        </h1>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", maxWidth: "960px", margin: 0 }}>
                            {overviewStr}
                        </p>
                    </div>

                    {/* Mode Navigation Tabs */}
                    <div style={{
                        background: "rgba(15, 23, 42, 0.8)",
                        border: "1px solid var(--border-glass)",
                        borderRadius: "14px",
                        padding: "4px",
                        display: "flex",
                        gap: "4px",
                        flexWrap: "wrap"
                    }}>
                        {[
                            { id: "guided", label: `Guided Steps (${guidedSteps.length})`, icon: <FaCompass /> },
                            { id: "theory", label: "Syllabus Theory", icon: <FaBookOpen /> },
                            { id: "quiz", label: `Quiz (${quizList.length}Q)`, icon: <FaQuestionCircle /> },
                            { id: "ai", label: "AI Tutor", icon: <FaRobot /> },
                            { id: "sync", label: "Classroom Sync", icon: <FaUsers /> }
                        ].map(tab => {
                            const isCurrent = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        background: isCurrent ? "linear-gradient(135deg, #10b981, #059669)" : "transparent",
                                        color: isCurrent ? "#ffffff" : "var(--text-secondary)",
                                        border: "none",
                                        padding: "8px 14px",
                                        borderRadius: "10px",
                                        fontSize: "0.82rem",
                                        fontWeight: isCurrent ? "700" : "500",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        cursor: "pointer",
                                        boxShadow: isCurrent ? "0 4px 14px rgba(16, 185, 129, 0.3)" : "none",
                                        transition: "all 0.2s"
                                    }}
                                >
                                    {tab.icon} {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
{/* Main Interactive Stage Grid */}
            <div style={{ maxWidth: "1680px", width: "100%", margin: "0 auto", padding: "12px 24px 60px 24px", flex: 1 }}>
                {splitScreen ? (
                    <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "24px", minHeight: "720px", alignItems: "start" }}>
                        {/* Left Column: 3D Stage + Guided Stepper Bar */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div style={{
                                background: "rgba(15, 23, 42, 0.7)",
                                border: "1px solid var(--border-glass)",
                                borderRadius: "20px",
                                overflow: "hidden",
                                height: "clamp(500px, 70vh, 760px)",
                                position: "relative"
                            }}>
                                <AnatomyCanvas
                                    activeModel={chapter.modelName}
                                    selectedPart={selectedPart}
                                    partDetail={currentPartDetail}
                                    onSelectPart={(pName) => setSelectedPart(pName)}
                                    actionCue={actionCue}
                                    showToolbar={true}
                                    showModelSelector={false}
                                    isBroadcasting={isBroadcasting}
                                    onBroadcastControl={handleBroadcastSpatial}
                                />
                            </div>

                            {/* Guided Learning Stepper Console (Always accessible under 3D stage) */}
                            {renderGuidedStepperConsole()}
                        </div>

                        {/* Right Column: Tab Panels */}
                        <div style={{
                            background: "rgba(15, 23, 42, 0.65)",
                            border: "1px solid var(--border-glass)",
                            borderRadius: "20px",
                            padding: "20px",
                            overflowY: "auto",
                            maxHeight: "820px"
                        }}>
                            {activeTab === "guided" && renderGuidedStepsListTab()}
                            {activeTab === "theory" && renderTheoryTab()}
                            {activeTab === "quiz" && renderQuizTab()}
                            {activeTab === "ai" && renderAiTutorTab()}
                            {activeTab === "sync" && renderSyncTab()}
                        </div>
                    </div>
                ) : (
                    /* Full-width Stacked Layout */
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div style={{
                            background: "rgba(15, 23, 42, 0.7)",
                            border: "1px solid var(--border-glass)",
                            borderRadius: "20px",
                            overflow: "hidden",
                            height: "clamp(500px, 70vh, 760px)",
                            position: "relative"
                        }}>
                            <AnatomyCanvas
                                activeModel={chapter.modelName}
                                selectedPart={selectedPart}
                                partDetail={currentPartDetail}
                                onSelectPart={(pName) => setSelectedPart(pName)}
                                actionCue={actionCue}
                                showToolbar={true}
                                showModelSelector={false}
                                isBroadcasting={isBroadcasting}
                                onBroadcastControl={handleBroadcastSpatial}
                            />
                        </div>

                        {renderGuidedStepperConsole()}

                        <div style={{
                            background: "rgba(15, 23, 42, 0.65)",
                            border: "1px solid var(--border-glass)",
                            borderRadius: "20px",
                            padding: "24px"
                        }}>
                            {activeTab === "guided" && renderGuidedStepsListTab()}
                            {activeTab === "theory" && renderTheoryTab()}
                            {activeTab === "quiz" && renderQuizTab()}
                            {activeTab === "ai" && renderAiTutorTab()}
                            {activeTab === "sync" && renderSyncTab()}
                        </div>
                    </div>
                )}
            </div>

            {/* Floating Classroom Chat Modal / Drawer */}
            {isJoinedRoom && (
                <ClassroomChatWidget
                    socket={socket}
                    roomId={roomId}
                    isOpen={isChatOpen}
                    onClose={() => setIsChatOpen(false)}
                />
            )}

                    </div>
    );
}

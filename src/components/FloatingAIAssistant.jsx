import { useState, useRef, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { askAssistant } from "../services/aiClient";
import FormattedMessage, { stripFormattingForSpeech } from "./FormattedMessage";
import toast from "react-hot-toast";
import {
    FaRobot,
    FaTimes,
    FaMinus,
    FaPaperPlane,
    FaMicrophone,
    FaMicrophoneSlash,
    FaVolumeUp,
    FaVolumeMute,
    FaQuestionCircle,
    FaStethoscope,
    FaComments,
    FaLightbulb,
    FaSpinner
} from "react-icons/fa";

export default function FloatingAIAssistant() {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "ai",
            text: "👋 **Hello! I am your AI Educational Assistant.**\n\nPowered by the offline **Local Knowledge Engine** for **Biology, Physics, and Chemistry**.\n\nAsk me any question or select a topic below!"
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Ensure all React hooks execute unconditionally on every render
    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen, loading]);

    // If user is not logged in, DO NOT render the floating assistant
    if (!user) {
        return null;
    }

    const isTeacher = user?.role === "teacher";

    const quickChips = isTeacher
        ? [
            "📝 Generate 3D Quiz",
            "🩺 Clinical Case Study",
            "Left ventricle hemodynamics",
            "How DC motors work"
        ]
        : [
            "Tell me about a cell.",
            "Explain Newton's second law.",
            "Balance H2 + O2 -> H2O.",
            "Explain Ohm's law with an example."
        ];

    const toggleSpeechRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error("Speech recognition is not supported in this browser.", { icon: "🎙️" });
            return;
        }

        if (isListening) {
            setIsListening(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
            toast("Listening... Speak your question now!", { icon: "🎙️" });
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            setIsListening(false);
            handleSend(transcript);
        };

        recognition.onerror = () => {
            setIsListening(false);
        };

        recognition.start();
    };

       const handleSend = async (customQuery = null) => {
        const queryText = (customQuery || input).trim();
        if (!queryText || loading) return;

        setInput("");

        const userMsg = {
            id: Date.now(),
            sender: "user",
            text: queryText
        };
        setMessages((prev) => [...prev, userMsg]);
        setLoading(true);

        try {
            const isQuizMode = queryText.includes("Quiz") || queryText.includes("quiz");
            const isCaseMode = queryText.includes("Case Study") || queryText.includes("case study");

            const res = await askAssistant({
                question: queryText,
                messages,
                mode: isQuizMode ? "quiz" : isCaseMode ? "case_study" : "chat",
                role: user?.role || "student"
            });
            const answerText = res.answer;
            if (res.offline) toast("Server unreachable - answered offline.", { icon: "📴" });

            const aiMsg = {
                id: Date.now() + 1,
                sender: "ai",
                text: answerText
            };
            setMessages((prev) => [...prev, aiMsg]);

            if (isSpeaking && window.speechSynthesis) {
                window.speechSynthesis.cancel();
                const clean = stripFormattingForSpeech(answerText);
                const ut = new SpeechSynthesisUtterance(clean);
                window.speechSynthesis.speak(ut);
            }
        } catch (e) {
            toast.error("Could not process question.", { icon: "⚠️" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 1100, pointerEvents: "auto" }}>
            {/* Expanded Assistant Card */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            width: "clamp(340px, 90vw, 440px)",
                            height: "clamp(480px, 70vh, 600px)",
                            marginBottom: "12px",
                            background: "rgba(10, 15, 28, 0.95)",
                            border: "1.5px solid rgba(0, 255, 204, 0.4)",
                            borderRadius: "20px",
                            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.75), 0 0 25px rgba(0, 255, 204, 0.15)",
                            backdropFilter: "blur(18px)",
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden"
                        }}
                    >
                        {/* Title Bar */}
                        <div style={{
                            padding: "14px 18px",
                            borderBottom: "1px solid var(--border-glass)",
                            background: "rgba(15, 23, 42, 0.8)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{
                                    width: "34px",
                                    height: "34px",
                                    borderRadius: "10px",
                                    background: "linear-gradient(135deg, #06b6d4, #a855f7)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#ffffff"
                                }}>
                                    <FaRobot />
                                </div>
                                <div>
                                    <div style={{ fontSize: "0.92rem", fontWeight: "700", color: "#ffffff" }}>
                                        AI Spatial Assistant
                                    </div>
                                    <div style={{ fontSize: "0.72rem", color: "var(--accent-purple)", fontWeight: "600" }}>
                                        ⚡ Local Knowledge Engine ({user?.role || "learner"})
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <button
                                    onClick={() => {
                                        setIsSpeaking(!isSpeaking);
                                        if (window.speechSynthesis) window.speechSynthesis.cancel();
                                    }}
                                    style={{ background: "none", border: "none", color: isSpeaking ? "#10b981" : "var(--text-muted)", cursor: "pointer", fontSize: "0.85rem", padding: "4px" }}
                                    title={isSpeaking ? "Mute Voice Output" : "Enable Voice Output"}
                                >
                                    {isSpeaking ? <FaVolumeUp /> : <FaVolumeMute />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.9rem", padding: "4px" }}
                                    title="Minimize Assistant"
                                >
                                    <FaMinus />
                                </button>
                            </div>
                        </div>

                        {/* Quick Chips */}
                        <div style={{ padding: "8px 14px", display: "flex", gap: "6px", flexWrap: "wrap", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", background: "rgba(0, 0, 0, 0.2)" }}>
                            {quickChips.map((chip, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSend(chip)}
                                    style={{
                                        background: "rgba(255, 255, 255, 0.05)",
                                        border: "1px solid var(--border-glass)",
                                        color: "var(--text-secondary)",
                                        padding: "4px 8px",
                                        borderRadius: "8px",
                                        fontSize: "0.72rem",
                                        cursor: "pointer",
                                        whiteSpace: "nowrap"
                                    }}
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>

                        {/* Chat Messages */}
                        <div style={{
                            flex: 1,
                            padding: "14px",
                            overflowY: "auto",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px"
                        }}>
                            {messages.map((m) => {
                                const isUser = m.sender === "user";
                                return (
                                    <div
                                        key={m.id}
                                        style={{
                                            alignSelf: isUser ? "flex-end" : "flex-start",
                                            maxWidth: "92%",
                                            padding: "10px 14px",
                                            borderRadius: isUser ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                                            background: isUser ? "linear-gradient(135deg, #06b6d4, #2563eb)" : "rgba(30, 41, 59, 0.8)",
                                            border: isUser ? "none" : "1px solid var(--border-glass)",
                                            color: "#ffffff",
                                            fontSize: "0.85rem",
                                            lineHeight: "1.5"
                                        }}
                                    >
                                        {isUser ? m.text : <FormattedMessage text={m.text} />}
                                    </div>
                                );
                            })}
                            {loading && (
                                <div style={{ alignSelf: "flex-start", padding: "8px 12px", borderRadius: "10px", background: "rgba(30, 41, 59, 0.8)", color: "var(--text-secondary)", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "6px" }}>
                                    <FaSpinner className="spin" style={{ color: "var(--accent-cyan)" }} /> Thinking...
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Box */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                            style={{
                                padding: "10px 14px",
                                borderTop: "1px solid var(--border-glass)",
                                display: "flex",
                                gap: "8px",
                                background: "rgba(15, 23, 42, 0.9)"
                            }}
                        >
                            <button
                                type="button"
                                onClick={toggleSpeechRecognition}
                                style={{
                                    background: isListening ? "#ef4444" : "rgba(255, 255, 255, 0.08)",
                                    border: "1px solid var(--border-glass)",
                                    color: "#ffffff",
                                    width: "38px",
                                    height: "38px",
                                    borderRadius: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer"
                                }}
                                title={isListening ? "Stop Listening" : "Speak your question"}
                            >
                                {isListening ? <FaMicrophoneSlash /> : <FaMicrophone style={{ color: "var(--accent-cyan)" }} />}
                            </button>

                            <input
                                type="text"
                                placeholder="Ask a doubt (cells, Newton, Ohm, reactions)..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                style={{
                                    flex: 1,
                                    height: "38px",
                                    borderRadius: "10px",
                                    padding: "0 12px",
                                    fontSize: "0.85rem",
                                    background: "rgba(0, 0, 0, 0.3)",
                                    border: "1px solid var(--border-glass)",
                                    color: "#ffffff"
                                }}
                            />

                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={!input.trim() || loading}
                                style={{
                                    height: "38px",
                                    padding: "0 14px",
                                    borderRadius: "10px",
                                    fontSize: "0.85rem"
                                }}
                            >
                                <FaPaperPlane />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Launcher Pill / Button */}
            {!isOpen && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    style={{
                        background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
                        color: "#ffffff",
                        border: "1.5px solid rgba(255, 255, 255, 0.3)",
                        borderRadius: "30px",
                        padding: "10px 18px",
                        fontSize: "0.88rem",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                        boxShadow: "0 6px 25px rgba(6, 182, 212, 0.4), 0 0 15px rgba(139, 92, 246, 0.3)"
                    }}
                    title="Open AI Spatial Assistant"
                >
                    <FaRobot style={{ fontSize: "1.1rem" }} />
                    <span>AI Assistant</span>
                    <span style={{
                        background: "rgba(0, 0, 0, 0.25)",
                        padding: "2px 6px",
                        borderRadius: "10px",
                        fontSize: "0.7rem",
                        letterSpacing: "0.03em"
                    }}>
                        Local
                    </span>
                </motion.button>
            )}
        </div>
    );
}

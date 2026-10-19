import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { clearStudentDoubt } from "../services/geminiService";
import FormattedMessage, { stripFormattingForSpeech } from "./FormattedMessage";

import {
    FaRobot,
    FaMicrophone,
    FaMicrophoneSlash,
    FaPaperPlane,
    FaLightbulb,
    FaVolumeUp,
    FaVolumeMute,
    FaQuestionCircle,
    FaCheckCircle,
    FaEye
} from "react-icons/fa";

export default function StudentDoubtAssistant({
    chapter,
    activePart,
    onExecuteActionCue
}) {
    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: `Hello! I am your AI Study Assistant powered by the Local Knowledge Engine. Ask me any doubt about Biology, Physics, or Chemistry—such as "${chapter?.title || 'cell biology, Newton\'s laws, or Ohm\'s law'}".`,
            cue: null
        }
    ]);
    const [inputText, setInputText] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const chatEndRef = useRef();

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle Voice Mic Input using Web Speech API SpeechRecognition
    const toggleSpeechRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            toast.error("Web Speech Recognition API is not supported in this browser.", { icon: "🎙️" });
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
            toast("Listening... Speak your science question now!", { icon: "🎙️" });
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInputText(transcript);
            setIsListening(false);
            handleSendQuestion(transcript);
        };

        recognition.onerror = (event) => {
            console.warn("Speech recognition notice:", event.error);
            setIsListening(false);
            toast.error("Could not capture audio mic. Please type your doubt.", { icon: "🎙️" });
        };

        recognition.start();
    };

    const handleSendQuestion = async (textToSend = null) => {
        const query = (textToSend || inputText).trim();
        if (!query || isLoading) return;

        setInputText("");

        // Push User Message
        const userMsg = { sender: "user", text: query };
        setMessages((prev) => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const recentHistory = messages.slice(-6).map((m) => ({
                sender: m.sender,
                text: m.text
            }));
            const res = await clearStudentDoubt(query, chapter, activePart, recentHistory);

            const aiMsg = {
                sender: "ai",
                text: res.answerText,
                cue: res.action
            };

            setMessages((prev) => [...prev, aiMsg]);

            // Execute 3D Action Cue on Stage ONLY if a valid action target is present
            if (res.action && onExecuteActionCue && res.action.targetMesh && res.action.targetMesh !== "main") {
                onExecuteActionCue({ action: res.action, speech: res.answerText });
            }

            // Speak AI Answer aloud if not muted
            if (!isMuted && typeof window !== "undefined" && window.speechSynthesis) {
                window.speechSynthesis.cancel();
                const cleanSpeech = stripFormattingForSpeech(res.answerText);
                const ut = new SpeechSynthesisUtterance(cleanSpeech);
                ut.rate = 1.0;
                window.speechSynthesis.speak(ut);
            }

            toast.success("Answered from Local Knowledge Engine", { icon: "⚡" });
        } catch (err) {
            console.error("Doubt clearance error:", err);
            toast.error("Could not process question.", { icon: "⚠️" });
        } finally {
            setIsLoading(false);
        }
    };

    const suggestedQuestions = [
        "Tell me about a cell.",
        "How do chloroplasts perform photosynthesis?",
        "What does the left ventricle do?",
        "Explain Newton's second law.",
        "Explain Ohm's law with an example.",
        "How does a DC motor work?",
        "What is the difference between an atom and a molecule?",
        "Explain the pH scale.",
        "Balance H2 + O2 -> H2O."
    ];

    return (
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: "520px", background: "rgba(15, 23, 42, 0.85)" }}>
            {/* Header Title */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-glass)", paddingBottom: "12px", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
                <div>
                    <h3 style={{ fontSize: "1.05rem", fontFamily: "var(--font-display)", display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaQuestionCircle style={{ color: "var(--accent-cyan)" }} /> Student Doubt Assistant
                    </h3>
                    <div style={{ fontSize: "0.74rem", color: "var(--accent-purple)", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                        <span>⚡ Local Knowledge Engine • Offline Active</span>
                    </div>
                </div>

                <button
                    className="tool-btn"
                    onClick={() => {
                        setIsMuted(!isMuted);
                        if (window.speechSynthesis) window.speechSynthesis.cancel();
                    }}
                    title={isMuted ? "Unmute AI Answer Voice" : "Mute AI Answer Voice"}
                >
                    {isMuted ? <FaVolumeMute style={{ color: "#ef4444" }} /> : <FaVolumeUp style={{ color: "#10b981" }} />}
                </button>
            </div>

            {/* Quick Suggested Question Pills */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px", maxHeight: "80px", overflowY: "auto" }}>
                {suggestedQuestions.map((q, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleSendQuestion(q)}
                        className="quick-fill-btn"
                        style={{ fontSize: "0.72rem", padding: "4px 8px" }}
                    >
                        💡 {q}
                    </button>
                ))}
            </div>

            {/* Messages Chat Box */}
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", paddingRight: "4px", marginBottom: "14px" }}>
                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                            maxWidth: "90%",
                            padding: "12px 16px",
                            borderRadius: "16px",
                            background: msg.sender === "user"
                                ? "linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))"
                                : "rgba(30, 41, 59, 0.75)",
                            border: msg.sender === "user"
                                ? "none"
                                : "1px solid var(--border-glass)",
                            color: "#ffffff"
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                            {msg.sender === "ai" ? (
                                <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--accent-cyan)", display: "flex", alignItems: "center", gap: "4px" }}>
                                    <FaRobot /> AI Study Assistant
                                </span>
                            ) : (
                                <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "rgba(255, 255, 255, 0.8)" }}>
                                    🎓 You
                                </span>
                            )}
                        </div>

                        <div style={{ fontSize: "0.88rem", lineHeight: "1.6" }}>
                            {msg.sender === "user" ? msg.text : <FormattedMessage text={msg.text} />}
                        </div>

                        {/* 3D Action Trigger Badge only if valid target */}
                        {msg.cue?.targetMesh && msg.cue.targetMesh !== "main" && (
                            <div style={{
                                marginTop: "8px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                fontSize: "0.72rem",
                                background: "rgba(0, 255, 204, 0.15)",
                                color: "#00ffcc",
                                padding: "3px 8px",
                                borderRadius: "8px",
                                border: "1px solid rgba(0, 255, 204, 0.3)"
                            }}>
                                <FaEye /> 3D Viewport Focused: {msg.cue.targetMesh}
                            </div>
                        )}
                    </motion.div>
                ))}

                {isLoading && (
                    <div style={{ alignSelf: "flex-start", padding: "10px 14px", borderRadius: "14px", background: "rgba(30, 41, 59, 0.7)", color: "var(--text-secondary)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaRobot className="animate-spin" /> Querying Local Knowledge Engine...
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSendQuestion();
                }}
                style={{ display: "flex", gap: "8px" }}
            >
                <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    style={{
                        background: isListening ? "#ef4444" : "rgba(255, 255, 255, 0.08)",
                        color: "#ffffff",
                        border: "1px solid var(--border-glass)",
                        borderRadius: "12px",
                        width: "42px",
                        height: "42px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                    }}
                    title={isListening ? "Stop Listening" : "Ask Question via Voice Mic"}
                >
                    {isListening ? <FaMicrophoneSlash /> : <FaMicrophone style={{ color: "var(--accent-cyan)" }} />}
                </button>

                <input
                    type="text"
                    placeholder="Ask any doubt in Biology, Physics, or Chemistry..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    style={{ flex: 1, borderRadius: "12px", height: "42px" }}
                />

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={!inputText.trim() || isLoading}
                    style={{ borderRadius: "12px", height: "42px", padding: "0 18px" }}
                >
                    <FaPaperPlane /> Ask
                </button>
            </form>
        </div>
    );
}

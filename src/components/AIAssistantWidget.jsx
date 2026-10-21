import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { askAssistant } from "../services/aiClient";
import {
    FaRobot,
    FaPaperPlane,
    FaSpinner,
    FaUser,
    FaVolumeUp,
    FaVolumeMute,
    FaCopy,
    FaCheck,
    FaBrain,
    FaHeart,
    FaEye,
    FaBone,
    FaQuestionCircle,
    FaTrashAlt,
    FaStethoscope,
    FaMicrophone,
    FaMicrophoneSlash,
    FaAtom,
    FaBolt,
    FaSeedling
} from "react-icons/fa";

import FormattedMessage, { stripFormattingForSpeech } from "./FormattedMessage";

export default function AIAssistantWidget({ initialQuestion = "", selectedPart = null, activeModel: propModel = "Heart" }) {
    const [question, setQuestion] = useState(initialQuestion);
    const [activeModel, setActiveModel] = useState(propModel);
    const [provider, setProvider] = useState("AI Tutor");
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "ai",
            text: "👋 **Welcome to the AI Assistant!**\n\nAsk about **Biology, Physics, and Chemistry**.\n\n• Ask ANY question (cells, photosynthesis, Newton's laws, Ohm's law, balancing equations).\n• Select any scientific model context above.\n• Click **`📝 Generate 3D Quiz`** or **`🩺 Clinical Case`** for lesson activities!"
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [activeMode] = useState("chat"); // "chat" | "quiz" | "case_study"
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (propModel) setActiveModel(propModel);
    }, [propModel]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const modelOptions = [
        { name: "Heart", icon: <FaHeart style={{ color: "var(--accent-rose)" }} /> },
        { name: "PlantCell", icon: <FaSeedling style={{ color: "#22c55e" }} /> },
        { name: "Brain", icon: <FaBrain style={{ color: "var(--accent-cyan)" }} /> },
        { name: "DCMotor", icon: <FaBolt style={{ color: "#f59e0b" }} /> },
        { name: "Atom", icon: <FaAtom style={{ color: "#a855f7" }} /> },
        { name: "Eye", icon: <FaEye style={{ color: "#38bdf8" }} /> },
        { name: "Skeleton", icon: <FaBone style={{ color: "#fbbf24" }} /> }
    ];

    const presetPrompts = {
        Heart: [
            "What does the left ventricle do?",
            "Explain cardiac blood flow through the 4 chambers.",
            "How do mitral and aortic valves prevent backflow?"
        ],
        PlantCell: [
            "Tell me about a cell.",
            "How do chloroplasts perform photosynthesis?",
            "What is the difference between plant and animal cells?"
        ],
        DCMotor: [
            "How does a DC motor work?",
            "Explain Newton's second law.",
            "Explain Ohm's law with an example."
        ],
        Atom: [
            "What is the difference between an atom and a molecule?",
            "Explain the pH scale.",
            "Balance H2 + O2 -> H2O."
        ],
        Brain: [
            "What are the main functions of the frontal lobe?",
            "Explain Broca's area vs Wernicke's area.",
            "How does the cerebellum coordinate balance?"
        ],
        Eye: [
            "How does the cornea and lens focus light on the retina?",
            "Explain photoreceptor function: Rods vs Cones.",
            "What causes glaucoma and optic nerve pressure?"
        ],
        Skeleton: [
            "Explain the structural divisions of the human spine (C1-L5).",
            "What is the difference between axial and appendicular skeleton?",
            "How do synovial joints facilitate movement?"
        ]
    };

    const toggleVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error("Web Speech Recognition not supported in this browser.", { icon: "🎙️" });
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
            toast("Listening... Speak now!", { icon: "🎙️" });
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setQuestion(transcript);
            setIsListening(false);
            handleSend(transcript);
        };

        recognition.onerror = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const handleSend = async (textToSend, modeOverride = "chat") => {
        const queryText = textToSend || question;
        if ((!queryText.trim() && modeOverride === "chat") || loading) return;

        const currentMode = modeOverride || activeMode;
        const displayQuery = modeOverride === "quiz"
            ? `📝 Generate 3D Anatomical Quiz for ${activeModel}`
            : modeOverride === "case_study"
                ? `🩺 Generate Clinical Case Study for ${activeModel}`
                : queryText;

        const userMsg = {
            id: Date.now(),
            sender: "user",
            text: displayQuery
        };

        setMessages((prev) => [...prev, userMsg]);
        setQuestion("");
        setLoading(true);

        try {
            const res = await askAssistant({
                question: queryText,
                messages,
                activeModel,
                selectedPart: selectedPart ? selectedPart.name : null,
                mode: currentMode,
                role: "teacher"
            });

            setProvider(res.provider);

            const aiMsg = {
                id: Date.now() + 1,
                sender: "ai",
                text: res.answer
            };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (error) {
            console.error("AI Error:", error);
            toast.error("Could not complete request.", { icon: "⚠️" });
        } finally {
            setLoading(false);
        }
    };

    const handleSpeak = (text) => {
        if (!window.speechSynthesis) {
            toast.error("Speech synthesis not supported in this browser.");
            return;
        }

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        window.speechSynthesis.cancel();
        const cleanText = stripFormattingForSpeech(text);
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
    };

    const handleCopy = (id, text) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success("Copied to clipboard!", { icon: "📋" });
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleClear = () => {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setMessages([
            {
                id: Date.now(),
                sender: "ai",
                text: "✨ Chat cleared. How can I help with your learning or lesson planning?"
            }
        ]);
        toast("Chat history reset", { icon: "🧹" });
    };

    return (
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: "560px", background: "rgba(10, 15, 28, 0.88)" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-glass)", paddingBottom: "12px", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
                <div>
                    <h3 style={{ fontSize: "1.1rem", fontFamily: "var(--font-display)", display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaRobot style={{ color: "var(--accent-cyan)" }} /> AI Educational Assistant
                    </h3>
                    <div style={{ fontSize: "0.74rem", color: "var(--accent-purple)", fontWeight: "600", marginTop: "2px" }}>
                        ⚡ {provider}
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                        className="tool-btn"
                        onClick={handleClear}
                        title="Clear Chat History"
                        style={{ padding: "6px 10px", fontSize: "0.75rem" }}
                    >
                        <FaTrashAlt /> Clear
                    </button>
                </div>
            </div>

            {/* Model & Mode Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {modelOptions.map((opt) => (
                        <button
                            key={opt.name}
                            onClick={() => setActiveModel(opt.name)}
                            style={{
                                background: activeModel === opt.name ? "rgba(6, 182, 212, 0.2)" : "rgba(255, 255, 255, 0.04)",
                                border: activeModel === opt.name ? "1.5px solid var(--accent-cyan)" : "1px solid var(--border-glass)",
                                color: activeModel === opt.name ? "#ffffff" : "var(--text-secondary)",
                                padding: "4px 10px",
                                borderRadius: "8px",
                                fontSize: "0.75rem",
                                fontWeight: "600",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                cursor: "pointer"
                            }}
                        >
                            {opt.icon} {opt.name}
                        </button>
                    ))}
                </div>

                <div style={{ display: "flex", gap: "6px" }}>
                    <button
                        onClick={() => handleSend("", "quiz")}
                        className="btn-primary"
                        style={{ padding: "5px 12px", fontSize: "0.76rem", borderRadius: "8px" }}
                        title="Generate Interactive 3D Quiz"
                    >
                        <FaQuestionCircle /> 3D Quiz
                    </button>
                    <button
                        onClick={() => handleSend("", "case_study")}
                        className="btn-emerald"
                        style={{ padding: "5px 12px", fontSize: "0.76rem", borderRadius: "8px" }}
                        title="Generate Clinical Case Study"
                    >
                        <FaStethoscope /> Case Study
                    </button>
                </div>
            </div>

            {/* Preset prompt pills */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px", maxHeight: "60px", overflowY: "auto" }}>
                {(presetPrompts[activeModel] || presetPrompts.Heart).map((p, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleSend(p)}
                        className="quick-fill-btn"
                        style={{ fontSize: "0.72rem", padding: "4px 8px" }}
                    >
                        💡 {p}
                    </button>
                ))}
            </div>

            {/* Messages Box */}
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", paddingRight: "4px", marginBottom: "14px" }}>
                {messages.map((msg) => {
                    const isUser = msg.sender === "user";
                    return (
                        <div
                            key={msg.id}
                            style={{
                                alignSelf: isUser ? "flex-end" : "flex-start",
                                maxWidth: "88%",
                                padding: "12px 16px",
                                borderRadius: "16px",
                                background: isUser
                                    ? "linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))"
                                    : "rgba(30, 41, 59, 0.8)",
                                border: isUser ? "none" : "1px solid var(--border-glass)",
                                color: "#ffffff",
                                fontSize: "0.88rem"
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                <span style={{ fontSize: "0.74rem", fontWeight: "700", color: isUser ? "#ffffff" : "var(--accent-cyan)", display: "flex", alignItems: "center", gap: "6px" }}>
                                    {isUser ? <FaUser /> : <FaRobot />} {isUser ? "You" : "AI Assistant"}
                                </span>

                                {!isUser && (
                                    <div style={{ display: "flex", gap: "6px" }}>
                                        <button
                                            onClick={() => handleSpeak(msg.text)}
                                            style={{ background: "none", border: "none", color: isSpeaking ? "#10b981" : "var(--text-muted)", cursor: "pointer", fontSize: "0.75rem" }}
                                            title="Listen to Explanation"
                                        >
                                            {isSpeaking ? <FaVolumeUp /> : <FaVolumeMute />}
                                        </button>
                                        <button
                                            onClick={() => handleCopy(msg.id, msg.text)}
                                            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.75rem" }}
                                            title="Copy Text"
                                        >
                                            {copiedId === msg.id ? <FaCheck style={{ color: "#10b981" }} /> : <FaCopy />}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {isUser ? msg.text : <FormattedMessage text={msg.text} />}
                        </div>
                    );
                })}

                {loading && (
                    <div style={{ alignSelf: "flex-start", padding: "10px 14px", borderRadius: "14px", background: "rgba(30, 41, 59, 0.8)", color: "var(--text-secondary)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaSpinner className="spin" style={{ color: "var(--accent-cyan)" }} /> Thinking...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                }}
                style={{ display: "flex", gap: "8px" }}
            >
                <button
                    type="button"
                    onClick={toggleVoiceInput}
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
                    title={isListening ? "Stop Voice Recognition" : "Speak question"}
                >
                    {isListening ? <FaMicrophoneSlash /> : <FaMicrophone style={{ color: "var(--accent-cyan)" }} />}
                </button>

                <input
                    type="text"
                    placeholder="Ask any question in Biology, Physics, or Chemistry..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    style={{ flex: 1, borderRadius: "12px", height: "42px" }}
                />

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={!question.trim() || loading}
                    style={{ borderRadius: "12px", height: "42px", padding: "0 18px" }}
                >
                    <FaPaperPlane /> Send
                </button>
            </form>
        </div>
    );
}
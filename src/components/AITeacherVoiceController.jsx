import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    FaPlay,
    FaPause,
    FaStepForward,
    FaStepBackward,
    FaVolumeUp,
    FaVolumeMute,
    FaSlidersH,
    FaRobot,
    FaCompass,
    FaLightbulb,
    FaSyncAlt,
    FaCheckCircle,
    FaMagic
} from "react-icons/fa";

export default function AITeacherVoiceController({
    chapter,
    activeStepIndex = 0,
    onStepChange,
    onExecuteCue
}) {
    const scriptCues = chapter?.scriptCues || [];
    const [currentStep, setCurrentStep] = useState(activeStepIndex);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [speechRate, setSpeechRate] = useState(1.0);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [autoAdvance, setAutoAdvance] = useState(true);

    const utteranceRef = useRef(null);

    // Fetch browser Web Speech API voices
    useEffect(() => {
        const loadVoices = () => {
            if (typeof window !== "undefined" && window.speechSynthesis) {
                const availVoices = window.speechSynthesis.getVoices();
                setVoices(availVoices);
                // Prefer English natural/female or default Google voice
                const preferred = availVoices.find(
                    (v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Female"))
                ) || availVoices.find((v) => v.lang.startsWith("en")) || availVoices[0];
                if (preferred) setSelectedVoice(preferred);
            }
        };

        loadVoices();
        if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    // Sync active step changes
    useEffect(() => {
        if (activeStepIndex !== undefined && activeStepIndex !== currentStep) {
            setCurrentStep(activeStepIndex);
        }
    }, [activeStepIndex]);

    // Whenever currentStep changes, trigger the 3D action cue!
    useEffect(() => {
        if (scriptCues[currentStep]) {
            const cue = scriptCues[currentStep];
            if (onExecuteCue) onExecuteCue(cue);
            if (onStepChange) onStepChange(currentStep);

            if (isPlaying) {
                speakStep(cue);
            }
        }
    }, [currentStep]);

    // Synthesize Speech for a given step cue
    const speakStep = (cue) => {
        if (typeof window === "undefined" || !window.speechSynthesis) return;

        window.speechSynthesis.cancel(); // Stop ongoing speech

        if (isMuted || !cue?.speech) return;

        const utterance = new SpeechSynthesisUtterance(cue.speech);
        utterance.rate = speechRate;
        utterance.pitch = 1.05;
        if (selectedVoice) utterance.voice = selectedVoice;

        utterance.onstart = () => {
            setIsPlaying(true);
        };

        utterance.onend = () => {
            setIsPlaying(false);
            // Auto-advance to next step when speech completes if enabled
            if (autoAdvance && currentStep < scriptCues.length - 1) {
                setTimeout(() => {
                    setCurrentStep((prev) => prev + 1);
                }, 800);
            }
        };

        utterance.onerror = (err) => {
            console.warn("Speech synthesis notice:", err);
            setIsPlaying(false);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            setIsPlaying(false);
            toast("AI Teacher Paused", { icon: "⏸️" });
        } else {
            setIsPlaying(true);
            const cue = scriptCues[currentStep];
            if (cue) speakStep(cue);
            toast.success("AI Teacher Narration Started", { icon: "🎙️" });
        }
    };

    const handleNext = () => {
        if (currentStep < scriptCues.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            toast("Reached end of lesson script!", { icon: "🎉" });
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleStepJump = (idx) => {
        setCurrentStep(idx);
        setIsPlaying(true);
    };

    const activeCue = scriptCues[currentStep] || scriptCues[0];

    return (
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "16px", background: "rgba(15, 23, 42, 0.85)" }}>
            {/* AI Avatar Header Section */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-glass)", paddingBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {/* Animated Holographic Avatar */}
                    <div style={{
                        position: "relative",
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 0 20px rgba(6, 182, 212, 0.4)"
                    }}>
                        <FaRobot style={{ fontSize: "1.4rem", color: "#ffffff" }} />
                        {isPlaying && (
                            <span style={{
                                position: "absolute",
                                bottom: "-2px",
                                right: "-2px",
                                width: "14px",
                                height: "14px",
                                borderRadius: "50%",
                                background: "#10b981",
                                border: "2px solid #0f172a"
                            }} className="animate-pulse" />
                        )}
                    </div>

                    <div>
                        <h3 style={{ fontSize: "1.05rem", fontFamily: "var(--font-display)", display: "flex", alignItems: "center", gap: "6px" }}>
                            AI Teacher Avatar <FaMagic style={{ color: "var(--accent-cyan)", fontSize: "0.85rem" }} />
                        </h3>
                        <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                            {isPlaying ? "🎙️ Speaking & Animating 3D Model..." : "⏸️ Paused - Ready for student interaction"}
                        </p>
                    </div>
                </div>

                {/* Audio Wave Visualizer Bars */}
                {isPlaying && (
                    <div style={{ display: "flex", alignItems: "center", gap: "3px", height: "20px" }}>
                        <span className="wave-bar" style={{ animationDelay: "0ms" }} />
                        <span className="wave-bar" style={{ animationDelay: "150ms" }} />
                        <span className="wave-bar" style={{ animationDelay: "300ms" }} />
                        <span className="wave-bar" style={{ animationDelay: "450ms" }} />
                    </div>
                )}
            </div>

            {/* Active Speech Script Speech Bubble */}
            <div style={{
                background: "rgba(6, 182, 212, 0.08)",
                border: "1px solid rgba(6, 182, 212, 0.25)",
                borderRadius: "14px",
                padding: "16px",
                position: "relative"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--accent-cyan)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Step {currentStep + 1} of {scriptCues.length}: {activeCue?.title}
                    </span>
                    {activeCue?.action?.targetMesh && (
                        <span style={{
                            fontSize: "0.72rem",
                            background: "rgba(16, 185, 129, 0.2)",
                            color: "#10b981",
                            padding: "2px 8px",
                            borderRadius: "10px",
                            border: "1px solid rgba(16, 185, 129, 0.3)"
                        }}>
                            Target: {activeCue.action.targetMesh}
                        </span>
                    )}
                </div>

                <p style={{ fontSize: "0.92rem", color: "#f8fafc", lineHeight: "1.6" }}>
                    "{activeCue?.speech}"
                </p>
            </div>

            {/* Timeline & Player Controls */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* Progress Bar */}
                <div style={{ width: "100%", height: "6px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{
                        width: `${((currentStep + 1) / scriptCues.length) * 100}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))",
                        transition: "width 0.3s ease"
                    }} />
                </div>

                {/* Control Buttons Bar */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button
                            className="tool-btn"
                            onClick={handlePrev}
                            disabled={currentStep === 0}
                            style={{ padding: "8px 12px" }}
                        >
                            <FaStepBackward /> Prev
                        </button>

                        <button
                            className="btn-primary"
                            onClick={handlePlayPause}
                            style={{ padding: "8px 18px", borderRadius: "10px" }}
                        >
                            {isPlaying ? <><FaPause /> Pause</> : <><FaPlay /> Play Narration</>}
                        </button>

                        <button
                            className="tool-btn"
                            onClick={handleNext}
                            disabled={currentStep === scriptCues.length - 1}
                            style={{ padding: "8px 12px" }}
                        >
                            Next <FaStepForward />
                        </button>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {/* Speed Control Selector */}
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Speed:</span>
                            {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                                <button
                                    key={rate}
                                    onClick={() => setSpeechRate(rate)}
                                    style={{
                                        background: speechRate === rate ? "var(--accent-cyan)" : "rgba(255, 255, 255, 0.06)",
                                        color: speechRate === rate ? "#ffffff" : "var(--text-secondary)",
                                        border: "none",
                                        borderRadius: "6px",
                                        fontSize: "0.72rem",
                                        padding: "3px 7px",
                                        cursor: "pointer"
                                    }}
                                >
                                    {rate}x
                                </button>
                            ))}
                        </div>

                        {/* Mute Button */}
                        <button
                            className="tool-btn"
                            onClick={() => {
                                setIsMuted(!isMuted);
                                if (window.speechSynthesis) window.speechSynthesis.cancel();
                            }}
                            title={isMuted ? "Unmute Voice" : "Mute Voice"}
                        >
                            {isMuted ? <FaVolumeMute style={{ color: "#ef4444" }} /> : <FaVolumeUp style={{ color: "#10b981" }} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Interactive Lesson Script Transcript Accordion */}
            <div style={{ marginTop: "4px" }}>
                <h4 style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Interactive Lesson Transcript (Click line to jump):
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "180px", overflowY: "auto", paddingRight: "4px" }}>
                    {scriptCues.map((cue, idx) => {
                        const isActive = idx === currentStep;
                        return (
                            <div
                                key={idx}
                                onClick={() => handleStepJump(idx)}
                                style={{
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    background: isActive ? "rgba(6, 182, 212, 0.15)" : "rgba(255, 255, 255, 0.03)",
                                    border: isActive ? "1px solid var(--accent-cyan)" : "1px solid transparent",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <div>
                                    <span style={{ fontSize: "0.8rem", fontWeight: "700", color: isActive ? "var(--accent-cyan)" : "#ffffff" }}>
                                        {idx + 1}. {cue.title}
                                    </span>
                                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px", lineClamp: 1, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                        {cue.speech}
                                    </p>
                                </div>
                                {isActive && <FaCheckCircle style={{ color: "var(--accent-cyan)", fontSize: "0.85rem" }} />}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaBroadcastTower } from "react-icons/fa";

export default function WebRTCVoiceCall({ role = "student", roomId = "med-101" }) {
    const [isMuted, setIsMuted] = useState(true);
    const [mediaStream, setMediaStream] = useState(null);
    const [connecting, setConnecting] = useState(false);

    const toggleMic = async () => {
        if (isMuted) {
            try {
                setConnecting(true);
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                setMediaStream(stream);
                setIsMuted(false);
                toast.success(`🎙️ Voice Microphone ON in Room ${roomId}`, { icon: "🔊" });
            } catch (err) {
                console.warn("Microphone access notice:", err.message);
                toast.error("Microphone permission denied or device unavailable.");
            } finally {
                setConnecting(false);
            }
        } else {
            if (mediaStream) {
                mediaStream.getTracks().forEach((track) => track.stop());
            }
            setMediaStream(null);
            setIsMuted(true);
            toast("Microphone Muted", { icon: "🔇" });
        }
    };

    useEffect(() => {
        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [mediaStream]);

    return (
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <button
                type="button"
                onClick={toggleMic}
                disabled={connecting}
                style={{
                    background: !isMuted ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.08)",
                    border: `1px solid ${!isMuted ? "#10b981" : "rgba(255, 255, 255, 0.15)"}`,
                    color: !isMuted ? "#10b981" : "var(--text-secondary)",
                    padding: "6px 12px",
                    borderRadius: "10px",
                    fontSize: "0.8rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.2s ease"
                }}
                title={isMuted ? "Unmute Voice Mic" : "Mute Voice Mic"}
            >
                {!isMuted ? <FaMicrophone style={{ color: "#10b981" }} /> : <FaMicrophoneSlash />}
                <span>{!isMuted ? "Mic Live" : "Mic Off"}</span>
            </button>
        </div>
    );
}

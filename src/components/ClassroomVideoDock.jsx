import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLiveKitRoom } from "../hooks/useLiveKitRoom";
import {
    FaMicrophone,
    FaMicrophoneSlash,
    FaVideo,
    FaVideoSlash,
    FaPhoneSlash,
    FaUsers,
    FaChevronDown,
    FaChevronUp,
    FaExclamationTriangle,
    FaCheckCircle,
    FaBroadcastTower,
    FaUserGraduate,
    FaChalkboardTeacher
} from "react-icons/fa";

/**
 * Single Participant Video/Audio Tile
 */
function ParticipantTile({
    name,
    role = "student",
    isLocal = false,
    isSpeaking = false,
    isMicMuted = false,
    isCameraMuted = false,
    videoTrack = null,
    audioTrack = null
}) {
    const videoRef = useRef(null);
    const audioRef = useRef(null);

    // Attach video track to DOM video element
    useEffect(() => {
        const videoEl = videoRef.current;
        if (videoTrack && !isCameraMuted && videoEl) {
            videoTrack.attach(videoEl);
            return () => {
                try {
                    videoTrack.detach(videoEl);
                } catch {
                    // ignore
                }
                if (videoEl) {
                    videoEl.srcObject = null;
                }
            };
        } else if (videoEl) {
            videoEl.srcObject = null;
        }
    }, [videoTrack, isCameraMuted]);

    // Attach remote audio track to DOM audio element (Local audio is never attached to prevent feedback)
    useEffect(() => {
        const audioEl = audioRef.current;
        if (!isLocal && audioTrack && audioEl) {
            audioTrack.attach(audioEl);
            return () => {
                try {
                    audioTrack.detach(audioEl);
                } catch {
                    // ignore
                }
                if (audioEl) {
                    audioEl.srcObject = null;
                }
            };
        } else if (audioEl) {
            audioEl.srcObject = null;
        }
    }, [audioTrack, isLocal]);

    // Ensure DOM media elements release srcObject when ParticipantTile unmounts
    useEffect(() => {
        const videoEl = videoRef.current;
        const audioEl = audioRef.current;
        return () => {
            if (videoEl) videoEl.srcObject = null;
            if (audioEl) audioEl.srcObject = null;
        };
    }, []);

    const isTeacher = role === "teacher";
    const initials = (name || "U")
        .split(" ")
        .map(n => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 10",
                minWidth: "160px",
                maxWidth: "240px",
                borderRadius: "12px",
                overflow: "hidden",
                background: "rgba(10, 15, 30, 0.95)",
                border: isSpeaking
                    ? "2px solid #00ffcc"
                    : isTeacher
                        ? "1px solid rgba(16, 185, 129, 0.5)"
                        : "1px solid rgba(255, 255, 255, 0.12)",
                boxShadow: isSpeaking ? "0 0 15px rgba(0, 255, 204, 0.4)" : "0 4px 12px rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
            }}
        >
            {/* Hidden audio element for remote participants */}
            {!isLocal && <audio ref={audioRef} autoPlay />}

            {/* Live Video Feed */}
            {videoTrack && !isCameraMuted ? (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={isLocal}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transform: isLocal ? "scaleX(-1)" : "none"
                    }}
                />
            ) : (
                /* Avatar Placeholder when camera is off */
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                    }}
                >
                    <div
                        style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            background: isTeacher
                                ? "linear-gradient(135deg, #10b981, #06b6d4)"
                                : "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#ffffff",
                            fontSize: "1.1rem",
                            fontWeight: "800",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
                        }}
                    >
                        {initials}
                    </div>
                    <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <FaVideoSlash /> Camera Off
                    </span>
                </div>
            )}

            {/* Bottom Status Overlay Bar */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "6px 8px",
                    background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "0.74rem"
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "5px", overflow: "hidden" }}>
                    <span
                        style={{
                            color: isTeacher ? "#10b981" : "#ffffff",
                            fontWeight: "700",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            maxWidth: "110px"
                        }}
                    >
                        {name} {isLocal && "(You)"}
                    </span>
                    {isTeacher && (
                        <span
                            style={{
                                background: "rgba(16, 185, 129, 0.25)",
                                border: "1px solid #10b981",
                                color: "#10b981",
                                fontSize: "0.62rem",
                                fontWeight: "800",
                                padding: "1px 5px",
                                borderRadius: "4px"
                            }}
                        >
                            HOST
                        </span>
                    )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {isMicMuted ? (
                        <FaMicrophoneSlash style={{ color: "#f43f5e" }} title="Microphone muted" />
                    ) : (
                        <FaMicrophone style={{ color: isSpeaking ? "#00ffcc" : "#10b981" }} title="Microphone active" />
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * ClassroomVideoDock — Collapsible Audio/Video Live Session Bar
 */
export default function ClassroomVideoDock({
    roomId,
    isActive = false,
    isTeacher = false,
    authToken = null,
    onLeave
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const {
        status,
        errorMessage,
        errorCode,
        serverParticipant,
        isMicEnabled,
        isCameraEnabled,
        deviceWarning,
        localVideoTrack,
        remoteParticipants,
        activeSpeakers,
        toggleMicrophone,
        toggleCamera,
        leaveRoom
    } = useLiveKitRoom({
        roomId,
        enabled: isActive,
        authToken,
        onDisconnected: onLeave
    });

    if (!isActive) return null;

    const totalParticipants = 1 + remoteParticipants.length; // Local + Remotes

    return (
        <div
            className="glass-card"
            style={{
                background: "rgba(15, 23, 42, 0.88)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "16px",
                padding: isCollapsed ? "12px 18px" : "16px 20px",
                marginBottom: "16px",
                transition: "all 0.3s ease",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.45)"
            }}
        >
            {/* Header / Summary Bar */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px"
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                        style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "10px",
                            background: status === "connected"
                                ? "rgba(16, 185, 129, 0.18)"
                                : "rgba(6, 182, 212, 0.18)",
                            border: `1px solid ${status === "connected" ? "#10b981" : "#06b6d4"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: status === "connected" ? "#10b981" : "#06b6d4",
                            fontSize: "1.1rem"
                        }}
                    >
                        {isTeacher ? <FaChalkboardTeacher /> : <FaUserGraduate />}
                    </div>

                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "#ffffff", margin: 0 }}>
                                Live Spatial Audio/Video Studio
                            </h4>
                            <span
                                style={{
                                    fontSize: "0.72rem",
                                    padding: "2px 8px",
                                    borderRadius: "8px",
                                    fontWeight: "800",
                                    background: status === "connected"
                                        ? "rgba(16, 185, 129, 0.2)"
                                        : status === "error"
                                            ? "rgba(244, 63, 94, 0.2)"
                                            : "rgba(6, 182, 212, 0.2)",
                                    color: status === "connected"
                                        ? "#10b981"
                                        : status === "error"
                                            ? "#f43f5e"
                                            : "#06b6d4",
                                    border: `1px solid ${status === "connected" ? "rgba(16, 185, 129, 0.4)" : status === "error" ? "rgba(244, 63, 94, 0.4)" : "rgba(6, 182, 212, 0.4)"}`
                                }}
                            >
                                {status === "connected" && "● CONNECTED"}
                                {status === "connecting" && "CONNECTING..."}
                                {status === "requesting-token" && "AUTHENTICATING..."}
                                {status === "reconnecting" && "RECONNECTING..."}
                                {status === "error" && (errorCode === 503 ? "RTC STANDBY" : "ERROR")}
                                {status === "disconnected" && "OFFLINE"}
                            </span>
                        </div>

                        <p style={{ color: "var(--text-secondary)", fontSize: "0.78rem", margin: "2px 0 0 0" }}>
                            Room: <strong style={{ color: "var(--accent-cyan)" }}>{roomId}</strong> • {totalParticipants} {totalParticipants === 1 ? "participant" : "participants"} in call
                        </p>
                    </div>
                </div>

                {/* Right Controls Group */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {/* Mic Toggle Button */}
                    <button
                        onClick={toggleMicrophone}
                        disabled={status !== "connected"}
                        title={isMicEnabled ? "Mute Microphone" : "Unmute Microphone"}
                        style={{
                            background: isMicEnabled ? "rgba(16, 185, 129, 0.2)" : "rgba(244, 63, 94, 0.2)",
                            border: `1px solid ${isMicEnabled ? "#10b981" : "#f43f5e"}`,
                            color: isMicEnabled ? "#10b981" : "#f43f5e",
                            padding: "8px 12px",
                            borderRadius: "10px",
                            cursor: status === "connected" ? "pointer" : "not-allowed",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "0.82rem",
                            fontWeight: "700"
                        }}
                    >
                        {isMicEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
                        {isMicEnabled ? "Mic On" : "Muted"}
                    </button>

                    {/* Camera Toggle Button */}
                    <button
                        onClick={toggleCamera}
                        disabled={status !== "connected"}
                        title={isCameraEnabled ? "Turn Camera Off" : "Turn Camera On"}
                        style={{
                            background: isCameraEnabled ? "rgba(6, 182, 212, 0.2)" : "rgba(100, 116, 139, 0.2)",
                            border: `1px solid ${isCameraEnabled ? "#06b6d4" : "rgba(255,255,255,0.2)"}`,
                            color: isCameraEnabled ? "#06b6d4" : "#94a3b8",
                            padding: "8px 12px",
                            borderRadius: "10px",
                            cursor: status === "connected" ? "pointer" : "not-allowed",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "0.82rem",
                            fontWeight: "700"
                        }}
                    >
                        {isCameraEnabled ? <FaVideo /> : <FaVideoSlash />}
                        {isCameraEnabled ? "Camera" : "No Video"}
                    </button>

                    {/* Collapse / Expand Toggle */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        style={{
                            background: "rgba(255, 255, 255, 0.08)",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                            color: "var(--text-secondary)",
                            padding: "8px 10px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontSize: "0.85rem"
                        }}
                        title={isCollapsed ? "Expand Video Tiles" : "Collapse Video Tiles"}
                    >
                        {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                    </button>

                    {/* Leave Call Button */}
                    {onLeave && (
                        <button
                            onClick={async () => {
                                await leaveRoom();
                                onLeave();
                            }}
                            style={{
                                background: "rgba(244, 63, 94, 0.2)",
                                border: "1px solid rgba(244, 63, 94, 0.4)",
                                color: "#f43f5e",
                                padding: "8px 14px",
                                borderRadius: "10px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                fontSize: "0.82rem",
                                fontWeight: "700"
                            }}
                        >
                            <FaPhoneSlash /> Leave
                        </button>
                    )}
                </div>
            </div>

            {/* Device Warning Notice */}
            {deviceWarning && (
                <div
                    style={{
                        marginTop: "10px",
                        padding: "8px 12px",
                        background: "rgba(245, 158, 11, 0.15)",
                        border: "1px solid rgba(245, 158, 11, 0.4)",
                        borderRadius: "8px",
                        fontSize: "0.78rem",
                        color: "#fbbf24",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}
                >
                    <FaExclamationTriangle /> {deviceWarning}
                </div>
            )}

            {/* Standby / Error Notice (e.g. 503 credentials not configured) */}
            {errorMessage && (
                <div
                    style={{
                        marginTop: "10px",
                        padding: "10px 14px",
                        background: errorCode === 503 ? "rgba(6, 182, 212, 0.08)" : "rgba(244, 63, 94, 0.12)",
                        border: `1px solid ${errorCode === 503 ? "rgba(6, 182, 212, 0.3)" : "rgba(244, 63, 94, 0.4)"}`,
                        borderRadius: "10px",
                        fontSize: "0.82rem",
                        color: errorCode === 503 ? "#38bdf8" : "#fca5a5",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                    }}
                >
                    <FaBroadcastTower />
                    <div>
                        <strong style={{ display: "block" }}>
                            {errorCode === 503 ? "LiveKit RTC Service in Standby Mode" : "RTC Session Notice"}
                        </strong>
                        <span style={{ fontSize: "0.76rem", opacity: 0.9 }}>
                            {errorMessage}
                            {errorCode === 503 && " (3D spatial models and Socket.IO interaction remain 100% active)."}
                        </span>
                    </div>
                </div>
            )}

            {/* Expanded Video Grid */}
            <AnimatePresence>
                {!isCollapsed && status !== "error" && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{
                            marginTop: "14px",
                            display: "flex",
                            gap: "12px",
                            overflowX: "auto",
                            paddingBottom: "6px"
                        }}
                    >
                        {/* 1. Local Participant Tile */}
                        <ParticipantTile
                            name={serverParticipant?.name || (isTeacher ? "Teacher" : "Student")}
                            role={serverParticipant?.role || (isTeacher ? "teacher" : "student")}
                            isLocal={true}
                            isSpeaking={Boolean(serverParticipant?.identity && activeSpeakers.includes(serverParticipant.identity))}
                            isMicMuted={!isMicEnabled}
                            isCameraMuted={!isCameraEnabled}
                            videoTrack={localVideoTrack}
                            audioTrack={null}
                        />

                        {/* 2. Remote Participant Tiles (5–10 peers) */}
                        {remoteParticipants.map((p) => (
                            <ParticipantTile
                                key={p.identity}
                                name={p.name}
                                role={p.role}
                                isLocal={false}
                                isSpeaking={activeSpeakers.includes(p.identity)}
                                isMicMuted={p.isAudioMuted}
                                isCameraMuted={p.isVideoMuted}
                                videoTrack={p.videoTrack}
                                audioTrack={p.audioTrack}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

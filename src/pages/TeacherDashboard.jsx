import { useState, useEffect, useContext, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import TeacherLayout from "../layouts/TeacherLayout";
import AnatomyCanvas from "../three/AnatomyCanvas";
import ChapterManager from "../components/ChapterManager";
import AIAssistantWidget from "../components/AIAssistantWidget";
import DiagramConverter2D3D from "../components/DiagramConverter2D3D";
import QuizManager from "../components/QuizManager";
import ClassroomVideoDock from "../components/ClassroomVideoDock";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";
import { API_URL, SOCKET_URL } from "../config/api";
import {
    FaBroadcastTower,
    FaUsers,
    FaCube,
    FaBook,
    FaRobot,
    FaCheckCircle,
    FaUserGraduate,
    FaCopy,
    FaUserPlus,
    FaSlidersH,
    FaPlay,
    FaChartLine,
    FaMagic,
    FaClock,
    FaSyncAlt,
    FaEye,
    FaChevronRight,
    FaShieldAlt,
    FaDna
} from "react-icons/fa";

function TeacherDashboard() {
    const navigate = useNavigate();
    const { user, token } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("overview");

    // Socket.IO Classroom Sync State
    const [socket, setSocket] = useState(null);
    const [roomId, setRoomId] = useState("med-101");
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [connectedStudents, setConnectedStudents] = useState([]);
    const [broadcastTime, setBroadcastTime] = useState(0);
    const [showEndModal, setShowEndModal] = useState(false);
    const isEndingSessionRef = useRef(false);

    // Live Broadcast timer
    useEffect(() => {
        let interval;
        if (isBroadcasting) {
            interval = setInterval(() => setBroadcastTime((t) => t + 1), 1000);
        } else {
            setBroadcastTime(0);
        }
        return () => clearInterval(interval);
    }, [isBroadcasting]);

    // Socket connection
    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on("room-participants", (data) => {
            console.log("👥 Room participants updated:", data);
            const targetRoomId = data.roomId || data.room?.roomId;
            if (targetRoomId && targetRoomId !== roomId) {
                return;
            }
            if (data.room && Array.isArray(data.room.students)) {
                const formatted = data.room.students.map((st, idx) => ({
                    user: st.user || { name: `Student ${idx + 1}` },
                    latency: `${12 + (idx % 4) * 3}ms`,
                    status: "Active",
                    socketId: st.socketId
                }));
                setConnectedStudents(formatted);
            } else {
                setConnectedStudents([]);
            }
        });

        return () => {
            newSocket.off("room-participants");
            newSocket.close();
        };
    }, [roomId]);

    const stopBroadcast = useCallback(async () => {
        if (isEndingSessionRef.current) return;
        isEndingSessionRef.current = true;
        isBroadcastingRef.current = false;

        try {
            setIsBroadcasting(false);
            setConnectedStudents([]);

            // 1. Send authenticated host-only request to end active classroom session in DB & LiveKit
            try {
                const tokenToUse = token || localStorage.getItem("ai_spatial_token");
                if (tokenToUse) {
                    await fetch(`${API_URL}/api/rtc/end-session`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${tokenToUse}`
                        },
                        body: JSON.stringify({ roomId })
                    });
                }
            } catch (err) {
                console.warn("Notice ending session via API:", err.message);
            }

            // 2. Also notify via socket if connected
            if (socket) {
                socket.emit("teacher-end-session", { roomId });
                socket.emit("leave-room", { roomId });
            }

            toast("Broadcast ended and classroom session closed.", { icon: "🛑" });
        } finally {
            isEndingSessionRef.current = false;
        }
    }, [socket, roomId, token]);

    // Safety unmount and beforeunload lifecycle cleanup for active broadcast
    const isBroadcastingRef = useRef(isBroadcasting);
    isBroadcastingRef.current = isBroadcasting;
    const stopBroadcastRef = useRef(stopBroadcast);
    stopBroadcastRef.current = stopBroadcast;

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (isBroadcastingRef.current) {
                stopBroadcastRef.current();
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            if (isBroadcastingRef.current) {
                stopBroadcastRef.current();
            }
        };
    }, []);

    const toggleBroadcast = useCallback(() => {
        if (!isBroadcasting) {
            if (socket) {
                socket.emit("join-room", {
                    roomId,
                    user: { name: user?.name || "Dr. Sarah Mitchell", role: "teacher" }
                });
                socket.emit("teacher-spatial-control", {
                    roomId,
                    model: "Heart",
                    explode: 0,
                    slice: false,
                    wireframe: false,
                    showLabels: false,
                    activePart: null,
                    hoveredPart: null,
                    cameraPosition: [0, 0, 4.5],
                    cameraTarget: [0, 0, 0]
                });
            }
            setIsBroadcasting(true);
            toast.success(`📡 Live broadcast started for Room: ${roomId}!`, {
                icon: "🎥",
                duration: 3500
            });
        } else {
            // Trigger confirmation dialog before ending active broadcast
            setShowEndModal(true);
        }
    }, [isBroadcasting, socket, roomId, user]);

    const handleBroadcastControl = (spatialData) => {
        if (socket && isBroadcasting) {
            socket.emit("teacher-spatial-control", {
                roomId,
                ...spatialData
            });
        }
    };

    const handleCopyRoomCode = () => {
        navigator.clipboard.writeText(roomId);
        toast.success(`Copied room code "${roomId}" to clipboard!`, { icon: "📋" });
    };

    const handleAddMockStudent = () => {
        const mockNames = ["David Miller", "Sophie Zhang", "Marcus Vance", "Aria Patel"];
        const nextName = mockNames[connectedStudents.length % mockNames.length];
        const newStudent = {
            user: { name: nextName, role: "student" },
            latency: `${Math.floor(10 + Math.random() * 15)}ms`,
            status: "Active"
        };
        setConnectedStudents([...connectedStudents, newStudent]);
        toast.success(`Joined ${nextName} to Room ${roomId}!`, { icon: "🎓" });
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <TeacherLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            {/* Header Title Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px", flexWrap: "wrap", gap: "16px" }}>
                <div>
                    <h1 style={{ fontSize: "1.8rem", fontFamily: "var(--font-display)", fontWeight: "800", display: "flex", alignItems: "center", gap: "10px", letterSpacing: "-0.5px" }}>
                        👩‍🏫 Teacher Spatial Command Studio
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.86rem", marginTop: "4px" }}>
                        Broadcast real-time 3D spatial models to student viewports, manage chapters, and track classroom sync.
                    </p>
                </div>

                {/* Top Control Toolbar */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            background: "rgba(10, 15, 30, 0.8)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            padding: "6px 14px",
                            borderRadius: "12px",
                            backdropFilter: "blur(14px)"
                        }}
                    >
                        <span style={{ fontSize: "0.76rem", color: "var(--text-muted)", fontWeight: "600" }}>Room Code:</span>
                        <input
                            type="text"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            style={{
                                background: "transparent",
                                border: "none",
                                color: "var(--accent-cyan)",
                                fontWeight: "800",
                                width: "85px",
                                textAlign: "center",
                                fontSize: "0.95rem"
                            }}
                            disabled={isBroadcasting}
                        />
                        <button
                            type="button"
                            onClick={handleCopyRoomCode}
                            style={{
                                background: "transparent",
                                border: "none",
                                color: "var(--text-muted)",
                                cursor: "pointer",
                                fontSize: "0.88rem",
                                display: "flex",
                                alignItems: "center"
                            }}
                            title="Copy Room Code"
                        >
                            <FaCopy />
                        </button>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={isBroadcasting ? "btn-emerald" : "btn-primary"}
                        onClick={toggleBroadcast}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "9px 18px",
                            borderRadius: "12px",
                            fontWeight: "700",
                            fontSize: "0.88rem"
                        }}
                    >
                        <FaBroadcastTower className={isBroadcasting ? "pulse" : ""} />
                        {isBroadcasting ? `Live (${formatTime(broadcastTime)}) • End` : "Start Live Broadcast"}
                    </motion.button>
                </div>
            </div>

            {/* Persistent Live Classroom Video Dock during Broadcast */}
            {isBroadcasting && (
                <div style={{ marginBottom: "20px" }}>
                    <ClassroomVideoDock
                        roomId={roomId}
                        isActive={isBroadcasting}
                        isTeacher={true}
                        authToken={token}
                    />
                </div>
            )}

            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                    {/* Live Broadcast Status Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card"
                        style={{
                            display: "flex",
                            justify: "space-between",
                            alignItems: "center",
                            borderLeft: isBroadcasting ? "4px solid var(--accent-emerald)" : "4px solid var(--accent-cyan)",
                            padding: "24px 28px",
                            position: "relative",
                            overflow: "hidden"
                        }}
                    >
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                <span style={{
                                    fontSize: "0.75rem",
                                    color: isBroadcasting ? "var(--accent-emerald)" : "var(--accent-cyan)",
                                    fontWeight: "800",
                                    textTransform: "uppercase",
                                    letterSpacing: "1.2px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px"
                                }}>
                                    <FaBroadcastTower className={isBroadcasting ? "pulse" : ""} />
                                    {isBroadcasting ? "● Live Spatial Broadcast Active" : "Classroom Broadcast Standby"}
                                </span>
                            </div>
                            <h3 style={{ fontSize: "1.35rem", fontFamily: "var(--font-display)", fontWeight: "700" }}>
                                {isBroadcasting ? `Broadcasting 3D Lesson to Room: ${roomId}` : `Ready to Stream Spatial Lecture in Room ${roomId}`}
                            </h3>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginTop: "4px", maxWidth: "700px" }}>
                                {isBroadcasting
                                    ? `Currently streaming 3D mesh coordinates and camera transforms to ${connectedStudents.length} connected student viewports.`
                                    : "Click 'Start Live Broadcast' above or open the 3D Studio Canvas to stream real-time spatial transformations to students."}
                            </p>
                        </div>

                        <div style={{ display: "flex", gap: "10px" }}>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                className="btn-primary"
                                onClick={() => setActiveTab("spatial")}
                                style={{ padding: "12px 20px", borderRadius: "12px", gap: "8px" }}
                            >
                                <FaCube /> Launch 3D Studio
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Interactive Real-Time Performance & Stat Counters */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "16px" }}>
                        {[
                            {
                                label: "Active Students Online",
                                value: connectedStudents.length,
                                subtext: `Connected to ${roomId}`,
                                icon: <FaUsers style={{ color: "var(--accent-cyan)" }} />,
                                color: "var(--accent-cyan)",
                                action: handleAddMockStudent,
                                actionLabel: "+ Simulate Join"
                            },
                            {
                                label: "Broadcast Duration",
                                value: isBroadcasting ? formatTime(broadcastTime) : "00:00",
                                subtext: isBroadcasting ? "Live Streaming" : "Inactive",
                                icon: <FaClock style={{ color: "var(--accent-emerald)" }} />,
                                color: "var(--accent-emerald)",
                                action: toggleBroadcast,
                                actionLabel: isBroadcasting ? "Stop" : "Start"
                            },
                            {
                                label: "Offline Chapters",
                                value: "4 Modules",
                                subtext: "Extracted for Readers",
                                icon: <FaBook style={{ color: "var(--accent-purple)" }} />,
                                color: "var(--accent-purple)",
                                action: () => setActiveTab("chapters"),
                                actionLabel: "Manage"
                            },
                            {
                                label: "AI Spatial Assistant",
                                value: "Local Engine",
                                subtext: "Offline Knowledge Active",
                                icon: <FaRobot style={{ color: "var(--accent-blue)" }} />,
                                color: "var(--accent-blue)",
                                action: () => setActiveTab("ai-assistant"),
                                actionLabel: "Open AI"
                            }
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -3 }}
                                className="glass-card"
                                style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div>
                                        <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: "500" }}>
                                            {stat.label}
                                        </span>
                                        <h3 style={{ fontSize: "1.6rem", fontWeight: "800", marginTop: "4px", color: "#ffffff" }}>
                                            {stat.value}
                                        </h3>
                                    </div>
                                    <div style={{ padding: "10px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                        {stat.icon}
                                    </div>
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{stat.subtext}</span>
                                    <button
                                        onClick={stat.action}
                                        style={{
                                            background: "rgba(255, 255, 255, 0.08)",
                                            border: "1px solid rgba(255, 255, 255, 0.12)",
                                            color: stat.color,
                                            fontSize: "0.72rem",
                                            fontWeight: "700",
                                            padding: "4px 10px",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            transition: "all 0.2s"
                                        }}
                                    >
                                        {stat.actionLabel}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Interactive 3D Quick-Inspector Viewport Widget */}
                    <div className="glass-card" style={{ padding: "24px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                            <div>
                                <h3 style={{ fontSize: "1.2rem", fontFamily: "var(--font-display)", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <FaCube style={{ color: "var(--accent-cyan)" }} /> Interactive 3D Spatial Quick Inspector
                                </h3>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>
                                    Quickly test 3D anatomical models, exploded layers, and camera orbits directly from your overview command deck.
                                </p>
                            </div>
                            <button
                                className="btn-secondary"
                                onClick={() => setActiveTab("spatial")}
                                style={{ fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "6px" }}
                            >
                                Full Screen Studio <FaChevronRight />
                            </button>
                        </div>

                        <div style={{ height: "clamp(480px, 60vh, 650px)", borderRadius: "16px", overflow: "hidden" }}>
                            <AnatomyCanvas
                                isBroadcasting={isBroadcasting}
                                onBroadcastControl={handleBroadcastControl}
                            />
                        </div>
                    </div>

                    {/* Connected Student Attendance Roster Card */}
                    <div className="glass-card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                            <div>
                                <h3 style={{ fontSize: "1.2rem", fontFamily: "var(--font-display)", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <FaUsers style={{ color: "var(--accent-cyan)" }} /> Synchronized Student Roster ({connectedStudents.length})
                                </h3>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>
                                    Real-time Socket.IO attendance list for Room Code: <strong style={{ color: "var(--accent-cyan)" }}>{roomId}</strong>
                                </p>
                            </div>

                            <button
                                className="btn-secondary"
                                onClick={handleAddMockStudent}
                                style={{ fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "6px" }}
                            >
                                <FaUserPlus /> + Simulate Student Join
                            </button>
                        </div>

                        {connectedStudents.length === 0 ? (
                            <div style={{ padding: "32px", textAlign: "center", background: "rgba(15, 23, 42, 0.4)", borderRadius: "12px", border: "1px dashed rgba(255,255,255,0.12)" }}>
                                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                                    No students currently connected to room <strong>{roomId}</strong>. Tell students to enter room code <strong>{roomId}</strong> in their student portal or click "+ Simulate Student Join" above.
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
                                {connectedStudents.map((st, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        style={{
                                            background: "rgba(15, 23, 42, 0.6)",
                                            border: "1px solid rgba(255, 255, 255, 0.1)",
                                            borderRadius: "12px",
                                            padding: "14px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between"
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                background: "linear-gradient(135deg, var(--accent-purple), var(--accent-blue))",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#fff",
                                                fontSize: "1.1rem",
                                                fontWeight: "700"
                                            }}>
                                                <FaUserGraduate />
                                            </div>
                                            <div>
                                                <h4 style={{ fontSize: "0.92rem", fontWeight: "700", color: "var(--text-primary)" }}>
                                                    {st.user?.name || `Student ${idx + 1}`}
                                                </h4>
                                                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.74rem", color: "var(--accent-emerald)", marginTop: "2px" }}>
                                                    <FaCheckCircle /> Synchronized ({st.latency})
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => toast.success(`Sent 3D view refresh ping to ${st.user?.name || "Student"}!`, { icon: "📡" })}
                                            style={{
                                                background: "rgba(255, 255, 255, 0.06)",
                                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                                color: "var(--text-muted)",
                                                fontSize: "0.75rem",
                                                padding: "4px 8px",
                                                borderRadius: "6px",
                                                cursor: "pointer"
                                            }}
                                            title="Ping Student Viewport"
                                        >
                                            <FaSyncAlt />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 2: 3D SPATIAL STUDIO */}
            {activeTab === "spatial" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div className="glass-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                        <div>
                            <h3 style={{ fontSize: "1.25rem", fontFamily: "var(--font-display)", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                                <FaCube style={{ color: "var(--accent-cyan)" }} /> 3D Anatomical Spatial Studio
                            </h3>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                                All 3D transformations, exploded layers, and part highlights in this viewport are broadcast to connected students when live streaming is ON.
                            </p>
                        </div>

                        <button
                            className={isBroadcasting ? "btn-emerald" : "btn-primary"}
                            onClick={toggleBroadcast}
                            style={{ borderRadius: "12px", fontWeight: "700" }}
                        >
                            <FaBroadcastTower className={isBroadcasting ? "pulse" : ""} />
                            {isBroadcasting ? `Broadcasting Live (${formatTime(broadcastTime)})` : "Start Live Broadcast"}
                        </button>
                    </div>

                    <AnatomyCanvas
                        isBroadcasting={isBroadcasting}
                        onBroadcastControl={handleBroadcastControl}
                    />
                </div>
            )}

            {/* TAB 3: 2D IMAGE TO 3D CONVERTER */}
            {activeTab === "2d-to-3d" && <DiagramConverter2D3D />}

            {/* TAB 4: QUIZZES & ASSESSMENTS */}
            {activeTab === "quizzes" && <QuizManager />}

            {/* TAB 5: OFFLINE CHAPTERS */}
            {activeTab === "chapters" && <ChapterManager />}

            {/* TAB 6: AI MEDICAL TEACHER */}
            {activeTab === "ai-assistant" && <AIAssistantWidget />}

            {/* End Live Broadcast Confirmation Modal */}
            <AnimatePresence>
                {showEndModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 9999,
                            background: "rgba(3, 7, 18, 0.78)",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "16px"
                        }}
                        onClick={() => setShowEndModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.94, opacity: 0, y: 12 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.94, opacity: 0, y: 12 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: "rgba(15, 23, 42, 0.96)",
                                border: "1px solid rgba(244, 63, 94, 0.35)",
                                borderRadius: "18px",
                                padding: "26px 28px",
                                maxWidth: "470px",
                                width: "100%",
                                boxShadow: "0 24px 50px rgba(0, 0, 0, 0.7)"
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                                <div
                                    style={{
                                        width: "44px",
                                        height: "44px",
                                        borderRadius: "12px",
                                        background: "rgba(244, 63, 94, 0.15)",
                                        border: "1px solid rgba(244, 63, 94, 0.35)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#f43f5e",
                                        fontSize: "1.25rem"
                                    }}
                                >
                                    <FaBroadcastTower />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#ffffff", margin: 0, fontFamily: "var(--font-display)" }}>
                                        End Live Classroom Broadcast?
                                    </h3>
                                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                                        Active Classroom: <strong style={{ color: "var(--accent-cyan)" }}>{roomId}</strong>
                                    </span>
                                </div>
                            </div>

                            <p style={{ color: "var(--text-secondary)", fontSize: "0.86rem", lineHeight: "1.55", marginBottom: "22px" }}>
                                Ending this session will immediately disconnect all {connectedStudents.length} connected students, revoke RTC audio/video tracks, and lock the shared 3D anatomical viewport.
                            </p>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                                <button
                                    className="btn-secondary"
                                    onClick={() => setShowEndModal(false)}
                                    style={{ padding: "8px 16px", borderRadius: "10px", fontSize: "0.85rem" }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setShowEndModal(false);
                                        stopBroadcast();
                                    }}
                                    style={{
                                        background: "linear-gradient(135deg, #f43f5e, #e11d48)",
                                        color: "#ffffff",
                                        border: "none",
                                        padding: "8px 18px",
                                        borderRadius: "10px",
                                        fontSize: "0.85rem",
                                        fontWeight: "700",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        boxShadow: "0 4px 14px rgba(244, 63, 94, 0.35)"
                                    }}
                                >
                                    <FaBroadcastTower /> Confirm & End Session
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </TeacherLayout>
    );
}

export default TeacherDashboard;
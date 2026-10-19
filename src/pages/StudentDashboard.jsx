import { useState, useEffect, useContext, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import StudentLayout from "../layouts/StudentLayout";
import MultiChapterViewer from "../components/MultiChapterViewer";
import DiagramConverter2D3D from "../components/DiagramConverter2D3D";
import AnatomyCanvas from "../three/AnatomyCanvas";
import ChapterReader from "../components/ChapterReader";
import StudentDoubtAssistant from "../components/StudentDoubtAssistant";
import ClassroomModal from "../components/ClassroomModal";
import AnatomyQuiz from "../components/AnatomyQuiz";
import ClassroomVideoDock from "../components/ClassroomVideoDock";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";
import { API_URL, SOCKET_URL } from "../config/api";
import {
    FaVideo,
    FaCube,
    FaBook,
    FaRobot,
    FaBroadcastTower,
    FaUsers,
    FaCheckCircle,
    FaTrophy,
    FaFire,
    FaArrowRight,
    FaSyncAlt,
    FaGamepad,
    FaLightbulb,
    FaShieldAlt,
    FaMagic,
    FaGraduationCap,
    FaDna,
    FaLock
} from "react-icons/fa";

import axios from "axios";

function StudentDashboard() {
    const navigate = useNavigate();
    const { user, token } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("multi-chapter");

    // Socket.IO Classroom Sync State
    const [socket, setSocket] = useState(null);
    const [roomId, setRoomId] = useState("med-101");
    const [inLiveClass, setInLiveClass] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [remoteState, setRemoteState] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pingMs, setPingMs] = useState(14);

    // Live Classroom Server-Verified Active Status & Ended Notice
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [activeTeacherName, setActiveTeacherName] = useState(null);
    const [sessionEndedNotice, setSessionEndedNotice] = useState(null);
    const [isCheckingSession, setIsCheckingSession] = useState(false);

    // Keep active roomId ref updated so socket handlers always evaluate current room ID
    const roomIdRef = useRef(roomId);
    useEffect(() => {
        roomIdRef.current = roomId;
    }, [roomId]);

    // Student stats
    const [quizzesCompleted, setQuizzesCompleted] = useState(3);
    const [streak, setStreak] = useState(5);
    const [modelsMastered, setModelsMastered] = useState(6);
    const [avgScore, setAvgScore] = useState(98);

    // Query server for live classroom session status
    const checkSessionStatus = useCallback(async (targetRoomId) => {
        const code = (targetRoomId || roomId || "med-101").trim();
        if (!code) return false;
        setIsCheckingSession(true);
        try {
            const tokenToUse = token || localStorage.getItem("ai_spatial_token");
            const res = await fetch(`${API_URL}/api/rtc/session/${code}`, {
                headers: tokenToUse ? { "Authorization": `Bearer ${tokenToUse}` } : {}
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok && data.status === "success") {
                const active = Boolean(data.isActive);
                setIsSessionActive(active);
                setActiveTeacherName(data.teacherName || null);
                if (active) {
                    setSessionEndedNotice(null);
                }
                return active;
            } else {
                setIsSessionActive(false);
                return false;
            }
        } catch (err) {
            console.warn("Notice checking session status:", err.message);
            return false;
        } finally {
            setIsCheckingSession(false);
        }
    }, [roomId, token]);

    // Verify session status whenever student visits live-class tab or room code changes
    useEffect(() => {
        if (activeTab === "live-class") {
            checkSessionStatus(roomId);
        }
    }, [activeTab, roomId, checkSessionStatus]);

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on("student-spatial-update", (data) => {
            console.log("📡 Received teacher spatial transform update:", data);
            setRemoteState(data);
        });

        newSocket.on("room-joined", (data) => {
            console.log("✅ Joined room confirmed by server:", data);
            setInLiveClass(true);
            setIsConnecting(false);
            setIsSessionActive(true);
            setSessionEndedNotice(null);
            if (data.roomId) {
                setRoomId(data.roomId);
            }
            toast.success(`🎓 Connected to Live Classroom: ${data.roomId}`, { icon: "📡", duration: 3500 });
        });

        newSocket.on("room-participants", (data) => {
            console.log("👥 Room participants updated for student:", data);
            const myId = newSocket.id;
            const students = data.room?.students || [];
            const amInRoom = students.some(s => s.socketId === myId);
            if (amInRoom) {
                setInLiveClass(true);
                setIsConnecting(false);
            }
        });

        // Host Started Live Classroom Session Listener
        newSocket.on("classroom-started", (data) => {
            console.log("📡 Host started classroom session event received:", data);
            if (!data || !data.roomId || data.roomId === roomIdRef.current) {
                setIsSessionActive(true);
                setActiveTeacherName(data?.teacherName || "Teacher");
                setSessionEndedNotice(null);
                toast.success(`📡 Teacher started live session for Room: ${data?.roomId || roomIdRef.current}!`, { icon: "🎥" });
            }
        });

        // Host Ended Classroom Session Listener
        newSocket.on("classroom-ended", (data) => {
            console.log("🛑 Host ended classroom session event received:", data);
            // Verify event targets the student's current active classroom to prevent stale ejections
            if (!data || !data.roomId || data.roomId === roomIdRef.current) {
                setInLiveClass(false);
                setIsSessionActive(false);
                setRemoteState(null);
                setIsConnecting(false);
                setSessionEndedNotice(data?.message || "The teacher has ended this live session.");
                toast.error(data?.message || "The teacher has ended this live session.", {
                    icon: "🛑",
                    duration: 5000
                });
            }
        });

        // Inactive Room Join Rejected by Server
        newSocket.on("room-join-error", (data) => {
            console.warn("🔒 Room join rejected by server:", data);
            setIsConnecting(false);
            setInLiveClass(false);
            setIsSessionActive(false);
            setSessionEndedNotice(data?.message || "No active classroom session. Please wait for your teacher.");
            toast.error(data?.message || "No active classroom session. Please wait for your teacher.", {
                icon: "🔒",
                duration: 5000
            });
        });

        newSocket.on("connect_error", (err) => {
            console.warn("Socket connection error:", err.message);
            setIsConnecting(false);
        });

        const pingInterval = setInterval(() => {
            setPingMs(Math.floor(12 + Math.random() * 8));
        }, 4000);

        return () => {
            newSocket.off("student-spatial-update");
            newSocket.off("room-joined");
            newSocket.off("room-participants");
            newSocket.off("classroom-started");
            newSocket.off("classroom-ended");
            newSocket.off("room-join-error");
            newSocket.off("connect_error");
            newSocket.close();
            clearInterval(pingInterval);
        };
    }, []);

    const joinLiveRoom = async (targetRoomId) => {
        const target = (targetRoomId || roomId || "med-101").trim();
        setRoomId(target);

        if (!socket || !socket.connected) {
            toast.error("Classroom server connection not ready. Please ensure backend is running.");
            return;
        }

        if (inLiveClass && roomId === target) {
            toast(`Already synchronized to Room: ${target}`, { icon: "📡" });
            setActiveTab("live-class");
            return;
        }

        setIsConnecting(true);
        setActiveTab("live-class");

        // Server-Side Verification: Verify session is active before allowing join
        const active = await checkSessionStatus(target);
        if (!active) {
            setIsConnecting(false);
            setIsSessionActive(false);
            setInLiveClass(false);
            setSessionEndedNotice("No active classroom session. Please wait for your teacher.");
            toast.error("No active classroom session. Please wait for your teacher.", { icon: "🔒" });
            return;
        }

        socket.emit("join-room", {
            roomId: target,
            user: { name: user?.name || "Student Alex", role: "student" }
        });

        // Timeout fallback if server doesn't respond with confirmation
        setTimeout(() => {
            setIsConnecting((prev) => {
                if (prev) {
                    toast.error(`Connection to room "${target}" timed out. Please check room code.`);
                    return false;
                }
                return false;
            });
        }, 6000);
    };

    const leaveLiveRoom = useCallback(() => {
        if (socket && inLiveClass) {
            socket.emit("leave-room", { roomId });
        }
        setInLiveClass(false);
        setRemoteState(null);
        toast("Disconnected from live classroom session.", { icon: "👋" });
    }, [socket, inLiveClass, roomId]);

    return (
        <StudentLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            {/* Top Bar Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px", flexWrap: "wrap", gap: "16px" }}>
                <div>
                    <h1 style={{ fontSize: "1.8rem", fontFamily: "var(--font-display)", fontWeight: "800", display: "flex", alignItems: "center", gap: "10px", letterSpacing: "-0.5px" }}>
                        🎓 AI Teacher 3D Educational Platform
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.86rem", marginTop: "4px" }}>
                        Interactive 3D Multi-Chapter Learning, Synchronized Voice AI Teacher, and 2D-to-3D Diagram Conversion Engine.
                    </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "rgba(10, 15, 30, 0.8)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        padding: "6px 14px",
                        borderRadius: "12px",
                        fontSize: "0.78rem",
                        color: "var(--accent-emerald)",
                        backdropFilter: "blur(14px)"
                    }}>
                        <FaCheckCircle /> {pingMs}ms Latency (Socket.IO)
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={inLiveClass ? "btn-emerald" : "btn-primary"}
                        onClick={() => {
                            if (inLiveClass) {
                                leaveLiveRoom();
                            } else {
                                setIsModalOpen(true);
                            }
                        }}
                        disabled={isConnecting}
                        style={{ display: "flex", alignItems: "center", gap: "8px", borderRadius: "12px", fontWeight: "700", fontSize: "0.88rem", padding: "9px 18px" }}
                    >
                        <FaVideo />
                        {inLiveClass ? `Connected: ${roomId} (Leave)` : isConnecting ? "Connecting..." : "Join Live 3D Class"}
                    </motion.button>
                </div>
            </div>

            {/* TAB 1: AI TEACHER MULTI-CHAPTER CURRICULUM & 3D STAGE */}
            {activeTab === "multi-chapter" && (
                <MultiChapterViewer />
            )}

            {/* TAB 2: 2D TO 3D DIAGRAM CONVERTER */}
            {activeTab === "2d-to-3d" && (
                <DiagramConverter2D3D />
            )}

            {/* TAB 3: 3D MODEL SPATIAL EXPLORER */}
            {activeTab === "explorer" && (
                <div style={{ height: "clamp(520px, 70vh, 760px)" }}>
                    <AnatomyCanvas />
                </div>
            )}

            {/* TAB 4: LIVE CLASSROOM */}
            {activeTab === "live-class" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {inLiveClass ? (
                        <>
                            <div className="glass-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", background: "rgba(10, 15, 30, 0.82)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(16, 185, 129, 0.2)", border: "1px solid #10b981", color: "#10b981", padding: "4px 10px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: "700" }}>
                                            ● LIVE SYNCHRONIZED
                                        </span>
                                        <span style={{ fontSize: "0.85rem", color: "var(--accent-cyan)", fontWeight: "600" }}>
                                            Room: {roomId}
                                        </span>
                                    </div>
                                    <h2 style={{ fontSize: "1.25rem", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                                        <FaBroadcastTower style={{ color: "var(--accent-cyan)" }} /> Synchronized Teacher Viewport
                                    </h2>
                                    <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", margin: 0 }}>
                                        Mirroring teacher 3D spatial models, camera perspective, explode layers, and cross-sections in real time.
                                    </p>
                                </div>
                                <button
                                    className="btn-secondary"
                                    onClick={leaveLiveRoom}
                                    style={{
                                        fontSize: "0.82rem",
                                        borderRadius: "10px",
                                        background: "rgba(244, 63, 94, 0.1)",
                                        border: "1px solid rgba(244, 63, 94, 0.3)",
                                        color: "#fca5a5"
                                    }}
                                >
                                    Disconnect / Leave Room
                                </button>
                            </div>

                            <ClassroomVideoDock
                                roomId={roomId}
                                isActive={inLiveClass}
                                isTeacher={false}
                                authToken={token}
                                onLeave={leaveLiveRoom}
                            />

                            <div style={{ height: "clamp(520px, 70vh, 760px)", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                                <AnatomyCanvas
                                    isStudentView={true}
                                    remoteState={remoteState}
                                    showModelSelector={false}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Session Ended Notice Banner */}
                            {sessionEndedNotice && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-card"
                                    style={{
                                        padding: "20px 24px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        flexWrap: "wrap",
                                        gap: "16px",
                                        background: "rgba(244, 63, 94, 0.08)",
                                        border: "1px solid rgba(244, 63, 94, 0.35)",
                                        borderRadius: "14px"
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                                        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(244, 63, 94, 0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f43f5e", fontSize: "1.25rem" }}>
                                            <FaBroadcastTower />
                                        </div>
                                        <div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "#ffffff", margin: 0 }}>
                                                    {sessionEndedNotice}
                                                </h3>
                                                <span style={{ fontSize: "0.72rem", background: "rgba(244, 63, 94, 0.22)", color: "#fca5a5", padding: "2px 8px", borderRadius: "6px", fontWeight: "700" }}>
                                                    SESSION CLOSED
                                                </span>
                                            </div>
                                            <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", margin: "4px 0 0 0" }}>
                                                No active classroom session. Please wait for your teacher.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        className="btn-secondary"
                                        onClick={() => checkSessionStatus(roomId)}
                                        disabled={isCheckingSession}
                                        style={{ fontSize: "0.82rem", padding: "8px 14px", display: "flex", alignItems: "center", gap: "6px", borderRadius: "10px" }}
                                    >
                                        <FaSyncAlt className={isCheckingSession ? "spin" : ""} />
                                        {isCheckingSession ? "Checking..." : "Check Session Status"}
                                    </button>
                                </motion.div>
                            )}

                            {/* Connect to Live Classroom Card */}
                            <div className="glass-card" style={{ padding: "34px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", background: "rgba(15, 23, 42, 0.72)" }}>
                                <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: isSessionActive ? "rgba(16, 185, 129, 0.15)" : "rgba(6, 182, 212, 0.15)", border: `1px solid ${isSessionActive ? "rgba(16, 185, 129, 0.35)" : "rgba(6, 182, 212, 0.35)"}`, display: "flex", alignItems: "center", justifyContent: "center", color: isSessionActive ? "var(--accent-emerald)" : "var(--accent-cyan)", fontSize: "1.5rem" }}>
                                    <FaBroadcastTower />
                                </div>
                                <div>
                                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "700", marginBottom: "8px", background: isSessionActive ? "rgba(16, 185, 129, 0.15)" : "rgba(148, 163, 184, 0.12)", color: isSessionActive ? "#10b981" : "#94a3b8", border: `1px solid ${isSessionActive ? "rgba(16, 185, 129, 0.28)" : "rgba(148, 163, 184, 0.25)"}` }}>
                                        {isSessionActive
                                            ? `● LIVE SESSION READY • Host: ${activeTeacherName || "Teacher"}`
                                            : "○ STANDBY • AWAITING TEACHER BROADCAST"}
                                    </div>
                                    <h2 style={{ fontSize: "1.35rem", fontFamily: "var(--font-display)", fontWeight: "700", color: "#ffffff" }}>
                                        Connect to Live 3D Classroom
                                    </h2>
                                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", maxWidth: "560px", marginTop: "6px" }}>
                                        {isSessionActive
                                            ? "Your teacher's live spatial lecture is active. Enter your room code to join and synchronize your 3D viewport."
                                            : "No active classroom session. Please wait for your teacher."}
                                    </p>
                                </div>
                                <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "460px", marginTop: "8px" }}>
                                    <input
                                        type="text"
                                        value={roomId}
                                        onChange={(e) => {
                                            setRoomId(e.target.value);
                                            checkSessionStatus(e.target.value);
                                        }}
                                        placeholder="Enter Room Code (e.g. med-101)"
                                        style={{ flex: 1, textAlign: "center", fontWeight: "700", fontSize: "0.95rem", borderRadius: "10px" }}
                                    />
                                    {isSessionActive ? (
                                        <button
                                            className="btn-primary"
                                            onClick={() => joinLiveRoom(roomId)}
                                            disabled={isConnecting}
                                            style={{ padding: "10px 20px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", borderRadius: "10px" }}
                                        >
                                            <FaVideo /> {isConnecting ? "Connecting..." : "Connect Now"}
                                        </button>
                                    ) : (
                                        <button
                                            className="btn-secondary"
                                            onClick={() => checkSessionStatus(roomId)}
                                            disabled={isCheckingSession}
                                            style={{ padding: "10px 18px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", opacity: 0.9, borderRadius: "10px" }}
                                            title="Click to check if your teacher has started this session"
                                        >
                                            <FaLock /> {isCheckingSession ? "Checking..." : "Wait for Teacher"}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Locked Viewport Placeholder Cover */}
                            <div className="glass-card" style={{ height: "360px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", background: "rgba(10, 15, 30, 0.6)", border: "1px dashed rgba(255, 255, 255, 0.14)", borderRadius: "16px", padding: "24px" }}>
                                <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "1.4rem" }}>
                                    <FaLock />
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <h3 style={{ fontSize: "1.18rem", fontWeight: "700", color: "#ffffff", marginBottom: "6px" }}>
                                        Synchronized 3D Classroom Viewport Locked
                                    </h3>
                                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", maxWidth: "480px", margin: "0 auto" }}>
                                        The shared spatial viewport and live synchronization controls are accessible only during an active teacher-led session.
                                    </p>
                                </div>
                                <button
                                    className="btn-secondary"
                                    onClick={() => setActiveTab("explorer")}
                                    style={{ fontSize: "0.84rem", display: "flex", alignItems: "center", gap: "8px", borderRadius: "10px", padding: "10px 18px" }}
                                >
                                    <FaCube /> Open Independent 3D Model Explorer (Self-Study)
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* TAB 5: 3D ANATOMY QUIZ */}
            {activeTab === "quiz" && (
                <AnatomyQuiz />
            )}

            {/* TAB 6: SUBJECT-WISE CHAPTERS (Classes 6–12) */}
            {activeTab === "subject-wise" && (
                <ChapterReader initialMode="subject-wise" />
            )}

            {/* TAB 7: CHAPTER LIBRARY (Uploaded Documents & Syllabus) */}
            {activeTab === "chapters" && (
                <ChapterReader initialMode="library" />
            )}

            {/* TAB 7: AI DOUBT ASSISTANT */}
            {activeTab === "ai-assistant" && (
                <div style={{ height: "680px" }}>
                    <StudentDoubtAssistant />
                </div>
            )}

            {/* Modal for Joining Classroom */}
            <ClassroomModal
                isOpen={isModalOpen}
                defaultRoomId={roomId}
                onClose={() => setIsModalOpen(false)}
                onJoinRoom={joinLiveRoom}
            />
        </StudentLayout>
    );
}

export default StudentDashboard;
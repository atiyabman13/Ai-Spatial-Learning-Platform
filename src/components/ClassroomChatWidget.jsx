import { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import WebRTCVoiceCall from "./WebRTCVoiceCall";
import { FaComments, FaPaperPlane, FaTimes, FaUser, FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";

export default function ClassroomChatWidget({ socket, roomId = "med-101", isOpen, onClose }) {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "Dr. Sarah Mitchell",
            role: "teacher",
            message: "👋 Welcome to Room med-101 live spatial session! Feel free to ask questions.",
            timestamp: "10:00 AM"
        }
    ]);
    const [inputMsg, setInputMsg] = useState("");
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMsg = (msg) => {
            setMessages((prev) => [...prev, msg]);
        };

        socket.on("receive-message", handleReceiveMsg);

        return () => {
            socket.off("receive-message", handleReceiveMsg);
        };
    }, [socket]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputMsg.trim() || !socket) return;

        const senderName = user?.name || (user?.role === "teacher" ? "Dr. Sarah Mitchell" : "Alex Smith");
        const msgObj = {
            roomId,
            sender: senderName,
            role: user?.role || "student",
            message: inputMsg.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        socket.emit("send-message", msgObj);
        setInputMsg("");
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            style={{
                position: "absolute",
                top: "60px",
                right: "16px",
                width: "330px",
                height: "480px",
                zIndex: 100,
                background: "rgba(10, 15, 30, 0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid var(--accent-cyan)",
                borderRadius: "18px",
                boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: "12px 16px",
                    background: "rgba(255, 255, 255, 0.05)",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaComments style={{ color: "var(--accent-cyan)", fontSize: "1.1rem" }} />
                    <h4 style={{ fontSize: "0.92rem", fontWeight: "700", color: "#fff" }}>
                        Live Chat ({roomId})
                    </h4>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <WebRTCVoiceCall role={user?.role} roomId={roomId} />
                    <button
                        onClick={onClose}
                        style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1rem" }}
                    >
                        <FaTimes />
                    </button>
                </div>
            </div>

            {/* Chat Messages */}
            <div style={{ flex: 1, padding: "14px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
                {messages.map((m, idx) => {
                    const isMe = m.sender === (user?.name || "Student");
                    const isTeacher = m.role === "teacher" || m.sender.includes("Dr.");
                    return (
                        <div
                            key={m.id || idx}
                            style={{
                                alignSelf: isMe ? "flex-end" : "flex-start",
                                maxWidth: "85%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: isMe ? "flex-end" : "flex-start"
                            }}
                        >
                            <span style={{ fontSize: "0.68rem", color: isTeacher ? "var(--accent-cyan)" : "var(--accent-purple)", fontWeight: "700", marginBottom: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                                {isTeacher ? <FaChalkboardTeacher /> : <FaUserGraduate />} {m.sender}
                            </span>
                            <div
                                style={{
                                    background: isMe
                                        ? "linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))"
                                        : "rgba(30, 41, 59, 0.9)",
                                    color: "#fff",
                                    padding: "8px 12px",
                                    borderRadius: isMe ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                                    fontSize: "0.82rem",
                                    lineHeight: "1.4",
                                    border: isMe ? "none" : "1px solid rgba(255,255,255,0.08)"
                                }}
                            >
                                {m.message}
                            </div>
                            <span style={{ fontSize: "0.62rem", color: "var(--text-muted)", marginTop: "2px" }}>
                                {m.timestamp}
                            </span>
                        </div>
                    );
                })}
                <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <form
                onSubmit={handleSend}
                style={{
                    padding: "10px 12px",
                    background: "rgba(0, 0, 0, 0.4)",
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    gap: "8px"
                }}
            >
                <input
                    type="text"
                    placeholder="Type message to class..."
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    style={{
                        flex: 1,
                        background: "rgba(15, 23, 42, 0.8)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: "10px",
                        padding: "8px 12px",
                        color: "#fff",
                        fontSize: "0.82rem",
                        outline: "none"
                    }}
                />
                <button
                    type="submit"
                    style={{
                        background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
                        border: "none",
                        color: "#fff",
                        padding: "8px 14px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <FaPaperPlane style={{ fontSize: "0.85rem" }} />
                </button>
            </form>
        </motion.div>
    );
}

import { useState, useEffect } from "react";
import { FaVideo, FaTimes, FaUsers, FaCopy, FaCheck } from "react-icons/fa";

export default function ClassroomModal({ isOpen, onClose, onJoinRoom, role = "student", defaultRoomId = "med-101" }) {
    const [roomId, setRoomId] = useState(defaultRoomId);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (defaultRoomId) {
            setRoomId(defaultRoomId);
        }
    }, [defaultRoomId, isOpen]);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleJoin = (e) => {
        e.preventDefault();
        if (roomId.trim() && onJoinRoom) {
            onJoinRoom(roomId.trim());
            onClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "1.3rem", fontFamily: "var(--font-display)", display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaVideo style={{ color: "var(--accent-cyan)" }} />
                        {role === "teacher" ? "Broadcast Live 3D Spatial Class" : "Join Synchronized 3D Live Class"}
                    </h3>
                    <button onClick={onClose} style={{ background: "transparent", color: "var(--text-muted)", fontSize: "1.2rem" }}>
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleJoin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                        <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                            Classroom Session ID
                        </label>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <input
                                type="text"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                placeholder="Enter Room Code e.g. med-101"
                                style={{ flex: 1 }}
                                required
                            />
                            <button type="button" className="btn-secondary" onClick={handleCopy}>
                                {copied ? <FaCheck style={{ color: "var(--accent-emerald)" }} /> : <FaCopy />}
                            </button>
                        </div>
                    </div>

                    <div style={{ background: "rgba(6, 182, 212, 0.08)", border: "1px solid rgba(6, 182, 212, 0.2)", borderRadius: "var(--radius-sm)", padding: "12px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                        {role === "teacher"
                            ? "💡 As a Teacher, your 3D model rotation, zoom, explode view, and slice planes will be streamed live via Socket.IO to all students in this room."
                            : "💡 As a Student, joining this room will automatically synchronize your 3D viewport with the Teacher's live spatial lecture."}
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            <FaUsers /> {role === "teacher" ? "Start Broadcast" : "Join Session"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

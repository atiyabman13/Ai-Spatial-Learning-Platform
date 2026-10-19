import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL, getApiUrl } from "../config/api";
import { FaFileUpload, FaBook, FaTrash, FaDownload, FaFilePdf, FaCheckCircle, FaSpinner } from "react-icons/fa";

export default function ChapterManager() {
    const [chapters, setChapters] = useState([]);
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("Anatomy");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");

    const fetchChapters = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/chapters/all`);
            setChapters(res.data.chapters || []);
        } catch (error) {
            console.error("Fetch chapters error:", error);
        }
    };

    useEffect(() => {
        fetchChapters();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!title.trim() || !file) {
            setStatusMsg("Please fill in title and select a PDF file.");
            return;
        }

        setUploading(true);
        setStatusMsg("");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("subject", subject);
        formData.append("description", description);
        formData.append("file", file);

        try {
            const res = await axios.post(`${API_URL}/api/chapters/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setStatusMsg("✅ Chapter uploaded and PDF text extracted successfully!");
            setTitle("");
            setDescription("");
            setFile(null);
            fetchChapters();
        } catch (error) {
            console.error("Upload error:", error);
            setStatusMsg("❌ Upload failed: " + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this chapter?")) return;
        try {
            await axios.delete(`${API_URL}/api/chapters/${id}`);
            fetchChapters();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Upload Section Card */}
            <div className="glass-card">
                <h3 style={{ fontSize: "1.2rem", fontFamily: "var(--font-display)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaFileUpload style={{ color: "var(--accent-cyan)" }} /> Upload Medical Chapter / Textbook
                </h3>

                <form onSubmit={handleUpload} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                        <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>Chapter Title *</label>
                        <input
                            type="text"
                            placeholder="e.g. Cardiovascular System & Heart Anatomy"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ width: "100%" }}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>Subject Category</label>
                        <select value={subject} onChange={(e) => setSubject(e.target.value)} style={{ width: "100%" }}>
                            <option value="Cardiology">Cardiology / Heart</option>
                            <option value="Neuroanatomy">Neuroanatomy / Brain</option>
                            <option value="Osteology">Osteology / Skeletal</option>
                            <option value="Ophthalmology">Ophthalmology / Eye</option>
                            <option value="General Anatomy">General Anatomy</option>
                        </select>
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                        <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>Description / Key Highlights</label>
                        <textarea
                            placeholder="Brief description of covered topics..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ width: "100%", height: "80px" }}
                        />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                        <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>Select PDF Document *</label>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setFile(e.target.files[0])}
                            style={{ width: "100%", background: "rgba(0,0,0,0.3)" }}
                            required
                        />
                    </div>

                    {statusMsg && (
                        <div style={{ gridColumn: "1 / -1", color: statusMsg.includes("✅") ? "var(--accent-emerald)" : "var(--accent-rose)", fontSize: "0.9rem" }}>
                            {statusMsg}
                        </div>
                    )}

                    <div style={{ gridColumn: "1 / -1" }}>
                        <button type="submit" className="btn-primary" disabled={uploading}>
                            {uploading ? <FaSpinner className="spin" /> : <FaFileUpload />} Upload & Extract Text
                        </button>
                    </div>
                </form>
            </div>

            {/* Chapters List Grid */}
            <div className="glass-card">
                <h3 style={{ fontSize: "1.2rem", fontFamily: "var(--font-display)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaBook style={{ color: "var(--accent-purple)" }} /> Published Chapters Library ({chapters.length})
                </h3>

                {chapters.length === 0 ? (
                    <p style={{ color: "var(--text-muted)" }}>No chapters uploaded yet. Upload a PDF textbook above to populate the library.</p>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
                        {chapters.map((ch) => (
                            <div key={ch._id} style={{ background: "rgba(30, 41, 59, 0.6)", border: "1px solid var(--border-glass)", borderRadius: "var(--radius-sm)", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <FaFilePdf style={{ color: "#ef4444", fontSize: "1.5rem", flexShrink: 0 }} />
                                    <div>
                                        <h4 style={{ fontSize: "1rem", color: "var(--text-primary)" }}>{ch.title}</h4>
                                        <span style={{ fontSize: "0.75rem", background: "rgba(6, 182, 212, 0.15)", color: "var(--accent-cyan)", padding: "2px 8px", borderRadius: "10px" }}>
                                            {ch.subject}
                                        </span>
                                    </div>
                                </div>

                                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", height: "40px", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {ch.description || "No description provided."}
                                </p>

                                {ch.extractedText && (
                                    <span style={{ fontSize: "0.75rem", color: "var(--accent-emerald)", display: "flex", alignItems: "center", gap: "4px" }}>
                                        <FaCheckCircle /> PDF Text Extracted ({ch.extractedText.length} chars)
                                    </span>
                                )}

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "8px", borderTop: "1px solid var(--border-glass)" }}>
                                    <a
                                        href={getApiUrl(ch.fileUrl)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-secondary"
                                        style={{ fontSize: "0.8rem", padding: "4px 10px", display: "flex", alignItems: "center", gap: "4px" }}
                                    >
                                        <FaDownload /> PDF File
                                    </a>
                                    <button
                                        onClick={() => handleDelete(ch._id)}
                                        style={{ background: "rgba(244, 63, 94, 0.15)", color: "var(--accent-rose)", border: "none", padding: "6px 10px", borderRadius: "6px", fontSize: "0.8rem" }}
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

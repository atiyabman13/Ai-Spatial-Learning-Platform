import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaPlus, FaTrophy, FaTrash, FaCheckCircle, FaSpinner, FaFileAlt, FaBrain, FaUsers, FaChartLine } from "react-icons/fa";

export default function QuizManager() {
    const [quizzes, setQuizzes] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [activeTab, setActiveTab] = useState("creator"); // "creator" | "published" | "leaderboard"

    // Form inputs
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("Cardiology");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState([
        {
            questionText: "Which heart chamber pumps oxygenated blood into the systemic aorta?",
            options: ["Right Atrium", "Left Ventricle", "Right Ventricle", "Superior Vena Cava"],
            correctOptionIndex: 1,
            explanation: "The Left Ventricle features thick muscular myocardium to pump blood through the aorta to the systemic body."
        }
    ]);
    const [loading, setLoading] = useState(false);

    const fetchQuizzesAndLeaderboard = async () => {
        try {
            const [qRes, lRes] = await Promise.all([
                axios.get(`${API_URL}/api/quiz/all`),
                axios.get(`${API_URL}/api/quiz/leaderboard`)
            ]);
            setQuizzes(qRes.data.quizzes || []);
            setLeaderboard(lRes.data.leaderboard || []);
        } catch (err) {
            console.error("Fetch quiz manager data notice:", err);
        }
    };

    useEffect(() => {
        fetchQuizzesAndLeaderboard();
    }, []);

    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            {
                questionText: "",
                options: ["", "", "", ""],
                correctOptionIndex: 0,
                explanation: ""
            }
        ]);
    };

    const handleQuestionChange = (index, field, value) => {
        const updated = [...questions];
        updated[index][field] = value;
        setQuestions(updated);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const updated = [...questions];
        updated[qIndex].options[oIndex] = value;
        setQuestions(updated);
    };

    const handleRemoveQuestion = (qIndex) => {
        if (questions.length === 1) return;
        setQuestions(questions.filter((_, idx) => idx !== qIndex));
    };

    const handleCreateQuiz = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error("Please enter a quiz title.");
            return;
        }

        for (let i = 0; i < questions.length; i++) {
            if (!questions[i].questionText.trim()) {
                toast.error(`Question ${i + 1} text cannot be empty.`);
                return;
            }
        }

        setLoading(true);
        try {
            await axios.post(`${API_URL}/api/quiz/create`, {
                title,
                subject,
                description,
                questions,
                createdBy: "Dr. Sarah Mitchell"
            });
            toast.success(`Published quiz "${title}" to Student Hub!`, { icon: "📝" });
            setTitle("");
            setDescription("");
            setQuestions([
                {
                    questionText: "",
                    options: ["", "", "", ""],
                    correctOptionIndex: 0,
                    explanation: ""
                }
            ]);
            fetchQuizzesAndLeaderboard();
            setActiveTab("published");
        } catch (err) {
            toast.error("Failed to publish quiz: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuiz = async (id) => {
        if (!window.confirm("Delete this published quiz?")) return;
        try {
            await axios.delete(`${API_URL}/api/quiz/${id}`);
            toast.success("Quiz deleted.");
            fetchQuizzesAndLeaderboard();
        } catch (err) {
            console.error("Delete quiz error:", err);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Tab Selector Header */}
            <div className="glass-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div>
                    <h2 style={{ fontSize: "1.35rem", fontFamily: "var(--font-display)", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaTrophy style={{ color: "var(--accent-cyan)" }} /> Teacher Assessment & Quiz Manager
                    </h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "2px" }}>
                        Create custom 3D anatomical assessments, publish quizzes to students, and track real-time score statistics.
                    </p>
                </div>

                <div style={{ display: "flex", gap: "8px", background: "rgba(10, 15, 30, 0.6)", padding: "4px", borderRadius: "12px", border: "1px solid var(--border-glass)" }}>
                    <button
                        type="button"
                        onClick={() => setActiveTab("creator")}
                        style={{
                            background: activeTab === "creator" ? "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))" : "transparent",
                            color: activeTab === "creator" ? "#fff" : "var(--text-muted)",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "10px",
                            fontWeight: "700",
                            fontSize: "0.82rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                        }}
                    >
                        <FaPlus /> Create Quiz
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("published")}
                        style={{
                            background: activeTab === "published" ? "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))" : "transparent",
                            color: activeTab === "published" ? "#fff" : "var(--text-muted)",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "10px",
                            fontWeight: "700",
                            fontSize: "0.82rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                        }}
                    >
                        <FaFileAlt /> Published ({quizzes.length})
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("leaderboard")}
                        style={{
                            background: activeTab === "leaderboard" ? "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))" : "transparent",
                            color: activeTab === "leaderboard" ? "#fff" : "var(--text-muted)",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "10px",
                            fontWeight: "700",
                            fontSize: "0.82rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                        }}
                    >
                        <FaChartLine /> Student Roster
                    </button>
                </div>
            </div>

            {/* TAB 1: CREATE QUIZ FORM */}
            {activeTab === "creator" && (
                <div className="glass-card">
                    <form onSubmit={handleCreateQuiz} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            <div>
                                <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block", fontWeight: "600" }}>
                                    Quiz Assessment Title *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Midterm 3D Cardiac Anatomy Examination"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    style={{ width: "100%" }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block", fontWeight: "600" }}>
                                    Subject Module Category
                                </label>
                                <select value={subject} onChange={(e) => setSubject(e.target.value)} style={{ width: "100%" }}>
                                    <option value="Cardiology">Cardiology / Heart</option>
                                    <option value="Neuroanatomy">Neuroanatomy / Brain</option>
                                    <option value="Osteology">Osteology / Skeletal</option>
                                    <option value="Ophthalmology">Ophthalmology / Eye</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block", fontWeight: "600" }}>
                                Instructions / Overview Description
                            </label>
                            <input
                                type="text"
                                placeholder="Brief instructions for students taking this assessment..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={{ width: "100%" }}
                            />
                        </div>

                        {/* Questions List Editor */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "10px" }}>
                            <h4 style={{ fontSize: "1rem", color: "var(--accent-cyan)", fontWeight: "700" }}>
                                Quiz Questions ({questions.length})
                            </h4>

                            {questions.map((q, qIdx) => (
                                <div
                                    key={qIdx}
                                    style={{
                                        background: "rgba(15, 23, 42, 0.6)",
                                        border: "1px solid var(--border-glass)",
                                        borderRadius: "14px",
                                        padding: "18px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "12px"
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--accent-purple)" }}>
                                            Question #{qIdx + 1}
                                        </span>
                                        {questions.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveQuestion(qIdx)}
                                                style={{ background: "rgba(244, 63, 94, 0.15)", border: "none", color: "var(--accent-rose)", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "0.78rem" }}
                                            >
                                                Remove Question
                                            </button>
                                        )}
                                    </div>

                                    <input
                                        type="text"
                                        placeholder={`Question ${qIdx + 1} text...`}
                                        value={q.questionText}
                                        onChange={(e) => handleQuestionChange(qIdx, "questionText", e.target.value)}
                                        required
                                        style={{ width: "100%" }}
                                    />

                                    {/* 4 Options Grid */}
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                        {q.options.map((opt, oIdx) => (
                                            <div key={oIdx} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <input
                                                    type="radio"
                                                    name={`correct-${qIdx}`}
                                                    checked={q.correctOptionIndex === oIdx}
                                                    onChange={() => handleQuestionChange(qIdx, "correctOptionIndex", oIdx)}
                                                    style={{ width: "auto", cursor: "pointer" }}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder={`Option ${String.fromCharCode(65 + oIdx)}...`}
                                                    value={opt}
                                                    onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                                                    required
                                                    style={{ width: "100%", fontSize: "0.85rem" }}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <input
                                        type="text"
                                        placeholder="Explanation / Takeaway (shown after student submits)..."
                                        value={q.explanation}
                                        onChange={(e) => handleQuestionChange(qIdx, "explanation", e.target.value)}
                                        style={{ width: "100%", fontSize: "0.82rem", background: "rgba(0,0,0,0.3)" }}
                                    />
                                </div>
                            ))}
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={handleAddQuestion}
                                style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem" }}
                            >
                                <FaPlus /> + Add Another Question
                            </button>

                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading}
                                style={{ padding: "12px 28px", borderRadius: "12px" }}
                            >
                                {loading ? <FaSpinner className="spin" /> : <FaCheckCircle />} Publish Quiz Assessment
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* TAB 2: PUBLISHED QUIZZES LIST */}
            {activeTab === "published" && (
                <div className="glass-card">
                    <h3 style={{ fontSize: "1.2rem", fontFamily: "var(--font-display)", fontWeight: "700", marginBottom: "16px" }}>
                        Published Quizzes in Database ({quizzes.length})
                    </h3>

                    {quizzes.length === 0 ? (
                        <p style={{ color: "var(--text-muted)" }}>No published quizzes found. Switch to 'Create Quiz' tab to publish your first assessment.</p>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: "16px" }}>
                            {quizzes.map((q) => (
                                <div key={q._id} style={{ background: "rgba(30, 41, 59, 0.6)", border: "1px solid var(--border-glass)", borderRadius: "14px", padding: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }}>
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                            <span style={{ fontSize: "0.75rem", background: "rgba(6, 182, 212, 0.15)", color: "var(--accent-cyan)", padding: "2px 8px", borderRadius: "10px", fontWeight: "700" }}>
                                                {q.subject}
                                            </span>
                                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                                {q.questions?.length || 0} Questions
                                            </span>
                                        </div>
                                        <h4 style={{ fontSize: "1.05rem", color: "#fff", fontWeight: "700" }}>{q.title}</h4>
                                        <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                                            {q.description || "Interactive medical assessment module."}
                                        </p>
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", borderTop: "1px solid var(--border-glass)" }}>
                                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Created by {q.createdBy}</span>
                                        <button
                                            onClick={() => handleDeleteQuiz(q._id)}
                                            style={{ background: "rgba(244, 63, 94, 0.15)", color: "var(--accent-rose)", border: "none", padding: "6px 12px", borderRadius: "8px", fontSize: "0.8rem", cursor: "pointer" }}
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TAB 3: STUDENT PERFORMANCE LEADERBOARD ROSTER */}
            {activeTab === "leaderboard" && (
                <div className="glass-card">
                    <h3 style={{ fontSize: "1.2rem", fontFamily: "var(--font-display)", fontWeight: "700", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaUsers style={{ color: "var(--accent-cyan)" }} /> Student Performance & Roster Analytics
                    </h3>

                    {leaderboard.length === 0 ? (
                        <p style={{ color: "var(--text-muted)" }}>No student quiz attempts submitted yet.</p>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff", fontSize: "0.88rem" }}>
                                <thead>
                                    <tr style={{ background: "rgba(15, 23, 42, 0.8)", borderBottom: "1px solid var(--border-glass)", textAlign: "left" }}>
                                        <th style={{ padding: "12px 16px" }}>Rank</th>
                                        <th style={{ padding: "12px 16px" }}>Student Name</th>
                                        <th style={{ padding: "12px 16px" }}>Total Score</th>
                                        <th style={{ padding: "12px 16px" }}>Completed Quizzes</th>
                                        <th style={{ padding: "12px 16px" }}>Max Streak</th>
                                        <th style={{ padding: "12px 16px" }}>Avg Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.map((st, idx) => (
                                        <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                                            <td style={{ padding: "12px 16px", fontWeight: "800", color: idx === 0 ? "#f59e0b" : idx === 1 ? "#94a3b8" : idx === 2 ? "#b45309" : "var(--text-muted)" }}>
                                                #{idx + 1}
                                            </td>
                                            <td style={{ padding: "12px 16px", fontWeight: "700", color: "var(--text-primary)" }}>{st._id}</td>
                                            <td style={{ padding: "12px 16px", fontWeight: "700", color: "var(--accent-cyan)" }}>{st.totalScore} pts</td>
                                            <td style={{ padding: "12px 16px" }}>{st.quizzesCompleted}</td>
                                            <td style={{ padding: "12px 16px", color: "#f59e0b", fontWeight: "700" }}>{st.maxStreak} 🔥</td>
                                            <td style={{ padding: "12px 16px", color: "var(--accent-emerald)", fontWeight: "700" }}>{Math.round(st.avgPercentage)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

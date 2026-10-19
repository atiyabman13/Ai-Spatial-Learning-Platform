import React from "react";
import { FaExclamationTriangle, FaRedo, FaHome } from "react-icons/fa";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: "80vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "24px",
                    background: "var(--bg-primary, #0a0d14)",
                    color: "var(--text-primary, #f8fafc)"
                }}>
                    <div style={{
                        maxWidth: "600px",
                        width: "100%",
                        background: "rgba(15, 23, 42, 0.9)",
                        border: "1px solid rgba(244, 63, 94, 0.35)",
                        borderRadius: "20px",
                        padding: "36px",
                        textAlign: "center",
                        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)"
                    }}>
                        <div style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            background: "rgba(244, 63, 94, 0.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 20px auto",
                            color: "#f43f5e",
                            fontSize: "1.8rem"
                        }}>
                            <FaExclamationTriangle />
                        </div>

                        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "10px" }}>
                            Something went wrong
                        </h2>

                        <p style={{ color: "var(--text-secondary, #94a3b8)", fontSize: "0.92rem", lineHeight: "1.6", marginBottom: "24px" }}>
                            The page encountered an unexpected rendering issue. You can reload this view or return to the platform dashboard.
                        </p>

                        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                            <button
                                onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
                                className="btn-emerald"
                                style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.9rem" }}
                            >
                                <FaRedo /> Reload View
                            </button>

                            <button
                                onClick={() => { window.location.href = "/"; }}
                                className="btn-secondary"
                                style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.9rem" }}
                            >
                                <FaHome /> Platform Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

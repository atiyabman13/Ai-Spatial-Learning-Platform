import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import UnifiedLogin from "./pages/UnifiedLogin";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import BiologyDashboard from "./pages/BiologyDashboard";
import BiologyChapterDetail from "./pages/BiologyChapterDetail";

import ErrorBoundary from "./components/ErrorBoundary";
import FloatingAIAssistant from "./components/FloatingAIAssistant";

function App() {
    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: "rgba(15, 23, 42, 0.95)",
                        color: "#fff",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(12px)",
                        borderRadius: "12px",
                        fontSize: "0.9rem"
                    }
                }}
            />

            {/* Global Floating AI Assistant - active after student/teacher login */}
            <ErrorBoundary fallback={null}>
                <FloatingAIAssistant />
            </ErrorBoundary>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<UnifiedLogin />} />
                <Route path="/teacher-login" element={<UnifiedLogin />} />
                <Route path="/student-login" element={<UnifiedLogin />} />
                <Route
                    path="/teacher-dashboard"
                    element={
                        <ProtectedRoute allowedRole="teacher">
                            <ErrorBoundary>
                                <TeacherDashboard />
                            </ErrorBoundary>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student-dashboard"
                    element={
                        <ProtectedRoute allowedRole="student">
                            <ErrorBoundary>
                                <StudentDashboard />
                            </ErrorBoundary>
                        </ProtectedRoute>
                    }
                />
                {/* Protected Biology Learning Dashboard & Interactive Chapters for Classes 6–12 */}
                <Route
                    path="/biology"
                    element={
                        <ProtectedRoute allowedRoles={["teacher", "student"]}>
                            <ErrorBoundary>
                                <BiologyDashboard />
                            </ErrorBoundary>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/biology/chapters/:chapterId"
                    element={
                        <ProtectedRoute allowedRoles={["teacher", "student"]}>
                            <ErrorBoundary>
                                <BiologyChapterDetail />
                            </ErrorBoundary>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/biology/lesson/:chapterId"
                    element={
                        <ProtectedRoute allowedRoles={["teacher", "student"]}>
                            <ErrorBoundary>
                                <BiologyChapterDetail />
                            </ErrorBoundary>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    );
}

export default App;
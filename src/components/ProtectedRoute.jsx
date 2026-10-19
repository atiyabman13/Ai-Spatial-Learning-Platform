import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loader from "./Loader";

export default function ProtectedRoute({ children, allowedRole, allowedRoles }) {
    const { isAuthenticated, user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-dark)" }}>
                <Loader />
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        let redirectPath = "/login";
        if (allowedRole === "teacher") {
            redirectPath = "/teacher-login";
        } else if (allowedRole === "student") {
            redirectPath = "/student-login";
        }
        return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }

    // Enforce role authorization
    const roles = allowedRoles || (allowedRole ? [allowedRole] : null);
    if (roles && !roles.includes(user.role)) {
        const fallbackPath = user.role === "teacher" ? "/teacher-dashboard" : "/student-dashboard";
        return <Navigate to={fallbackPath} replace />;
    }

    return children;
}

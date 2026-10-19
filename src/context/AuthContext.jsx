import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem("ai_spatial_user");
            const savedToken = localStorage.getItem("ai_spatial_token");
            // If token is missing, corrupted, or a legacy mock token, reject initial state
            if (!savedToken || savedToken === "undefined" || savedToken.startsWith("demo-token")) {
                localStorage.removeItem("ai_spatial_token");
                localStorage.removeItem("ai_spatial_user");
                return null;
            }
            if (savedUser && savedUser !== "undefined" && savedUser !== "[object Object]") {
                return JSON.parse(savedUser);
            }
        } catch (e) {
            console.warn("Corrupted session in localStorage reset:", e);
            localStorage.removeItem("ai_spatial_user");
            localStorage.removeItem("ai_spatial_token");
        }
        return null;
    });

    const [token, setToken] = useState(() => {
        try {
            const savedToken = localStorage.getItem("ai_spatial_token");
            if (savedToken && savedToken !== "undefined" && !savedToken.startsWith("demo-token")) {
                return savedToken;
            }
            return null;
        } catch (e) {
            return null;
        }
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifySession = async () => {
            const savedToken = localStorage.getItem("ai_spatial_token");

            // No token or legacy demo token found
            if (!savedToken || savedToken === "undefined" || savedToken.startsWith("demo-token")) {
                setUser(null);
                setToken(null);
                localStorage.removeItem("ai_spatial_token");
                localStorage.removeItem("ai_spatial_user");
                setLoading(false);
                return;
            }

            try {
                // Strictly verify JWT against backend database
                const response = await axios.get(`${API_URL}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${savedToken}` }
                });

                if (response.data && response.data.user) {
                    setUser(response.data.user);
                    setToken(savedToken);
                    localStorage.setItem("ai_spatial_user", JSON.stringify(response.data.user));
                } else {
                    throw new Error("Invalid session response payload");
                }
            } catch (error) {
                // Token is invalid, expired, revoked, or backend unreachable:
                // NEVER silently authenticate! Clear session state completely.
                console.warn("Session verification failed. Access revoked:", error?.response?.data?.message || error.message);
                setUser(null);
                setToken(null);
                localStorage.removeItem("ai_spatial_token");
                localStorage.removeItem("ai_spatial_user");
            } finally {
                setLoading(false);
            }
        };

        verifySession();
    }, []);

    const login = (authToken, userData) => {
        setToken(authToken);
        setUser(userData);
        try {
            localStorage.setItem("ai_spatial_token", authToken);
            localStorage.setItem("ai_spatial_user", JSON.stringify(userData));
        } catch (e) {
            console.warn("Could not save session to localStorage:", e);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        try {
            localStorage.removeItem("ai_spatial_token");
            localStorage.removeItem("ai_spatial_user");
        } catch (e) {
            // ignore
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                token,
                login,
                logout,
                loading,
                isAuthenticated: !!token && !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
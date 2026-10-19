/**
 * Centralized API & Backend Configuration
 * 
 * Supports dynamic production backend URLs via Vite environment variable VITE_API_URL.
 * Safely defaults to http://localhost:5000 for local development.
 */

const rawApiUrl = typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL;

export const API_URL = (rawApiUrl && typeof rawApiUrl === "string" && rawApiUrl.trim() !== "")
    ? rawApiUrl.trim().replace(/\/+$/, "")
    : "http://localhost:5000";

export const SOCKET_URL = API_URL;

/**
 * Construct an absolute URL pointing to backend resources (APIs, static uploads, generated models)
 * @param {string} path - Relative path (e.g. "/api/auth/login", "/uploads/pdf.pdf")
 * @returns {string} Absolute URL with API_URL prefix
 */
export function getApiUrl(path = "") {
    if (!path) return API_URL;
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:")) {
        return path;
    }
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_URL}${cleanPath}`;
}

export default API_URL;

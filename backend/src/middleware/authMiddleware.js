const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Securely retrieve JWT Secret from environment.
 * Fails closed if JWT_SECRET is unset, empty, or whitespace.
 */
const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret || typeof secret !== "string" || !secret.trim()) {
        const error = new Error("FATAL: JWT_SECRET environment variable is missing or empty.");
        error.code = "MISSING_JWT_SECRET";
        throw error;
    }
    return secret.trim();
};

/**
 * Authentication Middleware:
 * Verifies JWT token from Authorization header and verifies user existence in MongoDB.
 */
const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access denied. No authentication token provided." });
        }

        const token = authHeader.split(" ")[1];

        if (!token || token === "undefined" || token === "null" || token.startsWith("demo-token")) {
            return res.status(401).json({ message: "Invalid authentication token." });
        }

        let jwtSecret;
        try {
            jwtSecret = getJwtSecret();
        } catch (configError) {
            console.error("JWT Configuration Error:", configError.message);
            return res.status(500).json({
                message: "Authentication service unavailable due to server configuration error."
            });
        }

        // Verify cryptographic signature and expiration using configured secret
        const decoded = jwt.verify(token, jwtSecret);

        // Verify active user in database (excluding password hash)
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User account associated with this session no longer exists." });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Session expired. Please log in again." });
        }
        return res.status(401).json({ message: "Invalid session token. Please re-authenticate." });
    }
};

/**
 * Role-Based Access Control Middleware
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Forbidden: Access requires one of [${roles.join(", ")}] permissions.`
            });
        }
        next();
    };
};

module.exports = protect;
module.exports.protect = protect;
module.exports.authorize = authorize;
module.exports.getJwtSecret = getJwtSecret;
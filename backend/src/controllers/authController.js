const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getJwtSecret } = require("../middleware/authMiddleware");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// REGISTER USER
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, portalRole } = req.body;

        // 1. Validate required fields
        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Full name is required." });
        }
        if (!email || !email.trim()) {
            return res.status(400).json({ message: "Email address is required." });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required." });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // 2. Validate email format
        if (!EMAIL_REGEX.test(normalizedEmail)) {
            return res.status(400).json({ message: "Please provide a valid email address format." });
        }

        // 3. Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }

        // 4. Validate and restrict role based on selected portal
        const targetRole = portalRole || role;
        if (portalRole && role && portalRole !== role) {
            return res.status(400).json({
                message: `Portal mismatch: Selected portal '${portalRole}' cannot register a '${role}' account.`
            });
        }
        const userRole = targetRole === "teacher" ? "teacher" : "student";

        // 5. Reject duplicate email addresses
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({ message: "An account with this email address already exists. Please sign in instead." });
        }

        // 6. Hash password with bcrypt salt rounds = 10
        const hashedPassword = await bcrypt.hash(password, 10);

        // 7. Persist user into MongoDB
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: userRole
        });

        // 8. Sign JWT token using configured secret
        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            getJwtSecret(),
            { expiresIn: "7d" }
        );

        // 9. Respond with sanitized profile (never exposing password hash)
        res.status(201).json({
            message: "Registration successful!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Registration failed due to server error. Please try again." });
    }
};

// LOGIN USER
exports.login = async (req, res) => {
    try {
        const { email, password, portalRole } = req.body;

        // 1. Validate required fields
        if (!email || !email.trim() || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // 2. Validate email format
        if (!EMAIL_REGEX.test(normalizedEmail)) {
            return res.status(400).json({ message: "Please provide a valid email address format." });
        }

        // 3. Query user against MongoDB database
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password. Please check your credentials." });
        }

        // 3. Verify password hash using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password. Please check your credentials." });
        }

        // 4. Compare authenticated user's actual database role with selected portal role
        if (portalRole && portalRole !== user.role) {
            const roleName = user.role === "teacher" ? "Teacher" : "Student";
            const portalName = user.role === "teacher" ? "Teacher Studio" : "Student Portal";
            return res.status(403).json({
                message: `These credentials belong to a ${roleName} account. Please select ${portalName} to continue.`,
                code: "ROLE_MISMATCH",
                actualRole: user.role
            });
        }

        // 5. Generate genuine JWT using configured secret
        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            getJwtSecret(),
            { expiresIn: "7d" }
        );

        // 6. Send authenticated response with sanitized user data
        res.json({
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Authentication service error. Please try again later." });
    }
};

// GET CURRENT USER PROFILE (PROTECTED)
exports.getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        res.json({
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            }
        });
    } catch (error) {
        console.error("getMe error:", error);
        res.status(500).json({ message: "Failed to retrieve user profile." });
    }
};
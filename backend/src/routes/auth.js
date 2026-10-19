const router = require("express").Router();
const protect = require("../middleware/authMiddleware");

const {
    register,
    login,
    getMe
} = require("../controllers/authController");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Get current logged-in user profile
router.get("/me", protect, getMe);

module.exports = router;
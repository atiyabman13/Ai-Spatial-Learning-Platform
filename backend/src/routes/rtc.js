const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
    getLiveKitToken,
    endClassroomSession,
    getSessionStatus,
    getLiveKitDiagnostic
} = require("../controllers/rtcController");

/**
 * @route   POST /api/rtc/token
 * @desc    Generate secure LiveKit RTC room token for authenticated user
 * @access  Private (Teacher or Student with active classroom authorization)
 */
router.post("/token", protect, getLiveKitToken);

/**
 * @route   POST /api/rtc/end-session
 * @desc    Idempotently terminate an active classroom session (Host only)
 * @access  Private (Teacher host only)
 */
router.post("/end-session", protect, endClassroomSession);

/**
 * @route   GET /api/rtc/session/:roomId
 * @desc    Check whether a classroom session is currently active
 * @access  Private (Teacher or Student)
 */
router.get("/session/:roomId", protect, getSessionStatus);

/**
 * @route   GET /api/rtc/diagnostic
 * @desc    Temporary LiveKit credential and connectivity diagnostic (Read-only)
 * @access  Private (Teacher only)
 */
router.get("/diagnostic", protect, authorize("teacher"), getLiveKitDiagnostic);

module.exports = router;


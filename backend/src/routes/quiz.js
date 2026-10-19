const router = require("express").Router();
const {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    deleteQuiz,
    submitQuizAttempt,
    getStudentStats,
    getLeaderboard
} = require("../controllers/quizController");

// Teacher Quiz Routes
router.post("/create", createQuiz);
router.get("/all", getAllQuizzes);
router.get("/leaderboard", getLeaderboard);
router.get("/student-stats", getStudentStats);
router.get("/:id", getQuizById);
router.delete("/:id", deleteQuiz);

// Student Quiz Submission
router.post("/attempt", submitQuizAttempt);

module.exports = router;

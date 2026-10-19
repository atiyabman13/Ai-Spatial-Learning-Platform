const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");

// CREATE CUSTOM QUIZ (TEACHER)
exports.createQuiz = async (req, res) => {
    try {
        const { title, subject, description, questions, createdBy } = req.body;

        if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ message: "Title and at least one question are required." });
        }

        const quiz = await Quiz.create({
            title,
            subject: subject || "Anatomy",
            description: description || "",
            questions,
            createdBy: createdBy || "Dr. Sarah Mitchell",
            isPublished: true
        });

        res.status(201).json({
            message: "Quiz created and published successfully!",
            quiz
        });
    } catch (error) {
        console.error("Create quiz error:", error);
        res.status(500).json({ message: error.message });
    }
};

// GET ALL PUBLISHED QUIZZES
exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ isPublished: true }).sort({ createdAt: -1 });
        res.json({ quizzes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET QUIZ BY ID
exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        res.json({ quiz });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE QUIZ
exports.deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        res.json({ message: "Quiz deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// SAVE A QUIZ ATTEMPT (STUDENT)
exports.submitQuizAttempt = async (req, res) => {
    try {
        const { studentId, studentName, modelName, score, totalQuestions, percentage, answers, streakCount } = req.body;

        if (!studentName || !modelName || score === undefined) {
            return res.status(400).json({ message: "Student name, model name, and score are required." });
        }

        const attempt = await QuizAttempt.create({
            studentId: studentId || null,
            studentName: studentName || "Student",
            modelName: modelName || "Heart",
            score: score || 0,
            totalQuestions: totalQuestions || 5,
            percentage: percentage !== undefined ? percentage : Math.round(((score || 0) / ((totalQuestions || 5) * 100)) * 100),
            answers: answers || [],
            streakCount: streakCount || 1
        });

        res.status(201).json({
            message: "Quiz attempt saved successfully!",
            attempt
        });
    } catch (error) {
        console.error("Submit quiz error:", error);
        res.status(500).json({ message: error.message });
    }
};

// GET STUDENT QUIZ ANALYTICS & HISTORY
exports.getStudentStats = async (req, res) => {
    try {
        const { studentName, studentId } = req.query;

        let query = {};
        if (studentId) {
            query.studentId = studentId;
        } else if (studentName) {
            query.studentName = new RegExp(studentName, "i");
        }

        const attempts = await QuizAttempt.find(query).sort({ timestamp: -1 });

        const totalAttempts = attempts.length;
        const totalScore = attempts.reduce((acc, curr) => acc + curr.score, 0);
        const avgScore = totalAttempts > 0 ? Math.round(totalScore / totalAttempts) : 0;
        const highestStreak = attempts.reduce((max, curr) => Math.max(max, curr.streakCount || 0), 0);
        const passedQuizzes = attempts.filter((a) => a.percentage >= 60).length;

        res.json({
            stats: {
                totalAttempts,
                avgScore,
                highestStreak,
                passedQuizzes,
                attempts
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET LEADERBOARD & TEACHER STUDENT PERFORMANCE ROSTER
exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await QuizAttempt.aggregate([
            {
                $group: {
                    _id: "$studentName",
                    totalScore: { $sum: "$score" },
                    quizzesCompleted: { $sum: 1 },
                    maxStreak: { $max: "$streakCount" },
                    avgPercentage: { $avg: "$percentage" },
                    lastAttemptDate: { $max: "$timestamp" }
                }
            },
            { $sort: { totalScore: -1 } },
            { $limit: 15 }
        ]);

        res.json({ leaderboard });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

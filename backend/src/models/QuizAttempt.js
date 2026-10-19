const mongoose = require("mongoose");

const QuizAttemptSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
    studentName: {
        type: String,
        required: true
    },
    modelName: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true,
        default: 3
    },
    percentage: {
        type: Number,
        required: true
    },
    answers: [{
        questionIndex: Number,
        selectedOption: String,
        isCorrect: Boolean
    }],
    streakCount: {
        type: Number,
        default: 1
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
});

module.exports = mongoose.model("QuizAttempt", QuizAttemptSchema);

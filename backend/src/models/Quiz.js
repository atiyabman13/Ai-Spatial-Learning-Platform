const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctOptionIndex: { type: Number, required: true },
    explanation: { type: String, default: "" },
    target3DModel: { type: String, default: "Heart" },
    target3DPart: { type: String, default: "" }
});

const QuizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        default: "Cardiology"
    },
    description: {
        type: String,
        default: ""
    },
    questions: [QuestionSchema],
    createdBy: {
        type: String,
        default: "Teacher"
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Quiz", QuizSchema);

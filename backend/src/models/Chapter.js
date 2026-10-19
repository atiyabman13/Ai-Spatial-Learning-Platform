const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        default: "Anatomy"
    },
    description: {
        type: String,
        default: ""
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        default: ""
    },
    extractedText: {
        type: String,
        default: ""
    },
    uploadedBy: {
        type: String,
        default: "Teacher"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Chapter", chapterSchema);

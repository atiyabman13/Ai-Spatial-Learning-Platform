const mongoose = require("mongoose");

const ClassroomSessionSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    teacherName: {
        type: String,
        required: true
    },
    activeModel: {
        type: String,
        default: "Heart"
    },
    explodeState: {
        type: Boolean,
        default: false
    },
    wireframeState: {
        type: Boolean,
        default: false
    },
    activePart: {
        type: String,
        default: null
    },
    connectedStudents: [{
        socketId: String,
        studentName: String,
        joinedAt: { type: Date, default: Date.now }
    }],
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

ClassroomSessionSchema.pre("save", function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("ClassroomSession", ClassroomSessionSchema);

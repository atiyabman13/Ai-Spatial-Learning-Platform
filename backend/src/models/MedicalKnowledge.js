const mongoose = require("mongoose");

const QAPairSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    difficulty: { type: String, enum: ["basic", "intermediate", "advanced"], default: "basic" }
});

const MedicalKnowledgeSchema = new mongoose.Schema({
    organSystem: {
        type: String,
        required: true,
        enum: ["Heart", "Brain", "Eye", "Skeleton", "Pulmonology", "Gastroenterology", "Renal"],
        index: true
    },
    structureName: {
        type: String,
        required: true,
        index: true
    },
    medicalDefinition: {
        type: String,
        required: true
    },
    primaryFunction: {
        type: String,
        required: true
    },
    microscopicStructure: {
        type: String,
        default: ""
    },
    clinicalRelevance: {
        type: String,
        default: ""
    },
    spatialCoordinates: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        z: { type: Number, default: 0 }
    },
    keywords: [{
        type: String,
        index: true
    }],
    qaPairs: [QAPairSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Text index for fast, scalable medical query searching across terms
MedicalKnowledgeSchema.index({
    structureName: "text",
    medicalDefinition: "text",
    primaryFunction: "text",
    clinicalRelevance: "text",
    keywords: "text"
});

module.exports = mongoose.model("MedicalKnowledge", MedicalKnowledgeSchema);

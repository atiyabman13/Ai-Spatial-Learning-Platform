const mongoose = require("mongoose");
const seedMedicalDatabase = require("../seed/medicalSeeder");

const connectDB = async () => {
    try {
        await mongoose.connect(
            process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai-spatial-platform"
        );
        console.log("MongoDB Connected Successfully");
        
        // Auto-seed Medical Knowledge Base on boot if empty
        await seedMedicalDatabase();
    } catch (error) {
        console.log("MongoDB Connection Failed:", error.message);
    }
};

module.exports = connectDB;
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const path = require("path");

const connectDB = require("./config/database");
const socketInit = require("./modules/socket");

// Load Environment Variables
dotenv.config({ path: path.join(__dirname, "../.env") });

// Validate Required Security Configuration on Boot
if (!process.env.JWT_SECRET || !process.env.JWT_SECRET.trim()) {
    console.error("❌ FATAL CONFIGURATION ERROR: JWT_SECRET environment variable is missing or empty.");
    console.error("   The server cannot start without a secure JWT_SECRET configured in backend/.env.");
    process.exit(1);
}

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Chapter PDF Files and Reconstructed 3D GLB Models
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/generated-models", express.static(path.join(__dirname, "../generated-models")));

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/chapters", require("./routes/chapter"));
app.use("/api/ai", require("./routes/ai"));
app.use("/api/quiz", require("./routes/quiz"));
app.use("/api/convert3d", require("./routes/convert3d"));
app.use("/api/rtc", require("./routes/rtc"));

// Health Check API
app.get("/", (req, res) => {
    res.json({
        status: "Online",
        message: "🧠 AI Spatial Medical Platform Backend API Operating Successfully 🚀",
        endpoints: [
            "/api/auth/login",
            "/api/auth/register",
            "/api/chapters/upload",
            "/api/chapters/all",
            "/api/ai/ask"
        ]
    });
});

// Create HTTP Server & Initialize Socket.IO
const server = http.createServer(app);
socketInit(server);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 AI Spatial Platform Server running on port ${PORT}`);
});
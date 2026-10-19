const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
    uploadChapter,
    getAllChapters,
    getChapterById,
    deleteChapter
} = require("../controllers/chapterController");

// Configure Multer Storage
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Routes
router.post("/upload", upload.single("file"), uploadChapter);
router.get("/all", getAllChapters);
router.get("/:id", getChapterById);
router.delete("/:id", deleteChapter);

module.exports = router;
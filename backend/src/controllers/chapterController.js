const Chapter = require("../models/Chapter");
const path = require("path");
const fs = require("fs");

let pdfParse = null;
try {
    pdfParse = require("pdf-parse");
} catch (err) {
    console.log("pdf-parse optional load notice:", err.message);
}

// Upload Chapter with PDF Text Extraction
exports.uploadChapter = async (req, res) => {
    try {
        const { title, subject, description, uploadedBy } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        let fileUrl = "";
        let fileName = "";
        let extractedText = "";

        if (req.file) {
            fileUrl = `/uploads/${req.file.filename}`;
            fileName = req.file.originalname;

            // Extract PDF text if PDF file
            if (req.file.mimetype === "application/pdf" && pdfParse) {
                try {
                    const dataBuffer = fs.readFileSync(req.file.path);
                    const pdfData = await pdfParse(dataBuffer);
                    extractedText = pdfData.text || "";
                } catch (pdfErr) {
                    console.log("PDF parse warning:", pdfErr.message);
                    extractedText = "Text extraction skipped for this PDF.";
                }
            }
        } else if (req.body.fileUrl) {
            fileUrl = req.body.fileUrl;
        }

        const chapter = await Chapter.create({
            title,
            subject: subject || "Anatomy",
            description: description || "",
            fileUrl,
            fileName,
            extractedText,
            uploadedBy: uploadedBy || "Teacher"
        });

        res.status(201).json({
            message: "Chapter uploaded successfully!",
            chapter
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get All Chapters
exports.getAllChapters = async (req, res) => {
    try {
        const chapters = await Chapter.find().sort({ createdAt: -1 });
        res.json({ chapters });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Chapter by ID
exports.getChapterById = async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id);
        if (!chapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }
        res.json({ chapter });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Chapter
exports.deleteChapter = async (req, res) => {
    try {
        const chapter = await Chapter.findByIdAndDelete(req.params.id);
        if (!chapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }
        res.json({ message: "Chapter deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

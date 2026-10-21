
const router = require("express").Router();
const askAI = require("../modules/aiAssistant");

// ASK AI QUESTION
// Endpoint: POST /api/ai/ask
router.post("/ask", async (req, res) => {
    try {
        const {
            question,
            context,
            mode = "chat",
            apiKey = null
        } = req.body || {};

        if (
            !question &&
            mode !== "quiz" &&
            mode !== "case_study"
        ) {
            return res.status(400).json({
                error: "Question parameter is required."
            });
        }

        const response = await askAI(
            question || "Hello AI Assistant",
            context || {},
            mode,
            apiKey
        );

        return res.json(response);
    } catch (error) {
        console.error("AI ask route error:", error.message);

        return res.status(500).json({
            error: "Failed to process the AI request."
        });
    }
});

// GENERATE ANATOMICAL QUIZ
// Endpoint: POST /api/ai/quiz
router.post("/quiz", async (req, res) => {
    try {
        const {
            activeModel = "Heart",
            selectedPart = null,
            apiKey = null
        } = req.body || {};

        const response = await askAI(
            "Generate 3D Anatomical Quiz",
            { activeModel, selectedPart },
            "quiz",
            apiKey
        );

        return res.json(response);
    } catch (error) {
        console.error("AI quiz route error:", error.message);

        return res.status(500).json({
            error: "Failed to generate the quiz."
        });
    }
});

// GENERATE CLINICAL CASE STUDY
// Endpoint: POST /api/ai/case-study
router.post("/case-study", async (req, res) => {
    try {
        const {
            activeModel = "Heart",
            selectedPart = null,
            apiKey = null
        } = req.body || {};

        const response = await askAI(
            "Generate Clinical Case Study",
            { activeModel, selectedPart },
            "case_study",
            apiKey
        );

        return res.json(response);
    } catch (error) {
        console.error("AI case-study route error:", error.message);

        return res.status(500).json({
            error: "Failed to generate the clinical case study."
        });
    }
});

// ANALYZE IMAGE AND GENERATE A SPATIAL EXPLANATION
// Endpoint: POST /api/ai/image-explain
router.post("/image-explain", async (req, res) => {
    try {
        const {
            imageName = "2D Object Image",
            apiKey = null
        } = req.body || {};

        const prompt = `Analyze this 2D uploaded image "${imageName}".
Explain its structural components, 3D spatial depth extrusion, physiological or mechanical function, and how to inspect its 3D mesh boundaries in the interactive viewport.`;

        const response = await askAI(
            prompt,
            { activeModel: imageName },
            "chat",
            apiKey
        );

        return res.json({
            explanation: response.answer,
            provider: response.provider
        });
    } catch (error) {
        console.error("AI image-explain route error:", error.message);

        return res.status(500).json({
            error: "Failed to analyze the image."
        });
    }
});

// DETECT IMAGE SUB-PARTS
// Endpoint: POST /api/ai/image-parts
router.post("/image-parts", async (req, res) => {
    try {
        const {
            imageName = "2D Image Model",
            apiKey = null
        } = req.body || {};

        const prompt = `Perform structural part segmentation analysis for the image "${imageName}".
Return a JSON array of 5 identified sub-parts with properties: name, region, function, and color.`;

        const response = await askAI(
            prompt,
            { activeModel: imageName },
            "chat",
            apiKey
        );

        return res.json({
            result: response.answer,
            provider: response.provider
        });
    } catch (error) {
        console.error("AI image-parts route error:", error.message);

        return res.status(500).json({
            error: "Failed to identify image sub-parts."
        });
    }
});

module.exports = router;

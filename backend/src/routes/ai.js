const router = require("express").Router();
const askAI = require("../modules/aiAssistant");

// ASK AI QUESTION (CHATGPT / GEMINI CONVERSATIONAL AI)
router.post("/ask", async (req, res) => {
    try {
        const { question, context, mode = "chat", apiKey = null } = req.body;
        if (!question && mode !== "quiz" && mode !== "case_study") {
            return res.status(400).json({ error: "Question parameter is required." });
        }

        const response = await askAI(question || "Hello AI Assistant", context, mode, apiKey);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GENERATE 3D ANATOMICAL QUIZ
router.post("/quiz", async (req, res) => {
    try {
        const { activeModel = "Heart", selectedPart = null, apiKey = null } = req.body;
        const response = await askAI("Generate 3D Anatomical Quiz", { activeModel, selectedPart }, "quiz", apiKey);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GENERATE CLINICAL CASE STUDY
router.post("/case-study", async (req, res) => {
    try {
        const { activeModel = "Heart", selectedPart = null, apiKey = null } = req.body;
        const response = await askAI("Generate Clinical Case Study", { activeModel, selectedPart }, "case_study", apiKey);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ANALYZE 2D IMAGE & GENERATE 3D SPATIAL EXPLANATION
router.post("/image-explain", async (req, res) => {
    try {
        const { imageName = "2D Object Image", apiKey = null } = req.body;
        const prompt = `Analyze this 2D uploaded image "${imageName}".
Explain its structural components, 3D spatial depth extrusion, physiological/mechanical function, and how to inspect its 3D mesh boundaries in the interactive viewport.`;
        
        const response = await askAI(prompt, { activeModel: imageName }, "chat", apiKey);
        res.json({ explanation: response.answer, provider: response.provider });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DETECT & EXTRACT 2D IMAGE SUB-PARTS FOR 3D MODEL PINPOINTING
router.post("/image-parts", async (req, res) => {
    try {
        const { imageName = "2D Image Model", apiKey = null } = req.body;
        const prompt = `Perform structural part segmentation analysis for 2D image "${imageName}".
Return a JSON array of 5 identified sub-parts with properties: name, region, function, and color.`;

        const response = await askAI(prompt, { activeModel: imageName }, "chat", apiKey);
        res.json({ result: response.answer, provider: response.provider });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
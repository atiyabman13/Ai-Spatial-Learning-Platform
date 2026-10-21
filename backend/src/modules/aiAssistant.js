
const {
    queryKnowledgeEngine,
    generateOfflineQuiz,
    generateOfflineClinicalCase
} = require("./localKnowledgeEngine");
const llm = require("./llmClient");
 
const MAX_HISTORY = 12;
const MAX_MESSAGE_CHARS = 4000;
 
// Debug info (error details in the API response) is shown only when
// NODE_ENV is not "production" or LLM_DEBUG=true is set.
const DEBUG = process.env.NODE_ENV !== "production" || process.env.LLM_DEBUG === "true";
 
function buildSystemPrompt({ activeModel, selectedPart, role }) {
    const lines = [
        "You are the AI Study Assistant of the AI Spatial Learning Platform, a 3D learning app for school students (Classes 6-12) covering Biology, Physics and Chemistry.",
        "Teach step by step in simple language, with a short example or analogy where it helps.",
        "Use Markdown: short paragraphs, bullet points, and **bold** for key terms. Write formulas in plain text or simple LaTeX like $F = ma$.",
        "Keep answers focused (usually under 250 words) unless the student asks for more depth.",
        "If you are not sure of a fact, say so instead of guessing. Never invent data.",
        "If the question is unrelated to science or studying, politely steer the student back to learning.",
        "End with one short follow-up question or suggestion only when it genuinely helps."
    ];
    if (role === "teacher") {
        lines.push("The user is a teacher: you may suggest quiz questions, classroom activities and ways to use the 3D models.");
    }
    if (activeModel) {
        lines.push(`The student is currently viewing the 3D model: "${activeModel}".`);
    }
    if (selectedPart) {
        lines.push(`They have selected the part: "${selectedPart}". Prefer explanations about this part when the question is ambiguous.`);
    }
    return lines.join("\n");
}
 
function sanitizeHistory(history) {
    if (!Array.isArray(history)) return [];
    return history
        .map((m) => ({
            role: m?.role === "assistant" || m?.sender === "ai" ? "assistant" : "user",
            content: typeof (m?.content ?? m?.text) === "string" ? (m.content ?? m.text) : ""
        }))
        .filter((m) => m.content.trim())
        .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }))
        .slice(-MAX_HISTORY);
}
 
async function askAI(question, context = {}, mode = "chat", _ignoredKey = null) {
    // --- DEBUG: confirms the request actually reached askAI ---
    console.log(`>>> askAI called | mode: ${mode} | question: "${String(question || "").slice(0, 80)}"`);
    console.log(`>>> LLM configured: ${llm.isConfigured()} | model: ${llm.MODEL}`);
 
    const { activeModel = null, selectedPart = null, history = [], role = "student" } = context || {};
 
    if (mode === "quiz") {
        const quiz = generateOfflineQuiz(activeModel || "Heart", selectedPart);
        return { answer: quiz.answer, provider: "Local Knowledge Engine", mode, model: activeModel };
    }
    if (mode === "case_study") {
        return {
            answer: generateOfflineClinicalCase(activeModel || "Heart", selectedPart),
            provider: "Local Knowledge Engine",
            mode,
            model: activeModel
        };
    }
 
    const cleanHistory = sanitizeHistory(history);
    const q = String(question || "").slice(0, MAX_MESSAGE_CHARS);
 
    let local = null;
    try {
        local = queryKnowledgeEngine(q, { history: cleanHistory, activeModel, selectedPart });
    } catch (e) {
        console.error("Local engine error:", e.message);
    }
 
    try {
        const last = cleanHistory[cleanHistory.length - 1];
        const turns =
            last && last.role === "user" && last.content === q
                ? cleanHistory
                : [...cleanHistory, { role: "user", content: q }];
 
        const answer = await llm.complete([
            { role: "system", content: buildSystemPrompt({ activeModel, selectedPart, role }) },
            ...turns
        ]);
 
        console.log(">>> LLM answered successfully");
 
        return {
            answer,
            provider: `AI Tutor (${llm.MODEL})`,
            actionCue: local?.actionCue || null,
            modelName: local?.modelName || activeModel,
            fallback: false
        };
    } catch (err) {
        // --- DEBUG: full error so the real cause is visible in the terminal ---
        console.error("LLM request failed:", {
            status: err.status,
            code: err.code,
            message: err.message
        });
 
        return {
            answer: local?.answer || "Sorry, I couldn't answer that right now. Please try again in a moment.",
            provider: "Local Knowledge Engine",
            actionCue: local?.actionCue || null,
            modelName: local?.modelName || activeModel,
            fallback: true,
            reason: err.code === "LLM_NOT_CONFIGURED" ? "llm_not_configured" : "llm_unavailable",
            ...(DEBUG && {
                debugError: {
                    status: err.status || null,
                    code: err.code || null,
                    message: err.message
                }
            })
        };
    }
}
 
module.exports = askAI;
module.exports.buildSystemPrompt = buildSystemPrompt;
module.exports.sanitizeHistory = sanitizeHistory;

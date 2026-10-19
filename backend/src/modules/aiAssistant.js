const {
    queryKnowledgeEngine,
    generateOfflineQuiz,
    generateOfflineClinicalCase
} = require("./localKnowledgeEngine");

/**
 * AI Assistant Module - Powered strictly by the offline Local Knowledge Engine.
 * 
 * Complies with strict non-negotiable requirements:
 * - No external AI cloud calls (no Gemini, no OpenAI).
 * - No API keys required.
 * - Truthfully identifies provider as "Local Knowledge Engine".
 */
async function askAI(question, context = {}, mode = "chat", customApiKey = null) {
    const { activeModel = "Heart", selectedPart = null, history = [] } = context;

    try {
        if (mode === "quiz") {
            const quizRes = generateOfflineQuiz(activeModel, selectedPart);
            return {
                answer: quizRes.answer,
                provider: "Local Knowledge Engine",
                mode: "quiz",
                model: activeModel
            };
        }

        if (mode === "case_study") {
            const caseRes = generateOfflineClinicalCase(activeModel, selectedPart);
            return {
                answer: caseRes,
                provider: "Local Knowledge Engine",
                mode: "case_study",
                model: activeModel
            };
        }

        // Standard Q&A mode
        const result = queryKnowledgeEngine(question, {
            history,
            activeModel,
            selectedPart
        });

        return {
            answer: result.answer,
            provider: "Local Knowledge Engine",
            actionCue: result.actionCue || null,
            modelName: result.modelName || activeModel,
            found: result.found,
            topic: result.topic
        };
    } catch (err) {
        console.error("Local Knowledge Engine resolution notice:", err.message);
        return {
            answer: "An error occurred in the Local Knowledge Engine. Please rephrase your science question.",
            provider: "Local Knowledge Engine",
            error: true
        };
    }
}

module.exports = askAI;

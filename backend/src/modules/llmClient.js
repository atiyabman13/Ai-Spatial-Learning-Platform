const OpenAIModule = require("openai");
const OpenAI = OpenAIModule.default || OpenAIModule;

const MODEL = process.env.LLM_MODEL || "llama-3.3-70b-versatile";

let client = null;

// Key lazily read hoti hai, taaki dotenv load hone ke baad hi padhe
function getClient() {
    if (client) return client;
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return null;

    client = new OpenAI({
        apiKey,
        baseURL: "https://api.groq.com/openai/v1"
    });
    return client;
}

function isConfigured() {
    return !!process.env.GROQ_API_KEY;
}

async function complete(messages) {
    const c = getClient();
    if (!c) {
        const err = new Error("GROQ_API_KEY is not set on the server.");
        err.code = "LLM_NOT_CONFIGURED";
        throw err;
    }

    const res = await getClient().chat.completions.create({
       model: MODEL,
       messages,
       temperature:0.5,
       max_tokens: 2500,
       reasoning_effort: "low"
   });

    return res.choices?.[0]?.message?.content?.trim() || "";
}

module.exports = { complete, isConfigured, MODEL };
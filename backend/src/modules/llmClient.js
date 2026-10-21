const OpenAI = require("openai");

const MODEL = process.env.LLM_MODEL || "openai/gpt-oss-20b";
const BASE_URL = process.env.LLM_BASE_URL || "https://api.groq.com/openai/v1";
const TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS) || 30000;

let client = null;

function isConfigured() {
    return Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim());
}

function getClient() {
    if (!client) {
        client = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: BASE_URL,
            timeout: TIMEOUT_MS,
            maxRetries: 1
        });
    }
    return client;
}

async function complete(messages, { temperature = 0.5, maxTokens = 1200 } = {}) {
    if (!isConfigured()) {
        const err = new Error("GROQ_API_KEY is not configured on the server.");
        err.code = "LLM_NOT_CONFIGURED";
        throw err;
    }
    const res = await getClient().chat.completions.create({
        model: MODEL,
        messages,
        temperature,
        max_tokens: maxTokens
    });
    const text = res?.choices?.[0]?.message?.content;
    if (!text || !text.trim()) {
        throw new Error("LLM returned an empty response.");
    }
    return text.trim();
}

module.exports = { complete, isConfigured, MODEL };
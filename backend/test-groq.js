require("dotenv").config();
const OpenAI = require("openai");

console.log("Key loaded:", Boolean(process.env.GROQ_API_KEY));
console.log("Key starts with gsk_:", (process.env.GROQ_API_KEY || "").trim().startsWith("gsk_"));
console.log("Base URL:", process.env.LLM_BASE_URL || "(default groq)");
console.log("Model:", process.env.LLM_MODEL || "(default)");

const client = new OpenAI({
  apiKey: (process.env.GROQ_API_KEY || "").trim(),
  baseURL: process.env.LLM_BASE_URL || "https://api.groq.com/openai/v1",
  timeout: 20000,
  maxRetries: 0
});

client.chat.completions
  .create({
    model: process.env.LLM_MODEL || "openai/gpt-oss-20b",
    messages: [{ role: "user", content: "Say hello in one line" }],
    max_tokens: 500
  })
  .then((r) => console.log("SUCCESS:", r.choices[0].message.content))
  .catch((e) => console.log("FAILED:", e.status, e.code, e.message));
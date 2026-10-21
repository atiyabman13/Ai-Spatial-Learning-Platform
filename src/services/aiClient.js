import axios from "axios";
import { API_URL } from "../config/api";
import { queryLocalKnowledge } from "./localKnowledgeEngine";

const REQUEST_TIMEOUT_MS = 60000; // long enough for a sleeping Render server to wake up

const ENDPOINTS = {
    chat: "/api/ai/chat",
    quiz: "/api/ai/quiz",
    case_study: "/api/ai/case-study"
};

export function toHistory(messages = [], limit = 8) {
    return messages
        .map((m) => ({
            role: m.role === "assistant" || m.sender === "ai" ? "assistant" : "user",
            content: String(m.content ?? m.text ?? "")
        }))
        .filter((m) => m.content.trim())
        .slice(-limit);
}

export async function askAssistant({
    question,
    messages = [],
    activeModel = null,
    selectedPart = null,
    mode = "chat",
    role = "student"
}) {
    const history = toHistory(messages);

    try {
        const { data } = await axios.post(
            `${API_URL}${ENDPOINTS[mode] || ENDPOINTS.chat}`,
            { question, mode, context: { activeModel, selectedPart, role, history } },
            { timeout: REQUEST_TIMEOUT_MS }
        );
        return {
            answer: data.answer,
            provider: data.provider || "AI Tutor",
            actionCue: data.actionCue || null,
            offline: false,
            fallback: Boolean(data.fallback)
        };
    } catch (err) {
        console.warn("AI backend unreachable, using offline engine:", err.message);
        const local = queryLocalKnowledge(question, {
            activeModel,
            selectedPart,
            history: history.map((h) => ({ role: h.role, sender: h.role === "assistant" ? "ai" : "user", text: h.content }))
        });
        return {
            answer: local.answer,
            provider: "Local Knowledge Engine (offline)",
            actionCue: local.actionCue || null,
            offline: true,
            fallback: true
        };
    }
}
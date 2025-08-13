"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentChat = agentChat;
// agentOpenAIClient.ts
// OpenAI API client for ZED Agent Mode (with fallback)
const openai_1 = __importDefault(require("openai"));
const ollamaClient_1 = require("./ollamaClient");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = OPENAI_API_KEY ? new openai_1.default({ apiKey: OPENAI_API_KEY }) : null;
async function agentChat(prompt, history = [], ollamaModel = 'llama3-agent') {
    // Try OpenAI first if available
    if (openai) {
        try {
            const messages = history.map(m => ({ role: m.role, content: m.message }));
            messages.push({ role: 'user', content: prompt });
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages,
                max_tokens: 512,
                temperature: 0.7
            });
            return completion.choices[0]?.message?.content || '';
        }
        catch (err) {
            // Fallback to Ollama
        }
    }
    // Fallback: use Ollama's best agent model
    return (0, ollamaClient_1.ollamaChat)(prompt, history, ollamaModel);
}

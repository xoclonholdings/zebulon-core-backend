"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptiveChat = adaptiveChat;
const openai_1 = __importDefault(require("openai"));
const web_llm_1 = require("@mlc-ai/web-llm");
const CLOUD = "https://api.zebulonhub.xyz/v1";
let webllmInit = null;
async function tryCloud(messages) {
    const client = new openai_1.default({ baseURL: CLOUD, apiKey: "sk-local" });
    const r = await client.chat.completions.create({ model: "gpt-4", messages });
    return r.choices[0]?.message?.content ?? "";
}
async function tryWebLLM(messages) {
    if (!('gpu' in navigator))
        throw new Error("WebGPU unavailable");
    if (!webllmInit)
        webllmInit = (0, web_llm_1.CreateMLCEngine)("Llama-3.1-8B-Instruct-q4f16_1", { gpuInference: true });
    const engine = await webllmInit;
    const r = await engine.chat.completions.create({ messages, stream: false });
    return r.choices?.[0]?.message?.content ?? "";
}
async function adaptiveChat(messages) {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 3000);
    try {
        await fetch(CLOUD.replace("/v1", "/readyz"), { signal: ac.signal });
        clearTimeout(t);
        return await tryCloud(messages);
    }
    catch (_) {
        clearTimeout(t);
        try {
            return await tryWebLLM(messages);
        }
        catch (e) {
            throw new Error("No cloud and no WebGPU fallback available.");
        }
    }
}

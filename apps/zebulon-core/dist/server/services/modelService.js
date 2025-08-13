"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listOllamaModels = listOllamaModels;
exports.ollamaHealthCheck = ollamaHealthCheck;
exports.switchOllamaModel = switchOllamaModel;
// Ollama model service for listing, switching, and health checking models
const node_fetch_1 = __importDefault(require("node-fetch"));
const OLLAMA_BASE_URL = process.env.OLLAMA_API_URL?.replace(/\/api\/generate$/, '') || 'http://localhost:11434';
async function listOllamaModels() {
    const res = await (0, node_fetch_1.default)(`${OLLAMA_BASE_URL}/api/tags`);
    if (!res.ok)
        throw new Error('Failed to list Ollama models: ' + res.statusText);
    const data = (await res.json());
    return data.models || [];
}
async function ollamaHealthCheck() {
    try {
        const res = await (0, node_fetch_1.default)(`${OLLAMA_BASE_URL}/api/health`);
        if (!res.ok)
            return { ok: false, status: res.status };
        return { ok: true };
    }
    catch (e) {
        return { ok: false, error: e.message };
    }
}
async function switchOllamaModel(model) {
    // No explicit switch endpoint; just use the model in chat calls
    // This is a placeholder for future logic (e.g., preloading, validation)
    return { ok: true, model };
}

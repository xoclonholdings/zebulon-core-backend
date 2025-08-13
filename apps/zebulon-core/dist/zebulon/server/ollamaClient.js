"use strict";
// ollamaClient.ts
// Simple Ollama API client for ZED backend
// Use native fetch (Node 18+)
Object.defineProperty(exports, "__esModule", { value: true });
exports.ollamaChat = ollamaChat;
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';
async function ollamaChat(prompt, history = [], model = 'llama3') {
    // Compose Ollama API request
    const messages = history.map(m => ({ role: m.role, content: m.message }));
    messages.push({ role: 'user', content: prompt });
    const body = {
        model,
        messages,
        stream: false
    };
    const res = await fetch(OLLAMA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!res.ok)
        throw new Error('Ollama API error: ' + res.statusText);
    const data = await res.json();
    // Ollama returns { message: { content: string } }
    return data?.message?.content || '';
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ollamaChatWithMemory = ollamaChatWithMemory;
exports.ollamaSummarize = ollamaSummarize;
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';
async function ollamaChatWithMemory(messages, model = 'llama3') {
    // Compose Ollama API request
    const apiMessages = messages.map(m => ({ role: m.role, content: m.content }));
    const body = {
        model,
        messages: apiMessages,
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
    return data?.message?.content || '';
}
async function ollamaSummarize(messages, model = 'llama3') {
    // Summarize conversation using Ollama
    const summaryPrompt = [
        ...messages,
        { role: 'user', content: 'Summarize this conversation in 2-3 sentences for future context.' }
    ];
    return ollamaChatWithMemory(summaryPrompt, model);
}

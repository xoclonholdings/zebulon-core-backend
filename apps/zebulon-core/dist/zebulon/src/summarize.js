"use strict";
// src/summarize.ts
// Conversation summarization for Zed AI persistent memory/feedback
// Uses OpenAI or Ollama for summarization, depending on provider
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizeConversation = summarizeConversation;
async function summarizeConversation(messages, options) {
    const text = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    if (options.provider === 'openai') {
        // Placeholder: implement OpenAI summarization
        throw new Error('OpenAI summarization not implemented');
    }
    else if (options.provider === 'ollama') {
        // Placeholder: implement Ollama summarization
        throw new Error('Ollama summarization not implemented');
    }
    throw new Error('Unknown provider');
}

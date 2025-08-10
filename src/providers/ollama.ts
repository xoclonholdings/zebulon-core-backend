// src/providers/ollama.ts
// Provider for Ollama chat and summarization for Zed AI
import { Message } from '../memory';

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';

export async function ollamaChatWithMemory(messages: Message[], model: string = 'llama3'): Promise<string> {
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
  if (!res.ok) throw new Error('Ollama API error: ' + res.statusText);
  const data = await res.json();
  return data?.message?.content || '';
}

export async function ollamaSummarize(messages: Message[], model: string = 'llama3'): Promise<string> {
  // Summarize conversation using Ollama
  const summaryPrompt: Message[] = [
    ...messages,
    { role: 'user', content: 'Summarize this conversation in 2-3 sentences for future context.' }
  ];
  return ollamaChatWithMemory(summaryPrompt, model);
}

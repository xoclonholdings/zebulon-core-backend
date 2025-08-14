import { ChatMessage } from '@shared/zed';
import { ChatOptions, AIProvider, ChatStream } from './types.js';

const LOCALAI_URL = process.env.LOCALAI_URL || 'http://localhost:8080';
const ZED_MODEL = process.env.ZED_MODEL || 'llama3';

export const LocalAIProvider: AIProvider = {
  async chat(messages: ChatMessage[], options: ChatOptions = {}) {
    const res = await fetch(`${LOCALAI_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: options.model || ZED_MODEL,
        messages,
        ...options,
      }),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    // OpenAI/LocalAI compatible response
    return data.choices?.[0]?.message?.content || data.choices?.[0]?.text || '';
  },

  async chatStream(messages: ChatMessage[], options: ChatOptions & { stream: true }, stream: ChatStream) {
    const res = await fetch(`${LOCALAI_URL}/v1/chat/completions/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: options.model || ZED_MODEL,
        messages,
        ...options,
      }),
    });
    if (!res.body) throw new Error('No response body');
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) stream.onToken(decoder.decode(value));
    }
    stream.onEnd();
  },
};

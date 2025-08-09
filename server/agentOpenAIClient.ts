// agentOpenAIClient.ts
// OpenAI API client for ZED Agent Mode (with fallback)
import OpenAI from 'openai';
import { ollamaChat } from './ollamaClient';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

export async function agentChat(prompt: string, history: any[] = [], ollamaModel: string = 'llama3-agent'): Promise<string> {
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
    } catch (err) {
      // Fallback to Ollama
    }
  }
  // Fallback: use Ollama's best agent model
  return ollamaChat(prompt, history, ollamaModel);
}

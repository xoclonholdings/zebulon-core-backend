
import { OllamaProvider } from './ollama.js';
import { LocalAIProvider } from './localai.js';
import { AIProvider } from './types.js';

export function getAI(): AIProvider {
	// Prefer LocalAI if LOCALAI_URL is set, else fallback to Ollama
	if (process.env.LOCALAI_URL) return LocalAIProvider;
	return OllamaProvider;
}

export * from './types.js';

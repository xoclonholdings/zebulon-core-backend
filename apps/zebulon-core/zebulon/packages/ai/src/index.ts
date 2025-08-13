
import { OllamaProvider } from './ollama';
import { LocalAIProvider } from './localai';
import { AIProvider } from './types';

export function getAI(): AIProvider {
	// Prefer LocalAI if LOCALAI_URL is set, else fallback to Ollama
	if (process.env.LOCALAI_URL) return LocalAIProvider;
	return OllamaProvider;
}

export * from './types';

import { OllamaProvider } from './ollama';
import { AIProvider } from './types';
import { ChatMessage } from '@shared/zed';

export function getAI(): AIProvider {
	const provider = process.env.AI_PROVIDER || 'ollama';
	if (provider === 'ollama') return OllamaProvider;
	throw new Error(`Unknown AI_PROVIDER: ${provider}`);
}

export * from './types';

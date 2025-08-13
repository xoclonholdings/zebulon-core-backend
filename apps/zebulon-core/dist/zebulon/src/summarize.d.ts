import type { Message } from './memory';
export interface SummarizerOptions {
    provider: 'openai' | 'ollama';
    apiKey?: string;
    model?: string;
}
export declare function summarizeConversation(messages: Message[], options: SummarizerOptions): Promise<string>;

import { Message } from '../memory';
export declare function ollamaChatWithMemory(messages: Message[], model?: string): Promise<string>;
export declare function ollamaSummarize(messages: Message[], model?: string): Promise<string>;

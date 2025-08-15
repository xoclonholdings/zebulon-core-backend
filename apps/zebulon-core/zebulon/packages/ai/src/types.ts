import { ChatMessage } from '../../shared/src/zed.js';

export interface ChatOptions {
	model?: string;
	stream?: boolean;
	[key: string]: any;
}

export interface ChatStream {
	onToken: (token: string) => void;
	onEnd: () => void;
	onError: (err: Error) => void;
}

export interface AIProvider {
	chat(messages: ChatMessage[], options?: ChatOptions): Promise<string>;
	chatStream?(messages: ChatMessage[], options: ChatOptions & { stream: true }, stream: ChatStream): Promise<void>;
}

interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: string;
    source?: string;
}
export declare function useChatMinimal(): {
    messages: Message[];
    isLoading: boolean;
    sendMessage: (content: string) => Promise<void>;
    clearMessages: () => void;
    isStreaming: boolean;
    streamingMessage: string;
    stopStreaming: () => void;
};
export {};

export declare function useChat(conversationId?: string): {
    sendMessage: (content: string) => Promise<void>;
    appendMessage: (content: string, role: "user" | "assistant", metadata?: any) => Promise<void>;
    stopStreaming: () => void;
    isStreaming: boolean;
    streamingMessage: string;
};

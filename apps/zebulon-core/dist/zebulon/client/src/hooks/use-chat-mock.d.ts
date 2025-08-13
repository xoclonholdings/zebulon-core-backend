export declare function useChatMock(): {
    messages: {
        id: string;
        message: string;
        timestamp: string;
        source: string;
        isUser: boolean;
    }[];
    isLoading: boolean;
    sendMessage: (message: string) => Promise<void>;
    clearMessages: () => void;
};

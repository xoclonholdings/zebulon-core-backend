export declare function getAI(): {
    name: string;
    chat: (...args: any[]) => Promise<{
        reply: string;
    }>;
    chatStream: (...args: any[]) => AsyncGenerator<{
        reply: string;
    }, void, unknown>;
};

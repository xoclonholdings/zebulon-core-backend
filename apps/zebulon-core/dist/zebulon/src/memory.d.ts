export type Message = {
    role: "user" | "assistant";
    content: string;
};
export declare function ensureUser(userId: string): void;
export declare function ensureSession(sessionId: string, userId: string, title?: string): void;
export declare function addMessage(sessionId: string, role: "user" | "assistant", content: string): number;
export declare function getRecentContext(sessionId: string, limit?: number): {
    role: "user" | "assistant";
    content: string;
}[];
export declare function getSummary(sessionId: string): string;
export declare function setSummary(sessionId: string, summary: string): void;
export declare function addFeedback(sessionId: string, messageId: number, rating: 1 | -1, note?: string): void;
export declare function getUserStyle(userId: string): {
    terse: number;
    formal: number;
    steps: number;
};

export declare function getUserMemory(userId: string): {
    role: "user" | "assistant";
    message: string;
}[];
export declare function appendUserMemory(userId: string, role: 'user' | 'assistant', message: string): void;

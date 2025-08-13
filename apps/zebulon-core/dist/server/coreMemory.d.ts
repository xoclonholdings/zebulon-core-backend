type MemoryEntry = {
    role: 'user' | 'assistant';
    message: string;
    tags?: string[];
    timestamp?: string;
};
export declare function getUserMemory(userId: string, opts?: {
    tag?: string;
    limit?: number;
}): MemoryEntry[];
export declare function appendUserMemory(userId: string, role: 'user' | 'assistant', message: string, tags?: string[]): void;
export declare function clearUserMemory(userId: string): void;
export declare function searchUserMemory(userId: string, query: string): MemoryEntry[];
export {};

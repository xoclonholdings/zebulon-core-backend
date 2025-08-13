import { Request } from "express";
export declare function getSessionId(req: Request): string;
export declare function appendMessage(req: Request, role: 'user' | 'assistant', message: string): void;
export declare function getHistory(req: Request): {
    role: "user" | "assistant";
    message: string;
}[];
export declare function clearHistory(req: Request): void;

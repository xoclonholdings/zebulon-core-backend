export declare function ollamaChat(prompt: string, history?: any[], model?: string, opts?: {
    stream?: boolean;
    onToken?: (token: string) => void;
}): Promise<string>;
export declare function listOllamaModels(): Promise<any[]>;
export declare function ollamaHealthCheck(): Promise<{
    ok: boolean;
    status: number;
    error?: undefined;
} | {
    ok: boolean;
    status?: undefined;
    error?: undefined;
} | {
    ok: boolean;
    error: string;
    status?: undefined;
}>;
export declare function switchOllamaModel(model: string): Promise<{
    ok: boolean;
    model: string;
}>;

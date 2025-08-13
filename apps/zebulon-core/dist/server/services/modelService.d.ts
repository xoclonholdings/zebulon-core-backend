export declare function listOllamaModels(): Promise<any[]>;
export declare function ollamaHealthCheck(): Promise<{
    ok: boolean;
    status: any;
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

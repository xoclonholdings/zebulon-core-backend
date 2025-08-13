export type ZedLiteContext = {
    [key: string]: any;
};
export declare function ask(prompt: string): Promise<string>;
export declare function summarize(content: string): Promise<string>;
export declare function suggestNextStep(ctx: ZedLiteContext): Promise<string>;
export declare function useZedLite(): {
    ask: typeof ask;
    summarize: typeof summarize;
    suggestNextStep: typeof suggestNextStep;
};

export type ZedContext = {
    [key: string]: any;
};
export declare function ask(prompt: string): Promise<string>;
export declare function summarize(content: string): Promise<string>;
export declare function suggestNextStep(ctx: ZedContext): Promise<string>;
export declare function useZed(): {
    ask: typeof ask;
    summarize: typeof summarize;
    suggestNextStep: typeof suggestNextStep;
};

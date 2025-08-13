export type ZedClientOpts = {
    baseUrl: string;
    tokenProvider: () => Promise<string>;
};
export declare class ZedClient {
    private opts;
    constructor(opts: ZedClientOpts);
    ask(prompt: string, context?: any): Promise<any>;
    summarize(text: string): Promise<any>;
    suggestNextStep(ctx: any): Promise<any>;
}

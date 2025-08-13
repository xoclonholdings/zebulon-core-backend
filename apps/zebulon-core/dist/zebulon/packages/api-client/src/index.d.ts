export type TokenProvider = () => Promise<string> | string;
export declare class Api {
    private base;
    private getToken?;
    constructor(base: string, getToken?: TokenProvider | undefined);
    private call;
    get<T>(p: string): Promise<T>;
    post<T>(p: string, body: any): Promise<T>;
}

export interface ZebulonApp {
    id: string;
    name: string;
    init?: (ctx: any) => Promise<void>;
    routes?: (router: any, ctx: any) => void;
    ui?: {
        admin?: string;
        user?: string;
    };
    permissions?: string[];
}
export declare function registerApp(app: ZebulonApp): void;
export declare function getApps(): ZebulonApp[];

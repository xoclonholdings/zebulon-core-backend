export declare function useZeta(getToken?: any): {
    events: any;
    status: any;
    scan: (target: string) => Promise<unknown>;
    toggle: () => Promise<unknown>;
};

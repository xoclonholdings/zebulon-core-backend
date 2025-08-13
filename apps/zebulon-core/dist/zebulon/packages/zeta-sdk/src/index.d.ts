export declare function scan(target: any): Promise<any>;
export declare function events(): Promise<any[]>;
export declare function fanflux(): Promise<any>;
export declare function useZeta(): {
    scan: typeof scan;
    events: typeof events;
    fanflux: typeof fanflux;
};

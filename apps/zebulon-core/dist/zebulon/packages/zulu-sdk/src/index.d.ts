export declare function diagnose(): Promise<any>;
export declare function repair(task: any): Promise<any>;
export declare function useZulu(): {
    diagnose: typeof diagnose;
    repair: typeof repair;
};

export declare function createProject(): Promise<any>;
export declare function runAutomation(): Promise<any>;
export declare function useZYNC(): {
    createProject: typeof createProject;
    runAutomation: typeof runAutomation;
};

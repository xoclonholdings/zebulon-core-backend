export declare function useZync(getToken?: any): {
    repos: any;
    builds: any;
    runBuild: (repoId: string) => Promise<unknown>;
    deploy: (repoId: string) => Promise<unknown>;
};

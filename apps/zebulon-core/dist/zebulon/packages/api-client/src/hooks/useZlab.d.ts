export declare function useZlab(getToken?: any): {
    projects: any;
    tasks: any;
    createProject: (name: string) => Promise<unknown>;
    createTask: (p: {
        title: string;
        projectId: string;
    }) => Promise<unknown>;
    updateTask: (id: string, patch: any) => Promise<unknown>;
};

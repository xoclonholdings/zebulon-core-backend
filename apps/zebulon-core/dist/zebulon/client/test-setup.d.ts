export declare function waitForServers({ vitePort, backendPort, backendHealthPath, }?: {
    vitePort?: number | undefined;
    backendPort?: number | undefined;
    backendHealthPath?: string | undefined;
}): Promise<void>;

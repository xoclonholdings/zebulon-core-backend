export declare function useAuth(): {
    user: unknown;
    isLoading: boolean;
    isAuthenticated: boolean;
    refetch: (options?: import("@tanstack/react-query").RefetchOptions) => Promise<import("@tanstack/react-query").QueryObserverResult<unknown, Error>>;
};

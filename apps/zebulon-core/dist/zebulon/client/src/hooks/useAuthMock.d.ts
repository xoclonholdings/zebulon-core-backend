export declare function useAuthMock(): {
    user: {
        username: string;
    } | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<{
        success: boolean;
        reason?: undefined;
    } | {
        success: boolean;
        reason: string;
    }>;
    logout: () => void;
    refetch: () => void;
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = useAuth;
const react_query_1 = require("@tanstack/react-query");
const queryClient_1 = require("@/lib/queryClient");
function useAuth() {
    const { data: user, isLoading, error, refetch } = (0, react_query_1.useQuery)({
        queryKey: ["/api/auth/user"],
        queryFn: (0, queryClient_1.getQueryFn)({ on401: "returnNull" }),
        retry: false,
        staleTime: 0, // Always check freshness
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });
    // Debug logging for authentication state
    if (import.meta.env.MODE === 'development') {
        console.log('Auth State:', { user, isLoading, error: error?.message, isAuthenticated: !!user && !error });
    }
    return {
        user,
        isLoading,
        isAuthenticated: !!user && !error,
        refetch,
    };
}

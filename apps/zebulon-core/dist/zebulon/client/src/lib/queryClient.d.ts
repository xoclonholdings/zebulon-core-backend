import { QueryClient, QueryFunction } from "@tanstack/react-query";
export declare function apiRequest(url: string, method?: string, data?: unknown | undefined): Promise<any>;
type UnauthorizedBehavior = "returnNull" | "throw";
export declare const getQueryFn: <T>(options: {
    on401: UnauthorizedBehavior;
}) => QueryFunction<T>;
export declare const queryClient: QueryClient;
export {};

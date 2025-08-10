import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

export function useAuth() {
  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
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
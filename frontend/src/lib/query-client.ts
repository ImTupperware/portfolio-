import { QueryClient } from "@tanstack/react-query";

/**
 * Enterprise QueryClient configured with stale-while-revalidate defaults,
 * request deduplication, and non-retry rules for client/authorization errors.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Stale-While-Revalidate: serve cached data immediately while fetching in background
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 15 * 60 * 1000, // 15 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: "always",
        refetchOnMount: true,
        // Request deduplication: identical concurrent queries share the exact same promise
        retry: (failureCount, error: unknown) => {
          if (error && typeof error === "object" && "status" in error) {
            const status = (error as { status: number }).status;
            // Never retry 4xx errors (client faults, anti-IDOR 403, 404, 422)
            if (status >= 400 && status < 500) {
              return false;
            }
          }
          return failureCount < 4;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      },
      mutations: {
        retry: 0, // Mutations should never blindly retry to prevent duplicate side effects
      },
    },
  });
}

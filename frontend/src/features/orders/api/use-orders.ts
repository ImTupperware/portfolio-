import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  OrderFilterParams,
  PaginatedOrdersResponse,
  PaginatedOrdersResponseSchema,
} from "../schemas/order.schema";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (params: OrderFilterParams) => [...orderKeys.lists(), params] as const,
};

/**
 * Custom TanStack Query hook encapsulating all order fetching,
 * request deduplication, SWR caching, and Zod response validation.
 */
export function useOrders(params: OrderFilterParams = {}) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: async (): Promise<PaginatedOrdersResponse> => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set("page", String(params.page));
      if (params.perPage) searchParams.set("per_page", String(params.perPage));
      if (params.status && params.status !== "all") searchParams.set("status", params.status);
      if (params.q && params.q.trim() !== "") searchParams.set("q", params.q.trim());

      const qs = searchParams.toString();
      const raw = await apiClient<PaginatedOrdersResponse>(
        `/orders${qs ? `?${qs}` : ""}`
      );

      return PaginatedOrdersResponseSchema.parse(raw);
    },
    placeholderData: keepPreviousData, // Smooth pagination & filtering transitions
  });
}

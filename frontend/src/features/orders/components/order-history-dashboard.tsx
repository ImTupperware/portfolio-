"use client";

import React from "react";
import { useUrlState } from "@/hooks/use-url-state";
import { useOrders } from "../api/use-orders";
import { OrderSearchInput } from "./order-search-input";
import { OrderFilterTabs } from "./order-filter-tabs";
import { OrderRow } from "./order-row";
import { VirtualizedOrderList } from "./virtualized-order-list";
import { OrderSkeletonList } from "./order-skeleton-list";
import { OrderEmptyState } from "./order-empty-state";
import { OrderPagination } from "./order-pagination";
import { ErrorFallback } from "@/components/common/error-fallback";

export function OrderHistoryDashboard() {
  // Layer 1: URL State (Search, status, and pagination synchronized with URL)
  const { state: urlState, setUrlParams } = useUrlState();

  // Layer 2: Server State via TanStack Query
  const { data, isLoading, isFetching, isError, error, refetch } = useOrders({
    q: urlState.search,
    status: urlState.status,
    page: urlState.page,
    perPage: 60, // set to 60 to verify virtualization (>50 items)
  });

  const orders = data?.data || [];
  const meta = data?.meta;
  const hasFilters = Boolean(urlState.search || (urlState.status && urlState.status !== "all"));

  if (isError) {
    return (
      <ErrorFallback
        title="Failed to Load Orders"
        message={error instanceof Error ? error.message : "Unable to retrieve order history."}
        onReset={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search & Status Filter */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <OrderSearchInput
          initialValue={urlState.search || ""}
          onSearchChange={(q) => setUrlParams({ search: q || undefined, page: 1 })}
        />
        <OrderFilterTabs
          currentStatus={urlState.status || "all"}
          onStatusSelect={(status) => setUrlParams({ status, page: 1 })}
        />
      </div>

      {/* Loading Skeleton States (Initial load & Background Refetch) */}
      {isLoading ? (
        <OrderSkeletonList count={6} />
      ) : isFetching && orders.length === 0 ? (
        <OrderSkeletonList count={4} isRefetching />
      ) : orders.length === 0 ? (
        <OrderEmptyState
          hasFilters={hasFilters}
          onResetFilters={() => setUrlParams({ search: undefined, status: undefined, page: 1 })}
        />
      ) : (
        <div className="space-y-4">
          {isFetching && (
            <div className="text-[11px] font-mono text-cyan-400 animate-pulse flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span>Synchronizing latest telemetry...</span>
            </div>
          )}

          {/* Virtualize lists exceeding 50 items */}
          {orders.length > 50 ? (
            <VirtualizedOrderList orders={orders} />
          ) : (
            <div className="space-y-2.5">
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </div>
          )}

          {meta && (
            <OrderPagination
              currentPage={meta.current_page}
              lastPage={meta.last_page}
              total={meta.total}
              onPageChange={(page) => setUrlParams({ page })}
            />
          )}
        </div>
      )}
    </div>
  );
}

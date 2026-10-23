import React from "react";

interface OrderSkeletonListProps {
  count?: number;
  isRefetching?: boolean;
}

export function OrderSkeletonList({ count = 5, isRefetching = false }: OrderSkeletonListProps) {
  return (
    <div className="space-y-3">
      {isRefetching && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-[11px] font-mono text-cyan-400">
          <span>Refreshing order telemetry in background...</span>
          <span className="animate-spin h-3 w-3 border-2 border-cyan-400 border-t-transparent rounded-full" />
        </div>
      )}

      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-zinc-800" />
            <div className="space-y-1.5">
              <div className="h-4 w-32 rounded bg-zinc-800" />
              <div className="h-3 w-48 rounded bg-zinc-800/60" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-5 w-20 rounded-full bg-zinc-800" />
            <div className="h-4 w-16 rounded bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

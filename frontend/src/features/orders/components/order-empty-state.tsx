import React from "react";
import { Inbox, RotateCcw } from "lucide-react";

interface OrderEmptyStateProps {
  hasFilters: boolean;
  onResetFilters: () => void;
}

export function OrderEmptyState({ hasFilters, onResetFilters }: OrderEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-zinc-800 bg-zinc-900/30 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-400 mb-3">
        <Inbox className="h-6 w-6" />
      </div>
      <h4 className="text-base font-bold text-white">No Matching Orders Found</h4>
      <p className="mt-1 max-w-sm text-xs text-zinc-400 leading-relaxed">
        {hasFilters
          ? "No telemetry records matched the current search criteria or status filter."
          : "Your account currently has zero recorded order transactions."}
      </p>
      {hasFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-700 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
          <span>Reset All Filters</span>
        </button>
      )}
    </div>
  );
}

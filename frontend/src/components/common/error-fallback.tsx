"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  correlationId?: string;
  onReset?: () => void;
}

export function ErrorFallback({
  title = "Component Rendering Error",
  message = "An unexpected error occurred while rendering this interface section.",
  correlationId,
  onReset,
}: ErrorFallbackProps) {
  return (
    <div
      role="alert"
      className="my-4 rounded-2xl border border-red-500/30 bg-red-950/20 p-6 text-center backdrop-blur-md"
    >
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
        <AlertTriangle className="h-6 w-6" />
      </div>

      <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>

      <p className="mt-1.5 max-w-md mx-auto text-xs leading-relaxed text-zinc-400">
        {message}
      </p>

      {correlationId && (
        <p className="mt-2 font-mono text-[11px] text-zinc-500">
          Ref ID: <span className="text-zinc-400">{correlationId}</span>
        </p>
      )}

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-700 hover:text-white active:scale-95"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry Operation</span>
        </button>
      )}
    </div>
  );
}

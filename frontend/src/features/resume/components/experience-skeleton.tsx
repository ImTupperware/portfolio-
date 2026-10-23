import React from "react";

export function ExperienceSkeleton() {
  return (
    <div className="relative pl-8 pb-10 border-l border-zinc-800 animate-pulse">
      <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-zinc-800" />
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="h-6 w-1/3 rounded bg-zinc-800" />
          <div className="h-4 w-28 rounded bg-zinc-800" />
        </div>
        <div className="mt-2 h-4 w-1/4 rounded bg-zinc-800/80" />
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full rounded bg-zinc-800/60" />
          <div className="h-4 w-5/6 rounded bg-zinc-800/60" />
        </div>
        <div className="mt-4 flex gap-2">
          <div className="h-6 w-16 rounded bg-zinc-800" />
          <div className="h-6 w-20 rounded bg-zinc-800" />
          <div className="h-6 w-14 rounded bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}

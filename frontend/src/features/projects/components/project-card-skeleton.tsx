import React from "react";

export function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 animate-pulse">
      <div className="h-48 w-full rounded-xl bg-zinc-800" />
      <div className="mt-5 flex items-center justify-between">
        <div className="h-6 w-3/4 rounded-md bg-zinc-800" />
        <div className="h-5 w-12 rounded-full bg-zinc-800" />
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-4 w-full rounded bg-zinc-800/80" />
        <div className="h-4 w-5/6 rounded bg-zinc-800/80" />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <div className="h-6 w-16 rounded-md bg-zinc-800" />
        <div className="h-6 w-20 rounded-md bg-zinc-800" />
        <div className="h-6 w-14 rounded-md bg-zinc-800" />
      </div>
      <div className="mt-6 flex items-center justify-between pt-4 border-t border-zinc-800/80">
        <div className="h-4 w-20 rounded bg-zinc-800" />
        <div className="h-4 w-24 rounded bg-zinc-800" />
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useUrlState } from "@/hooks/use-url-state";
import { useProjectsQuery } from "../api/use-projects";
import { ProjectCard } from "./project-card";
import { ProjectCardSkeleton } from "./project-card-skeleton";
import { VirtualizedProjectList } from "./virtualized-project-list";
import { ErrorBoundary } from "@/components/common/error-boundary";
import { FolderGit2, ChevronLeft, ChevronRight } from "lucide-react";

export function ProjectGrid() {
  const { state: urlState, setUrlParams } = useUrlState();

  const { data, isLoading, isError, error, refetch } = useProjectsQuery({
    page: urlState.page,
    perPage: 12,
    tag: urlState.tag,
  });

  const categories = ["All", "Next.js 15", "React 19", "Laravel", "Supabase", "TypeScript", "Python"];

  return (
    <ErrorBoundary fallbackTitle="Unable to load projects" onReset={() => refetch()}>
      <section id="projects" className="py-12 sm:py-16 border-t border-white/[0.08]">
        <div className="mb-8 sm:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-5 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-950/50 px-3 py-1 text-[11px] sm:text-xs font-semibold text-sky-300 mb-2.5 sm:mb-3 shadow-sm shadow-sky-950/40">
              <FolderGit2 className="h-3.5 w-3.5 text-sky-400" />
              <span>Flagship Systems &amp; Software</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Featured Projects
            </h2>
            <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-slate-400 max-w-2xl font-normal">
              Production systems, offline-first retail PWAs with hardware thermal printing, and multi-tenant SaaS architectures built with Next.js 15, React 19, and Laravel 12.
            </p>
          </div>

          {/* Swipeable category filters on mobile */}
          <div className="flex overflow-x-auto no-scrollbar pb-1 sm:flex-wrap gap-2 text-xs -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => {
              const active = cat === "All" ? !urlState.tag : urlState.tag === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setUrlParams({ tag: cat === "All" ? undefined : cat, page: 1 })}
                  className={`shrink-0 sm:shrink rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2 font-semibold transition-all duration-200 active:scale-95 ${
                    active
                      ? "bg-gradient-to-r from-sky-400 to-indigo-500 text-slate-950 font-bold shadow-lg shadow-sky-500/20"
                      : "border border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20 hover:bg-slate-800/80 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {isLoading && !data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        )}

        {isError && !data && (
          <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-6 text-center text-sm text-red-400">
            Failed to fetch projects: {error?.message || "Internal server error"}
          </div>
        )}

        {data && (
          <>
            {data.data.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-12 text-center text-slate-400 backdrop-blur-md">
                <FolderGit2 className="mx-auto h-10 w-10 text-slate-600 mb-3" />
                <p className="text-sm font-medium text-slate-300">No projects found matching filter &quot;{urlState.tag}&quot;.</p>
                <button
                  type="button"
                  onClick={() => setUrlParams({ tag: undefined, page: 1 })}
                  className="mt-3 text-xs text-sky-400 hover:underline"
                >
                  Clear filter
                </button>
              </div>
            ) : data.data.length > 50 ? (
              <VirtualizedProjectList projects={data.data} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                {data.data.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}

            {data.meta.last_page > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3 text-xs font-semibold">
                <button
                  type="button"
                  disabled={data.meta.current_page <= 1}
                  onClick={() => setUrlParams({ page: data.meta.current_page - 1 })}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-slate-300 disabled:opacity-40 hover:bg-slate-800 hover:text-white transition active:scale-95 shadow-md"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Previous
                </button>
                <span className="text-slate-400 px-2">
                  Page {data.meta.current_page} of {data.meta.last_page}
                </span>
                <button
                  type="button"
                  disabled={data.meta.current_page >= data.meta.last_page}
                  onClick={() => setUrlParams({ page: data.meta.current_page + 1 })}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-slate-300 disabled:opacity-40 hover:bg-slate-800 hover:text-white transition active:scale-95 shadow-md"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </ErrorBoundary>
  );
}

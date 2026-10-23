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
      <section id="projects" className="py-14 border-t border-slate-800/80">
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-950/40 px-3 py-1 text-xs font-medium text-sky-300 mb-3">
              <FolderGit2 className="h-3.5 w-3.5 text-sky-400" />
              <span>Featured Work</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Featured Projects
            </h2>
            <p className="mt-2 text-base text-slate-400 max-w-2xl">
              Full-stack web applications, offline-first PWAs, and multi-tenant SaaS systems built with Next.js 15, React 19, Laravel 12, and Supabase.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {categories.map((cat) => {
              const active = cat === "All" ? !urlState.tag : urlState.tag === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setUrlParams({ tag: cat === "All" ? undefined : cat, page: 1 })}
                  className={`rounded-lg px-3.5 py-1.5 font-medium transition ${
                    active
                      ? "bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20"
                      : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-6 text-center text-sm text-red-400">
            Failed to fetch projects: {error?.message || "Internal server error"}
          </div>
        )}

        {!isLoading && !isError && data && (
          <>
            {data.data.length === 0 ? (
              <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-12 text-center text-slate-400">
                No projects found matching filter &quot;{urlState.tag}&quot;.
              </div>
            ) : data.data.length > 50 ? (
              <VirtualizedProjectList projects={data.data} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.data.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}

            {data.meta.last_page > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3 text-xs font-medium">
                <button
                  type="button"
                  disabled={data.meta.current_page <= 1}
                  onClick={() => setUrlParams({ page: data.meta.current_page - 1 })}
                  className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-slate-200 disabled:opacity-40 hover:bg-slate-700"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Previous
                </button>
                <span className="text-slate-400">
                  Page {data.meta.current_page} of {data.meta.last_page}
                </span>
                <button
                  type="button"
                  disabled={data.meta.current_page >= data.meta.last_page}
                  onClick={() => setUrlParams({ page: data.meta.current_page + 1 })}
                  className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-slate-200 disabled:opacity-40 hover:bg-slate-700"
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

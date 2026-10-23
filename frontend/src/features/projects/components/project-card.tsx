"use client";

import React, { useState } from "react";
import { ExternalLink, Code2, Eye, Edit2, EyeOff, Globe, Smartphone } from "lucide-react";
import { Project } from "../schemas/project.schema";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { EditProjectModal } from "./edit-project-modal";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isEditMode = useAuthStore((state) => state.isEditMode);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900/50 p-6 sm:p-7 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/80 hover:shadow-2xl shadow-lg">
        {isEditMode && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-950/80 px-2.5 py-1 text-xs font-semibold text-amber-300 shadow-md backdrop-blur-md transition hover:bg-amber-900/90"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit</span>
          </button>
        )}

        <div>
          <div className="relative mb-5 h-48 w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800/60">
            {project.thumbnail_url ? (
              <img
                src={project.thumbnail_url}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-xs font-medium text-slate-500">
                Architectural Demonstration
              </div>
            )}
            {project.featured && (
              <span className="absolute top-3 right-3 rounded-full border border-sky-500/30 bg-sky-950/90 px-3 py-1 text-xs font-semibold text-sky-300 backdrop-blur-md shadow-sm">
                Featured
              </span>
            )}
            {isEditMode && project.status !== "published" && (
              <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-950/90 px-3 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md shadow-sm">
                <EyeOff className="h-3 w-3" />
                <span>{project.status === "draft" ? "Draft (Hidden)" : "Archived"}</span>
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-sky-400 transition-colors">
            {project.title}
          </h3>

          <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-slate-300">
            {project.summary}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-slate-700/60 bg-slate-800/60 px-2.5 py-1 text-xs text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <Eye className="h-3.5 w-3.5 text-slate-400" />
            {project.views_count.toLocaleString()} views
          </span>

          <div className="flex flex-wrap items-center gap-3 font-medium">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-slate-300 hover:text-white transition"
                aria-label="View Source Code"
              >
                <Code2 className="h-4 w-4" />
                <span>Code</span>
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-950/40 px-2.5 py-1 text-xs font-semibold text-sky-400 hover:bg-sky-900/60 hover:text-sky-300 transition"
                title="View Website"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>Website</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            )}
            {project.app_url && (
              <a
                href={project.app_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-950/40 px-2.5 py-1 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/60 hover:text-indigo-200 transition"
                title="View App Demo"
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span>App Demo</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            )}
          </div>
        </div>
      </article>

      {isEditing && (
        <EditProjectModal
          project={project}
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
}

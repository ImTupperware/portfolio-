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
      <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/50 p-6 sm:p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-500/40 hover:bg-slate-900/80 hover:shadow-2xl hover:shadow-sky-500/10 shadow-lg">
        {/* Specular inner top highlight line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {isEditMode && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-950/80 px-2.5 py-1 text-xs font-semibold text-amber-300 shadow-md backdrop-blur-md transition hover:bg-amber-900/90"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit</span>
          </button>
        )}

        <div>
          {/* Card Thumbnail / Header Image */}
          <div className="relative mb-5 h-52 w-full overflow-hidden rounded-xl bg-slate-950 border border-white/10 group-hover:border-white/20 transition-colors">
            {project.thumbnail_url ? (
              <img
                src={project.thumbnail_url}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-xs font-medium text-slate-500">
                <div className="absolute inset-0 bg-grid-subtle opacity-40" />
                <div className="z-10 flex flex-col items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center text-sky-400">
                    <Globe className="h-5 w-5" />
                  </div>
                  <span className="text-slate-400 font-semibold tracking-wider uppercase text-[10px]">
                    Production System
                  </span>
                </div>
              </div>
            )}

            {/* Badges Overlay */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              {project.featured && (
                <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/40 bg-sky-950/85 px-3 py-1 text-[11px] font-bold text-sky-300 backdrop-blur-md shadow-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
                  Featured
                </span>
              )}
            </div>

            {isEditMode && project.status !== "published" && (
              <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-950/90 px-3 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md shadow-sm">
                <EyeOff className="h-3 w-3" />
                <span>{project.status === "draft" ? "Draft" : "Archived"}</span>
              </span>
            )}
          </div>

          {/* Title & Description */}
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors">
            {project.title}
          </h3>

          <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-slate-300 font-normal">
            {project.summary}
          </p>

          {/* Technology Badges */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-white/[0.08] bg-slate-800/50 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition hover:bg-slate-700/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Card Footer Action Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium text-slate-400">
            <Eye className="h-3.5 w-3.5 text-slate-500" />
            <span>{project.views_count.toLocaleString()} views</span>
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-800/80 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition active:scale-95"
                title="View Source Code"
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>Code</span>
              </a>
            )}

            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-sky-500/40 bg-sky-950/60 px-3 py-1.5 text-xs font-bold text-sky-300 hover:bg-sky-900/80 hover:text-sky-100 transition active:scale-95 shadow-sm shadow-sky-950/40"
                title="Open Live Website"
              >
                <Globe className="h-3.5 w-3.5 text-sky-400" />
                <span>Website</span>
                <ExternalLink className="h-3 w-3 opacity-70" />
              </a>
            )}

            {project.app_url && (
              <a
                href={project.app_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-950/70 px-3 py-1.5 text-xs font-bold text-indigo-300 hover:bg-indigo-900/80 hover:text-indigo-100 transition active:scale-95 shadow-sm shadow-indigo-950/40"
                title="Open App Demo / APK"
              >
                <Smartphone className="h-3.5 w-3.5 text-indigo-400" />
                <span>App Demo</span>
                <ExternalLink className="h-3 w-3 opacity-70" />
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

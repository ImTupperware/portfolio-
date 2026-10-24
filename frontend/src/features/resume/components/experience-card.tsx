"use client";

import React, { useState } from "react";
import { WorkExperience } from "../schemas/resume.schema";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { EditExperienceModal } from "./edit-experience-modal";
import { Briefcase, Calendar, MapPin, CheckCircle2, Edit2, EyeOff } from "lucide-react";

interface ExperienceCardProps {
  experience: WorkExperience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const isEditMode = useAuthStore((state) => state.isEditMode);
  const [isEditing, setIsEditing] = useState(false);

  const formatPeriod = (start: string, end?: string | null, isCurrent?: boolean) => {
    const s = new Date(start).toLocaleDateString("en-US", { month: "short", year: "numeric" });
    if (isCurrent) return `${s} — Present`;
    if (!end) return s;
    const e = new Date(end).toLocaleDateString("en-US", { month: "short", year: "numeric" });
    return `${s} — ${e}`;
  };

  // Derive company initials for a modern avatar badge
  const companyInitials = experience.company
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <article className="relative pl-8 sm:pl-10 pb-12 border-l-2 border-slate-800 last:pb-2 last:border-l-transparent">
        {/* Glowing Connected Timeline Node */}
        <div className="absolute -left-[11px] top-2 flex items-center justify-center">
          {experience.is_current ? (
            <span className="relative flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-5 w-5 bg-sky-500 ring-4 ring-slate-950 border-2 border-white" />
            </span>
          ) : (
            <span className="h-5 w-5 rounded-full border-2 border-slate-600 bg-slate-900 ring-4 ring-slate-950" />
          )}
        </div>

        <div className="relative rounded-2xl border border-white/[0.08] bg-slate-900/50 p-6 sm:p-7 backdrop-blur-md transition-all duration-300 hover:border-sky-500/40 hover:bg-slate-900/80 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/10 shadow-lg">
          {/* Inner specular top highlight */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

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

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pr-12 sm:pr-0">
            <div className="flex items-start sm:items-center gap-3.5">
              {/* Company Monogram Avatar */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 text-sky-400 font-bold text-sm shadow-md">
                {companyInitials || <Briefcase className="h-5 w-5 text-sky-400" />}
              </div>

              <div>
                <h3 className="text-xl font-bold tracking-tight text-white flex flex-wrap items-center gap-2">
                  <span>{experience.role}</span>
                  {experience.is_current && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active / Ongoing
                    </span>
                  )}
                  {isEditMode && experience.is_visible === false && (
                    <span className="rounded-full bg-amber-950/80 border border-amber-500/30 px-2.5 py-0.5 text-xs font-medium text-amber-400 inline-flex items-center gap-1">
                      <EyeOff className="h-3 w-3" />
                      Hidden
                    </span>
                  )}
                </h3>
                <p className="flex flex-wrap items-center gap-2 font-medium text-sky-400 text-sm mt-0.5">
                  <span>{experience.company}</span>
                  {experience.location && (
                    <span className="flex items-center gap-1 text-slate-400 text-xs font-normal">
                      &bull; <MapPin className="h-3 w-3 text-slate-400" />
                      {experience.location}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 px-3.5 py-1.5 rounded-full self-start sm:self-auto border border-white/10 shadow-sm">
              <Calendar className="h-3.5 w-3.5 text-sky-400" />
              <span>{formatPeriod(experience.start_date, experience.end_date, experience.is_current)}</span>
            </div>
          </div>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-300 font-normal">
            {experience.summary}
          </p>

          {experience.highlights && experience.highlights.length > 0 && (
            <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
              {experience.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="leading-normal">{item}</span>
                </li>
              ))}
            </ul>
          )}

          {experience.technologies && experience.technologies.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.08]">
              {experience.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-white/[0.08] bg-slate-800/50 px-2.5 py-1 text-[11px] font-medium text-slate-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      {isEditing && (
        <EditExperienceModal
          experience={experience}
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
}

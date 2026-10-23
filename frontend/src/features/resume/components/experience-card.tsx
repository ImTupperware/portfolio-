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

  return (
    <>
      <article className="relative pl-8 pb-10 border-l border-slate-800 last:pb-2">
        <span
          className={`absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 ${
            experience.is_current
              ? "border-sky-400 bg-slate-950 ring-4 ring-sky-500/20"
              : "border-slate-600 bg-slate-950"
          }`}
        />

        <div className="relative rounded-2xl border border-slate-800/90 bg-slate-900/50 p-6 sm:p-7 transition duration-300 hover:border-slate-700 hover:bg-slate-900/80 shadow-lg">
          {isEditMode && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-950/80 px-2.5 py-1 text-xs font-semibold text-amber-300 shadow-md backdrop-blur-md transition hover:bg-amber-900/90"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit</span>
            </button>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pr-14 sm:pr-0">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>{experience.role}</span>
                {experience.is_current && (
                  <span className="rounded-full bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                    Current
                  </span>
                )}
                {isEditMode && experience.is_visible === false && (
                  <span className="rounded-full bg-amber-950/80 border border-amber-500/30 px-2.5 py-0.5 text-xs font-medium text-amber-400 inline-flex items-center gap-1">
                    <EyeOff className="h-3 w-3" />
                    Hidden
                  </span>
                )}
              </h3>
              <p className="flex items-center gap-2 font-medium text-sky-400 text-sm mt-1">
                <Briefcase className="h-4 w-4" />
                <span>{experience.company}</span>
                {experience.location && (
                  <span className="flex items-center gap-1 text-slate-400 text-xs font-normal">
                    <MapPin className="h-3.5 w-3.5" />
                    {experience.location}
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg self-start sm:self-auto border border-slate-700/50">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>{formatPeriod(experience.start_date, experience.end_date, experience.is_current)}</span>
            </div>
          </div>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-300">
            {experience.summary}
          </p>

          {experience.highlights && experience.highlights.length > 0 && (
            <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
              {experience.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="leading-normal">{item}</span>
                </li>
              ))}
            </ul>
          )}

          {experience.technologies && experience.technologies.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5 pt-4 border-t border-slate-800">
              {experience.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-slate-700/60 bg-slate-800/60 px-2.5 py-1 text-xs text-slate-300"
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

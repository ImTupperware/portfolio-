"use client";

import React, { useState } from "react";
import { useResumeQuery } from "../api/use-resume";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { Education } from "../schemas/resume.schema";
import { EditEducationModal } from "./edit-education-modal";
import { GraduationCap, Award, Plus, Edit2 } from "lucide-react";
import { ErrorBoundary } from "@/components/common/error-boundary";

export function EducationSection() {
  const { data, isLoading, refetch } = useResumeQuery();
  const isEditMode = useAuthStore((state) => state.isEditMode);
  const [editingEdu, setEditingEdu] = useState<Education | null | undefined>(undefined);

  return (
    <ErrorBoundary fallbackTitle="Unable to load education records" onReset={() => refetch()}>
      <section id="education" className="py-14 border-t border-slate-800/80">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-950/40 px-3 py-1 text-xs font-medium text-sky-300 mb-3">
              <GraduationCap className="h-3.5 w-3.5 text-sky-400" />
              <span>Academic Background</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Education
            </h2>
            <p className="mt-2 text-base text-slate-400 max-w-2xl">
              Bachelor of Science in Computer Science (Software Engineering) with Honours at UMPSA.
            </p>
          </div>

          {isEditMode && (
            <button
              type="button"
              onClick={() => setEditingEdu(null)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-sky-500/40 bg-sky-950/60 px-3.5 py-2 text-xs font-semibold text-sky-300 hover:bg-sky-900/70 transition shadow-md self-start sm:self-auto"
            >
              <Plus className="h-4 w-4 text-sky-400" />
              <span>Add Education</span>
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-slate-900/60 p-4 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.educations.map((edu) => (
              <div
                key={edu.id}
                className="group relative rounded-2xl border border-slate-800/90 bg-slate-900/50 p-6 sm:p-7 shadow-md transition hover:border-slate-700 hover:bg-slate-900/80"
              >
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => setEditingEdu(edu)}
                    className="absolute top-4 right-4 flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-950/70 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-900/80 transition"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                )}

                <div className="flex justify-between items-start gap-3 pr-14">
                  <div>
                    <h3 className="text-lg font-bold text-white">{edu.degree}</h3>
                    <p className="text-sm font-semibold text-sky-400 mt-1">{edu.field_of_study}</p>
                    <p className="text-xs text-slate-400 mt-1">{edu.institution}</p>
                  </div>
                  <span className="text-xs font-medium text-slate-300 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700/50 flex-shrink-0">
                    {edu.start_year} — {edu.end_year ?? "Present"}
                  </span>
                </div>
                {edu.grade && (
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-1.5 text-xs text-slate-300">
                    <Award className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    <span>Honors: <strong className="text-emerald-400 font-medium">{edu.grade}</strong></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {editingEdu !== undefined && (
          <EditEducationModal
            education={editingEdu}
            isOpen={editingEdu !== undefined}
            onClose={() => setEditingEdu(undefined)}
          />
        )}
      </section>
    </ErrorBoundary>
  );
}

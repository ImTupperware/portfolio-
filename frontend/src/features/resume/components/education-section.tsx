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
      <section id="education" className="py-12 sm:py-16 border-t border-white/[0.08]">
        <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-950/50 px-3 py-1 text-[11px] sm:text-xs font-semibold text-sky-300 mb-2.5 sm:mb-3 shadow-sm shadow-sky-950/40">
              <GraduationCap className="h-3.5 w-3.5 text-sky-400" />
              <span>Academic Foundation</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Education &amp; Credentials
            </h2>
            <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-slate-400 max-w-2xl font-normal">
              Bachelor of Science in Computer Science (Software Engineering) with Honours from Universiti Malaysia Pahang Al-Sultan Abdullah (UMPSA).
            </p>
          </div>

          {isEditMode && (
            <button
              type="button"
              onClick={() => setEditingEdu(null)}
              className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/40 bg-sky-950/70 px-4 py-2 text-xs font-bold text-sky-300 hover:bg-sky-900/80 transition shadow-md self-start sm:self-auto active:scale-95"
            >
              <Plus className="h-4 w-4 text-sky-400" />
              <span>Add Education</span>
            </button>
          )}
        </div>

        {isLoading && !data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-slate-900/50 p-6 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.educations.map((edu) => (
              <div
                key={edu.id}
                className="group relative rounded-2xl border border-white/[0.08] bg-slate-900/50 p-6 sm:p-7 backdrop-blur-md transition-all duration-300 hover:border-sky-500/40 hover:bg-slate-900/80 hover:-translate-y-1 hover:shadow-xl shadow-md"
              >
                {/* Inner top highlight */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => setEditingEdu(edu)}
                    className="absolute top-4 right-4 z-10 flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-950/70 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-900/80 transition"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                )}

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pr-12">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-500/30 text-indigo-400 font-bold text-sm shadow-md">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                        {edu.degree}
                      </h3>
                      <p className="text-sm font-semibold text-sky-400 mt-0.5">{edu.field_of_study}</p>
                      <p className="text-xs text-slate-400 mt-1">{edu.institution}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-300 bg-slate-800/80 px-3.5 py-1 rounded-full border border-white/10 shrink-0 self-start">
                    {edu.start_year} — {edu.end_year ?? "Present"}
                  </span>
                </div>

                {edu.grade && (
                  <div className="mt-5 pt-3.5 border-t border-white/[0.08] flex items-center gap-2 text-xs text-slate-300">
                    <Award className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>
                      Academic Standing: <strong className="text-emerald-400 font-bold">{edu.grade}</strong>
                    </span>
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

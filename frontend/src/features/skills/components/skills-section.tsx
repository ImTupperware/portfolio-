"use client";

import React, { useState } from "react";
import { useSkillsQuery } from "../api/use-skills";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { Skill } from "../schemas/skill.schema";
import { EditSkillModal } from "./edit-skill-modal";
import { Cpu, CheckCircle2, Plus, Edit2 } from "lucide-react";
import { ErrorBoundary } from "@/components/common/error-boundary";

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<string | undefined>();
  const [editingSkill, setEditingSkill] = useState<Skill | null | undefined>(undefined);
  const isEditMode = useAuthStore((state) => state.isEditMode);
  const { data, isLoading, refetch } = useSkillsQuery(activeCategory);

  const categories = ["All", "Frontend", "Backend", "Database", "Cloud", "Architecture"];

  return (
    <ErrorBoundary fallbackTitle="Unable to load skills matrix" onReset={() => refetch()}>
      <section id="skills" className="py-12 sm:py-16 border-t border-white/[0.08]">
        <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-950/50 px-3 py-1 text-[11px] sm:text-xs font-semibold text-sky-300 mb-2.5 sm:mb-3 shadow-sm shadow-sky-950/40">
              <Cpu className="h-3.5 w-3.5 text-sky-400" />
              <span>Core Stack &amp; Capabilities</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Technical Skills Matrix
            </h2>
            <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-slate-400 max-w-2xl font-normal">
              Validated expertise across modern frontend ecosystems, robust backend services, scalable relational databases, and offline hardware architectures.
            </p>
          </div>

          {isEditMode && (
            <button
              type="button"
              onClick={() => setEditingSkill(null)}
              className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/40 bg-sky-950/70 px-4 py-2 text-xs font-bold text-sky-300 hover:bg-sky-900/80 transition shadow-md self-start sm:self-auto active:scale-95"
            >
              <Plus className="h-4 w-4 text-sky-400" />
              <span>Add Skill</span>
            </button>
          )}
        </div>

        {/* Swipeable Filter Pills on mobile */}
        <div className="mb-6 sm:mb-8 flex overflow-x-auto no-scrollbar pb-1 sm:flex-wrap gap-2 text-xs -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((category) => {
            const active = category === "All" ? !activeCategory : activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category === "All" ? undefined : category)}
                className={`shrink-0 sm:shrink rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2 font-semibold transition-all duration-200 active:scale-95 ${
                  active
                    ? "bg-gradient-to-r from-sky-400 to-indigo-500 text-slate-950 font-bold shadow-lg shadow-sky-500/20"
                    : "border border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {isLoading && !data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-slate-900/50 p-5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.data.map((skill) => {
              // Category badge color
              const getCategoryStyle = (cat: string) => {
                switch (cat?.toLowerCase()) {
                  case "frontend":
                    return "border-sky-500/30 bg-sky-950/60 text-sky-300";
                  case "backend":
                    return "border-emerald-500/30 bg-emerald-950/60 text-emerald-300";
                  case "database":
                    return "border-amber-500/30 bg-amber-950/60 text-amber-300";
                  case "cloud":
                    return "border-indigo-500/30 bg-indigo-950/60 text-indigo-300";
                  default:
                    return "border-white/10 bg-slate-800/70 text-slate-300";
                }
              };

              return (
                <div
                  key={skill.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-slate-900/50 p-5 backdrop-blur-md transition-all duration-300 hover:border-sky-500/40 hover:bg-slate-900/80 hover:-translate-y-1 hover:shadow-xl shadow-md"
                >
                  {/* Inner top highlight */}
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => setEditingSkill(skill)}
                      className="absolute top-3 right-3 flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-950/70 px-2 py-0.5 text-[11px] font-semibold text-amber-300 hover:bg-amber-900/80 transition"
                    >
                      <Edit2 className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                  )}

                  <div className="flex items-center justify-between pr-12">
                    <span className="font-bold text-slate-100 group-hover:text-sky-300 transition-colors text-base">
                      {skill.name}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getCategoryStyle(
                        skill.category
                      )}`}
                    >
                      {skill.category}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                      <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Proficiency</span>
                      </span>
                      <span className="font-bold text-sky-400 text-xs">{skill.proficiency}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-950 border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-sky-500 via-teal-400 to-indigo-500 rounded-full transition-all duration-700 shadow-sm"
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {editingSkill !== undefined && (
          <EditSkillModal
            skill={editingSkill}
            isOpen={editingSkill !== undefined}
            onClose={() => setEditingSkill(undefined)}
          />
        )}
      </section>
    </ErrorBoundary>
  );
}

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
      <section id="skills" className="py-14 border-t border-slate-800/80">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-950/40 px-3 py-1 text-xs font-medium text-sky-300 mb-3">
              <Cpu className="h-3.5 w-3.5 text-sky-400" />
              <span>Technical Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Technical Skills
            </h2>
            <p className="mt-2 text-base text-slate-400 max-w-2xl">
              Technologies, frameworks, and integrations across Frontend, Backend &amp; APIs, Databases &amp; Cloud, and Tools.
            </p>
          </div>

          {isEditMode && (
            <button
              type="button"
              onClick={() => setEditingSkill(null)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-sky-500/40 bg-sky-950/60 px-3.5 py-2 text-xs font-semibold text-sky-300 hover:bg-sky-900/70 transition shadow-md self-start sm:self-auto"
            >
              <Plus className="h-4 w-4 text-sky-400" />
              <span>Add Skill</span>
            </button>
          )}
        </div>

        <div className="mb-8 flex flex-wrap gap-2 text-xs">
          {categories.map((category) => {
            const active = category === "All" ? !activeCategory : activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category === "All" ? undefined : category)}
                className={`rounded-lg px-3.5 py-1.5 font-medium transition ${
                  active ? "bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20" : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-slate-900/60 p-4 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.data.map((skill) => (
              <div
                key={skill.id}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-800/80 bg-slate-900/50 p-4 transition hover:border-slate-700 hover:bg-slate-900/80 shadow-md"
              >
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

                <div className="flex items-center justify-between pr-14">
                  <span className="font-semibold text-slate-200 group-hover:text-sky-400 transition-colors">
                    {skill.name}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md">{skill.category}</span>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Verified Proficiency
                    </span>
                    <span className="font-semibold text-sky-400">{skill.proficiency}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-700"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
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

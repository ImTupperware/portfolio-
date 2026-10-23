"use client";

import React, { useState } from "react";
import { Skill } from "../schemas/skill.schema";
import { useCreateSkillMutation, useUpdateSkillMutation, useDeleteSkillMutation } from "../api/use-skill-mutations";
import { X, Save, Trash2, AlertCircle, Cpu } from "lucide-react";

interface EditSkillModalProps {
  skill?: Skill | null;
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = ["Security", "Backend", "Frontend", "Database", "Cloud", "Architecture"] as const;

export function EditSkillModal({ skill, isOpen, onClose }: EditSkillModalProps) {
  const [name, setName] = useState(skill?.name || "");
  const [category, setCategory] = useState<string>(skill?.category || "Backend");
  const [proficiency, setProficiency] = useState<number>(skill?.proficiency || 85);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMutation = useCreateSkillMutation();
  const updateMutation = useUpdateSkillMutation();
  const deleteMutation = useDeleteSkillMutation();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Skill name is required.");
      return;
    }

    if (skill) {
      updateMutation.mutate(
        { id: skill.id, data: { name, category, proficiency } },
        { onSuccess: () => onClose() }
      );
    } else {
      createMutation.mutate(
        { name, category, proficiency },
        { onSuccess: () => onClose() }
      );
    }
  };

  const handleDelete = () => {
    if (!skill) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    deleteMutation.mutate(skill.id, { onSuccess: () => onClose() });
  };

  const isPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const inputCls = "w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white" aria-label="Close">
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
          <Cpu className="h-3.5 w-3.5" />
          <span>SKILL_MATRIX // {skill ? `SKILL_${skill.id}` : "NEW_SKILL"}</span>
        </div>
        <h3 className="text-xl font-bold text-white">{skill ? "Edit Skill" : "Add New Skill"}</h3>

        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/40 p-2.5 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Skill Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Kubernetes, Rust" className={inputCls} />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-medium text-slate-300 mb-1">
              <span>Proficiency Level</span>
              <span className="text-sky-400 font-bold">{proficiency}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={proficiency}
              onChange={(e) => setProficiency(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            {skill ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  confirmDelete ? "bg-red-600 text-white animate-pulse" : "bg-red-950/40 text-red-400 border border-red-500/30 hover:bg-red-900/50"
                }`}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{confirmDelete ? "Confirm Delete?" : "Delete"}</span>
              </button>
            ) : <div />}

            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="rounded-lg px-3.5 py-1.5 text-xs text-slate-400 hover:text-white">Cancel</button>
              <button type="submit" disabled={isPending} className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-sky-400 disabled:opacity-50">
                <Save className="h-3.5 w-3.5" />
                <span>{isPending ? "Saving..." : "Save"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

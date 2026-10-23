"use client";

import React, { useState } from "react";
import { WorkExperience } from "../schemas/resume.schema";
import { useUpdateExperienceMutation, useDeleteExperienceMutation } from "../api/use-resume-mutations";
import { X, Save, Trash2, AlertCircle, Briefcase, Eye, EyeOff } from "lucide-react";

interface EditExperienceModalProps {
  experience: WorkExperience;
  isOpen: boolean;
  onClose: () => void;
}

export function EditExperienceModal({ experience, isOpen, onClose }: EditExperienceModalProps) {
  const [role, setRole] = useState(experience.role);
  const [company, setCompany] = useState(experience.company);
  const [summary, setSummary] = useState(experience.summary);
  const [highlightsStr, setHighlightsStr] = useState(experience.highlights.join("\n"));
  const [isVisible, setIsVisible] = useState(experience.is_visible !== false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateMutation = useUpdateExperienceMutation();
  const deleteMutation = useDeleteExperienceMutation();
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const highlights = highlightsStr.split("\n").map((h) => h.trim()).filter(Boolean);
    if (highlights.length === 0) {
      setError("Please specify at least one achievement bullet point.");
      return;
    }
    updateMutation.mutate(
      { id: experience.id, data: { role, company, summary, highlights, is_visible: isVisible } },
      { onSuccess: () => onClose() }
    );
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    deleteMutation.mutate(experience.id, { onSuccess: () => onClose() });
  };

  const inputCls = "w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
          <Briefcase className="h-3.5 w-3.5" />
          <span>CAREER_RECORD // EXPERIENCE_{experience.id}</span>
        </div>
        <h3 className="text-xl font-bold text-white">Edit Experience</h3>

        {(error || updateMutation.isError || deleteMutation.isError) && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/40 p-2.5 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error || updateMutation.error?.message || deleteMutation.error?.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Role / Position</label>
              <input type="text" required value={role} onChange={(e) => setRole(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Company</label>
              <input type="text" required value={company} onChange={(e) => setCompany(e.target.value)} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Summary</label>
            <textarea rows={2} required value={summary} onChange={(e) => setSummary(e.target.value)} className={inputCls} />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Achievements (One per line)</label>
            <textarea rows={3} required value={highlightsStr} onChange={(e) => setHighlightsStr(e.target.value)} className={inputCls} />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3">
            <div className="flex items-center gap-2">
              {isVisible ? <Eye className="h-4 w-4 text-emerald-400" /> : <EyeOff className="h-4 w-4 text-amber-400" />}
              <span className="text-xs font-medium text-slate-200">Public Visibility</span>
            </div>
            <button
              type="button"
              onClick={() => setIsVisible(!isVisible)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                isVisible ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30" : "bg-amber-950 text-amber-300 border border-amber-500/30"
              }`}
            >
              {isVisible ? "Visible to Public" : "Hidden (Owner Only)"}
            </button>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                confirmDelete
                  ? "bg-red-600 text-white hover:bg-red-700 animate-pulse"
                  : "bg-red-950/40 text-red-400 border border-red-500/30 hover:bg-red-900/50"
              }`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{confirmDelete ? "Confirm Delete?" : "Delete"}</span>
            </button>

            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="rounded-lg px-3.5 py-1.5 text-xs text-slate-400 hover:text-white">Cancel</button>
              <button type="submit" disabled={updateMutation.isPending} className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-sky-400 disabled:opacity-50">
                <Save className="h-3.5 w-3.5" />
                <span>{updateMutation.isPending ? "Saving..." : "Save"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

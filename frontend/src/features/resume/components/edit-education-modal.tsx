"use client";

import React, { useState } from "react";
import { Education } from "../schemas/resume.schema";
import { useCreateEducationMutation, useUpdateEducationMutation, useDeleteEducationMutation } from "../api/use-education-mutations";
import { X, Save, Trash2, AlertCircle, GraduationCap } from "lucide-react";

interface EditEducationModalProps {
  education?: Education | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditEducationModal({ education, isOpen, onClose }: EditEducationModalProps) {
  const [institution, setInstitution] = useState(education?.institution || "");
  const [degree, setDegree] = useState(education?.degree || "");
  const [fieldOfStudy, setFieldOfStudy] = useState(education?.field_of_study || "");
  const [startYear, setStartYear] = useState<number>(education?.start_year || 2015);
  const [endYear, setEndYear] = useState<number | undefined>(education?.end_year || undefined);
  const [grade, setGrade] = useState(education?.grade || "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMutation = useCreateEducationMutation();
  const updateMutation = useUpdateEducationMutation();
  const deleteMutation = useDeleteEducationMutation();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!institution.trim() || !degree.trim() || !fieldOfStudy.trim()) {
      setError("Institution, degree, and field of study are required.");
      return;
    }

    const payload = {
      institution, degree, field_of_study: fieldOfStudy,
      start_year: Number(startYear),
      end_year: endYear ? Number(endYear) : undefined,
      grade: grade || undefined,
      sort_order: education?.sort_order || 0,
    };

    if (education) {
      updateMutation.mutate({ id: education.id, data: payload }, { onSuccess: () => onClose() });
    } else {
      createMutation.mutate(payload, { onSuccess: () => onClose() });
    }
  };

  const handleDelete = () => {
    if (!education) return;
    if (!confirmDelete) { setConfirmDelete(true); return; }
    deleteMutation.mutate(education.id, { onSuccess: () => onClose() });
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
          <GraduationCap className="h-3.5 w-3.5" />
          <span>EDUCATION // {education ? `EDU_${education.id}` : "NEW_RECORD"}</span>
        </div>
        <h3 className="text-xl font-bold text-white">{education ? "Edit Education" : "Add Education"}</h3>

        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/40 p-2.5 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Degree</label>
            <input type="text" required value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="e.g. Master of Science" className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Field of Study</label>
              <input type="text" required value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} placeholder="Cyber Security" className={inputCls} />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Institution</label>
              <input type="text" required value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="University Name" className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Start Year</label>
              <input type="number" required value={startYear} onChange={(e) => setStartYear(Number(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">End Year</label>
              <input type="number" value={endYear || ""} onChange={(e) => setEndYear(e.target.value ? Number(e.target.value) : undefined)} placeholder="Present" className={inputCls} />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Honors / Grade</label>
              <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="Magna Cum Laude" className={inputCls} />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            {education ? (
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

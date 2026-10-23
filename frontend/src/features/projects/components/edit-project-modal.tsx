"use client";

import React, { useState } from "react";
import { Project, ProjectFormSchema } from "../schemas/project.schema";
import { useUpdateProjectMutation, useDeleteProjectMutation } from "../api/use-project-mutations";
import { X, Save, Trash2, AlertCircle, FolderGit2, Eye, EyeOff } from "lucide-react";

interface EditProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function EditProjectModal({ project, isOpen, onClose }: EditProjectModalProps) {
  const [title, setTitle] = useState(project.title);
  const [summary, setSummary] = useState(project.summary);
  const [liveUrl, setLiveUrl] = useState(project.live_url || "");
  const [appUrl, setAppUrl] = useState(project.app_url || "");
  const [githubUrl, setGithubUrl] = useState(project.github_url || "");
  const [tagsStr, setTagsStr] = useState(project.tags.join(", "));
  const [status, setStatus] = useState<"draft" | "published" | "archived">(project.status || "draft");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateMutation = useUpdateProjectMutation();
  const deleteMutation = useDeleteProjectMutation();
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const tags = tagsStr.split(",").map((t) => t.trim()).filter(Boolean);
    const parsed = ProjectFormSchema.safeParse({
      title,
      summary,
      description: project.description,
      live_url: liveUrl || undefined,
      app_url: appUrl || undefined,
      github_url: githubUrl || undefined,
      tags,
      status,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Validation failure.");
      return;
    }
    updateMutation.mutate({ id: project.id, data: parsed.data }, { onSuccess: () => onClose() });
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    deleteMutation.mutate(project.id, { onSuccess: () => onClose() });
  };

  const inputCls = "w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
          <FolderGit2 className="h-3.5 w-3.5" />
          <span>PROJECT_ENTRY // PROJECT_{project.id}</span>
        </div>
        <h3 className="text-xl font-bold text-white">Edit Project</h3>

        {(error || updateMutation.isError || deleteMutation.isError) && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/40 p-2.5 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error || updateMutation.error?.message || deleteMutation.error?.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Project Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Summary (1-2 sentences)</label>
            <textarea rows={2} required value={summary} onChange={(e) => setSummary(e.target.value)} className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">🌐 Website / Live URL</label>
              <input type="url" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="https://..." className={inputCls} />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">📱 App Demo URL</label>
              <input type="url" value={appUrl} onChange={(e) => setAppUrl(e.target.value)} placeholder="https://..." className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">GitHub / Code URL</label>
              <input type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." className={inputCls} />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Visibility Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published" | "archived")}
                className={inputCls}
              >
                <option value="published">Published (Visible)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="archived">Archived (Hidden)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Tags (comma-separated)</label>
            <input type="text" value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} className={inputCls} />
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

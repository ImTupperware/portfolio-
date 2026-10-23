"use client";

import React, { useState } from "react";
import { Certification } from "../schemas/resume.schema";
import { useCreateCertificationMutation, useUpdateCertificationMutation, useDeleteCertificationMutation } from "../api/use-certification-mutations";
import { X, Save, Trash2, AlertCircle, Award } from "lucide-react";

interface EditCertificationModalProps {
  certification?: Certification | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditCertificationModal({ certification, isOpen, onClose }: EditCertificationModalProps) {
  const [name, setName] = useState(certification?.name || "");
  const [issuer, setIssuer] = useState(certification?.issuer || "");
  const [issueDate, setIssueDate] = useState(certification?.issue_date ? certification.issue_date.slice(0, 10) : "");
  const [credentialId, setCredentialId] = useState(certification?.credential_id || "");
  const [credentialUrl, setCredentialUrl] = useState(certification?.credential_url || "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMutation = useCreateCertificationMutation();
  const updateMutation = useUpdateCertificationMutation();
  const deleteMutation = useDeleteCertificationMutation();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !issuer.trim() || !issueDate) {
      setError("Name, issuer, and issue date are required.");
      return;
    }

    const payload = {
      name, issuer, issue_date: issueDate,
      credential_id: credentialId || undefined,
      credential_url: credentialUrl || undefined,
      sort_order: certification?.sort_order || 0,
    };

    if (certification) {
      updateMutation.mutate({ id: certification.id, data: payload }, { onSuccess: () => onClose() });
    } else {
      createMutation.mutate(payload, { onSuccess: () => onClose() });
    }
  };

  const handleDelete = () => {
    if (!certification) return;
    if (!confirmDelete) { setConfirmDelete(true); return; }
    deleteMutation.mutate(certification.id, { onSuccess: () => onClose() });
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
          <Award className="h-3.5 w-3.5" />
          <span>CREDENTIAL // {certification ? `CERT_${certification.id}` : "NEW_CERTIFICATION"}</span>
        </div>
        <h3 className="text-xl font-bold text-white">{certification ? "Edit Certification" : "Add Certification"}</h3>

        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/40 p-2.5 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Certification Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. CISSP, AWS Solutions Architect" className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Issuer Organization</label>
              <input type="text" required value={issuer} onChange={(e) => setIssuer(e.target.value)} placeholder="e.g. (ISC)², Amazon" className={inputCls} />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Issue Date</label>
              <input type="date" required value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Credential ID (optional)</label>
            <input type="text" value={credentialId} onChange={(e) => setCredentialId(e.target.value)} placeholder="e.g. CERT-98214" className={inputCls} />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Verification URL (optional)</label>
            <input type="url" value={credentialUrl} onChange={(e) => setCredentialUrl(e.target.value)} placeholder="https://..." className={inputCls} />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            {certification ? (
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

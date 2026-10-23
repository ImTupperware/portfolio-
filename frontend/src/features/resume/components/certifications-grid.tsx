"use client";

import React, { useState } from "react";
import { useResumeQuery } from "../api/use-resume";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { Certification } from "../schemas/resume.schema";
import { EditCertificationModal } from "./edit-certification-modal";
import { Award, ExternalLink, ShieldCheck, Plus, Edit2 } from "lucide-react";
import { ErrorBoundary } from "@/components/common/error-boundary";

export function CertificationsGrid() {
  const { data, isLoading, refetch } = useResumeQuery();
  const isEditMode = useAuthStore((state) => state.isEditMode);
  const [editingCert, setEditingCert] = useState<Certification | null | undefined>(undefined);

  return (
    <ErrorBoundary fallbackTitle="Unable to load certifications" onReset={() => refetch()}>
      <section id="certifications" className="py-14 border-t border-slate-800/80">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-950/40 px-3 py-1 text-xs font-medium text-sky-300 mb-3">
              <Award className="h-3.5 w-3.5 text-sky-400" />
              <span>Leadership &amp; Attributes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Involvement &amp; Professional Attributes
            </h2>
            <p className="mt-2 text-base text-slate-400 max-w-2xl">
              University society leadership, professional language proficiency, and relocation/remote work readiness.
            </p>
          </div>

          {isEditMode && (
            <button
              type="button"
              onClick={() => setEditingCert(null)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-sky-500/40 bg-sky-950/60 px-3.5 py-2 text-xs font-semibold text-sky-300 hover:bg-sky-900/70 transition shadow-md self-start sm:self-auto"
            >
              <Plus className="h-4 w-4 text-sky-400" />
              <span>Add Item</span>
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 rounded-xl bg-slate-900/60 p-4 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {data?.certifications.map((cert) => (
              <div
                key={cert.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-slate-900/50 p-6 transition hover:border-slate-700 hover:bg-slate-900/80 shadow-md"
              >
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => setEditingCert(cert)}
                    className="absolute top-4 right-4 flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-950/70 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-900/80 transition"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                )}

                <div>
                  <div className="flex items-start justify-between gap-2 pr-14">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-sky-400">
                      <ShieldCheck className="h-4 w-4 shrink-0" />
                      <span>{cert.issuer}</span>
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-white group-hover:text-sky-400 transition-colors">
                    {cert.name}
                  </h3>
                </div>

                {cert.credential_url && (
                  <div className="mt-5 pt-3 border-t border-slate-800">
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      <span>Verify Credential</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {editingCert !== undefined && (
          <EditCertificationModal
            certification={editingCert}
            isOpen={editingCert !== undefined}
            onClose={() => setEditingCert(undefined)}
          />
        )}
      </section>
    </ErrorBoundary>
  );
}

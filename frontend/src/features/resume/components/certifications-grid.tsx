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
      <section id="certifications" className="py-16 border-t border-white/[0.08]">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-950/50 px-3.5 py-1 text-xs font-semibold text-sky-300 mb-3 shadow-sm shadow-sky-950/40">
              <Award className="h-3.5 w-3.5 text-sky-400" />
              <span>Leadership &amp; Attributes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Involvement &amp; Key Attributes
            </h2>
            <p className="mt-2 text-base text-slate-400 max-w-2xl font-normal">
              University leadership roles, multilingual fluency (English &amp; Malay), agility, and readiness for remote and on-site engineering roles.
            </p>
          </div>

          {isEditMode && (
            <button
              type="button"
              onClick={() => setEditingCert(null)}
              className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/40 bg-sky-950/70 px-4 py-2 text-xs font-bold text-sky-300 hover:bg-sky-900/80 transition shadow-md self-start sm:self-auto active:scale-95"
            >
              <Plus className="h-4 w-4 text-sky-400" />
              <span>Add Item</span>
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-36 rounded-2xl bg-slate-900/50 p-6 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data?.certifications.map((cert) => (
              <div
                key={cert.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-slate-900/50 p-6 backdrop-blur-md transition-all duration-300 hover:border-sky-500/40 hover:bg-slate-900/80 hover:-translate-y-1 hover:shadow-xl shadow-md"
              >
                {/* Inner top highlight */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => setEditingCert(cert)}
                    className="absolute top-4 right-4 z-10 flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-950/70 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-900/80 transition"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-950/80 border border-sky-500/30 text-sky-400">
                      <ShieldCheck className="h-4 w-4 shrink-0" />
                    </span>
                    <span className="text-xs font-bold text-sky-400">{cert.issuer}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors leading-snug">
                    {cert.name}
                  </h3>
                </div>

                {cert.credential_url && (
                  <div className="mt-5 pt-3.5 border-t border-white/[0.08]">
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

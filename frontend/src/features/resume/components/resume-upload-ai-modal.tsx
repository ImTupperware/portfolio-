"use client";

import React, { useState } from "react";
import { useUIStore } from "@/stores/ui-store";
import { useParseResumeAiMutation, useImportResumeAiMutation, ResumeAiParsedData } from "../api/use-resume-ai-import";
import { ResumeAiUploadForm } from "./resume-ai-upload-form";
import { ResumeAiPreviewCard } from "./resume-ai-preview-card";
import { Sparkles, X, Loader2, CheckCircle2, RotateCcw } from "lucide-react";

export function ResumeUploadAiModal() {
  const isOpen = useUIStore((state) => state.isResumeUploadOpen);
  const close = useUIStore((state) => state.closeResumeUpload);

  const [preview, setPreview] = useState<ResumeAiParsedData | null>(null);
  const [mode, setMode] = useState<"replace" | "merge">("replace");
  const [successMsg, setSuccessMsg] = useState("");

  const parseMutation = useParseResumeAiMutation();
  const importMutation = useImportResumeAiMutation();

  if (!isOpen) return null;

  const handleAnalyze = (payload: { file?: File; text?: string }) => {
    if (payload.file) {
      parseMutation.mutate({ file: payload.file }, { onSuccess: (data) => setPreview(data) });
    } else if (payload.text) {
      parseMutation.mutate({ text: payload.text }, { onSuccess: (data) => setPreview(data) });
    }
  };

  const handleImport = () => {
    if (!preview) return;
    importMutation.mutate(
      { data: preview, mode },
      {
        onSuccess: (res) => {
          setSuccessMsg(res.message);
          setTimeout(() => {
            setSuccessMsg("");
            setPreview(null);
            close();
          }, 1600);
        },
      }
    );
  };

  const handleReset = () => {
    setPreview(null);
    setSuccessMsg("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-indigo-500/30 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Resume Importer</h3>
              <p className="text-[11px] text-slate-400">Auto-populate portfolio from PDF or Text</p>
            </div>
          </div>
          <button type="button" onClick={close} className="rounded-lg p-1.5 text-slate-400 hover:text-white" aria-label="Close modal">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {successMsg ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">Portfolio Updated!</h4>
              <p className="text-slate-400 text-xs">{successMsg}</p>
            </div>
          ) : !preview ? (
            <>
              <ResumeAiUploadForm isLoading={parseMutation.isPending} onAnalyze={handleAnalyze} />
              {parseMutation.isError && (
                <p className="text-rose-400 text-xs">{parseMutation.error.message}</p>
              )}
            </>
          ) : (
            <>
              <ResumeAiPreviewCard data={preview} onChange={(updated) => setPreview(updated)} />
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
                <span className="block text-[11px] font-semibold text-slate-300">Import Mode</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setMode("replace")}
                    className={`p-2 rounded-lg border text-left transition ${
                      mode === "replace" ? "border-indigo-500 bg-indigo-950/40 text-white" : "border-slate-800 text-slate-400"
                    }`}
                  >
                    <span className="font-semibold block">Replace All</span>
                    <span className="text-[10px] text-slate-400">Overwrites existing records</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("merge")}
                    className={`p-2 rounded-lg border text-left transition ${
                      mode === "merge" ? "border-indigo-500 bg-indigo-950/40 text-white" : "border-slate-800 text-slate-400"
                    }`}
                  >
                    <span className="font-semibold block">Merge</span>
                    <span className="text-[10px] text-slate-400">Appends to current records</span>
                  </button>
                </div>
              </div>

              {importMutation.isError && (
                <p className="text-rose-400 text-xs">{importMutation.error.message}</p>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={importMutation.isPending}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 hover:text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Re-upload
                </button>
                <button
                  type="button"
                  disabled={importMutation.isPending}
                  onClick={handleImport}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition disabled:opacity-40"
                >
                  {importMutation.isPending ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Populating Website...</>
                  ) : (
                    <><CheckCircle2 className="h-4 w-4" /> Apply to Website</>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

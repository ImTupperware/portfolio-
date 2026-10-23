"use client";

import React, { useState, useRef, useEffect } from "react";
import { UploadCloud, FileText, Sparkles, Loader2, CheckCircle2, X, AlertCircle } from "lucide-react";

interface Props {
  isLoading: boolean;
  onAnalyze: (payload: { file?: File; text?: string }) => void;
}

const ACCEPTED_EXTENSIONS = [".pdf", ".txt", ".md", ".doc", ".docx"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export function ResumeAiUploadForm({ isLoading, onAnalyze }: Props) {
  const [tab, setTab] = useState<"file" | "text">("file");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validateAndSetFile = (selectedFile: File | null | undefined) => {
    setFileError(null);
    if (!selectedFile) {
      return;
    }

    const fileName = selectedFile.name.toLowerCase();
    const hasValidExt = ACCEPTED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
    const hasValidMime =
      selectedFile.type === "application/pdf" ||
      selectedFile.type.startsWith("text/") ||
      selectedFile.type.includes("word") ||
      selectedFile.type === "";

    if (!hasValidExt && !hasValidMime) {
      setFileError("Unsupported file format. Please drop a PDF or TXT resume file.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setFileError("File exceeds 10MB maximum size.");
      return;
    }

    setFile(selectedFile);
  };

  // Prevent browser from opening dropped file in tab when dragging over modal
  useEffect(() => {
    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
    };
    const handleWindowDrop = (e: DragEvent) => {
      e.preventDefault();
      if (tab === "file" && e.dataTransfer?.files?.length) {
        validateAndSetFile(e.dataTransfer.files[0]);
        setIsDragging(false);
      }
    };

    window.addEventListener("dragover", handleWindowDragOver);
    window.addEventListener("drop", handleWindowDrop);
    return () => {
      window.removeEventListener("dragover", handleWindowDragOver);
      window.removeEventListener("drop", handleWindowDrop);
    };
  }, [tab]);

  const handleDragEnter = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only unset dragging if leaving the dropzone container itself
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer?.files?.[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleSubmit = () => {
    if (tab === "file" && file) {
      onAnalyze({ file });
    } else if (tab === "text" && text.trim()) {
      onAnalyze({ text });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const isSubmitDisabled = isLoading || (tab === "file" ? !file : !text.trim());

  return (
    <div className="space-y-3.5">
      <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
        <button
          type="button"
          onClick={() => setTab("file")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md font-medium text-xs transition ${
            tab === "file" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          <UploadCloud className="h-3.5 w-3.5" /> PDF / TXT File
        </button>
        <button
          type="button"
          onClick={() => setTab("text")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md font-medium text-xs transition ${
            tab === "text" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          <FileText className="h-3.5 w-3.5" /> Paste Text
        </button>
      </div>

      {tab === "file" ? (
        <div className="space-y-2">
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 cursor-pointer transition select-none ${
              isDragging
                ? "border-indigo-400 bg-indigo-950/40 scale-[1.01]"
                : file
                  ? "border-emerald-500/50 bg-emerald-950/20 hover:border-emerald-400/70"
                  : "border-slate-800 hover:border-indigo-500/50 bg-slate-950/40"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md,.doc,.docx,application/pdf,text/plain"
              className="hidden"
              onChange={(e) => {
                validateAndSetFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />

            {file ? (
              <div className="flex flex-col items-center text-center space-y-1">
                <CheckCircle2 className="h-7 w-7 text-emerald-400 mb-1" />
                <span className="text-xs text-white font-semibold break-all px-4">
                  {file.name}
                </span>
                <span className="text-[10px] text-emerald-300/80">
                  {formatFileSize(file.size)} • Ready to analyze
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setFileError(null);
                  }}
                  className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-slate-900/90 border border-slate-700 px-2 py-0.5 text-[10px] text-slate-300 hover:text-white hover:border-slate-500 transition"
                >
                  <X className="h-3 w-3" /> Remove file
                </button>
              </div>
            ) : (
              <>
                <UploadCloud
                  className={`h-7 w-7 mb-1.5 transition-transform ${
                    isDragging ? "text-indigo-300 scale-110" : "text-indigo-400"
                  }`}
                />
                <span className="text-xs text-white font-medium text-center">
                  {isDragging ? "Drop your resume file here..." : "Click to select or drop resume file"}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">PDF or TXT up to 10MB</span>
              </>
            )}
          </div>

          {fileError && (
            <div className="flex items-center gap-1.5 text-rose-400 text-[11px] bg-rose-950/30 border border-rose-500/30 rounded-lg px-3 py-2">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{fileError}</span>
            </div>
          )}
        </div>
      ) : (
        <textarea
          rows={5}
          placeholder="Paste your resume text here (experience, skills, education)..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
        />
      )}

      <button
        type="button"
        disabled={isSubmitDisabled}
        onClick={handleSubmit}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition disabled:opacity-40"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Analyzing Resume with AI...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            <span>Analyze & Extract Data</span>
          </>
        )}
      </button>
    </div>
  );
}

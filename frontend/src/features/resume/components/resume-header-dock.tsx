"use client";

import React from "react";
import { useUIStore } from "@/stores/ui-store";
import { ContactTrigger } from "@/features/inquiries/components/contact-trigger";
import { WhatsAppIcon } from "@/components/brand-icons";
import { Printer, UserCheck, FileUp } from "lucide-react";

interface Props {
  isEditMode: boolean;
  whatsapp?: string | null;
  onOpenEditProfile: () => void;
}

export function ResumeHeaderDock({ isEditMode, whatsapp, onOpenEditProfile }: Props) {
  const openResumeUpload = useUIStore((state) => state.openResumeUpload);

  const waDigits = whatsapp ? whatsapp.replace(/[^0-9]/g, "") : null;
  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="flex items-center gap-2 print:hidden bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/90 shadow-xl self-start lg:self-auto">
      {isEditMode && (
        <>
          <button
            type="button"
            onClick={openResumeUpload}
            title="Import Resume with AI"
            aria-label="Import Resume with AI"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-teal-500/40 bg-teal-950/70 text-teal-300 transition hover:bg-teal-900/80 hover:scale-105 active:scale-95 shadow-md shadow-teal-950/30"
          >
            <FileUp className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onOpenEditProfile}
            title="Edit My Profile"
            aria-label="Edit My Profile"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/40 bg-amber-950/70 text-amber-300 transition hover:bg-amber-900/80 hover:scale-105 active:scale-95 shadow-md shadow-amber-950/30"
          >
            <UserCheck className="h-5 w-5" />
          </button>
        </>
      )}

      {waDigits && (
        <a
          href={`https://wa.me/${waDigits}`}
          target="_blank"
          rel="noreferrer"
          title="Chat on WhatsApp"
          aria-label="Chat on WhatsApp"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-950/70 text-emerald-300 transition hover:bg-emerald-900/80 hover:scale-105 active:scale-95 shadow-md shadow-emerald-950/30"
        >
          <WhatsAppIcon className="h-5 w-5 text-emerald-400" />
        </a>
      )}

      <button
        type="button"
        onClick={handlePrint}
        title="Save / Print PDF Resume"
        aria-label="Save / Print PDF Resume"
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-200 transition hover:bg-slate-800 hover:text-white hover:scale-105 active:scale-95 shadow-md shadow-slate-950/40"
      >
        <Printer className="h-5 w-5 text-sky-400" />
      </button>

      <ContactTrigger iconOnly />
    </div>
  );
}

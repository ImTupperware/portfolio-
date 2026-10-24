"use client";

import React, { useState } from "react";
import { useUIStore } from "@/stores/ui-store";
import { Mail, Check, Copy, ArrowUpRight, Sparkles } from "lucide-react";
import { WhatsAppIcon } from "@/components/brand-icons";

export function CtaSection() {
  const openContactModal = useUIStore((state) => state.openContactModal);
  const [copied, setCopied] = useState(false);

  const email = "ahmadnurjuwaidi@gmail.com";

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <section className="py-20 border-t border-white/[0.08]">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950 p-8 sm:p-14 text-center backdrop-blur-xl shadow-2xl">
        {/* Ambient Decorative Aurora Orbs inside the card */}
        <div
          aria-hidden="true"
          className="absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-96 rounded-full bg-gradient-to-r from-sky-500/20 via-indigo-600/20 to-teal-400/20 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-950/60 px-3.5 py-1 text-xs font-semibold text-sky-300 mb-4 shadow-sm shadow-sky-950/40">
            <Sparkles className="h-3.5 w-3.5 text-sky-400 animate-pulse" />
            <span>Available For Hire &bull; Immediate Start</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Ready to engineer scalable systems together?
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Whether you are looking for a dedicated full-stack software engineer (Fresh Grad 2025) or need production-grade offline-first PWAs and SaaS development, let&apos;s connect.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={openContactModal}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-xl shadow-sky-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Mail className="h-4 w-4" />
              <span>Send An Inquiry</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>

            <a
              href="https://wa.me/601119934275"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/70 px-5 py-3 text-sm font-bold text-emerald-300 transition-all hover:bg-emerald-900/80 hover:text-emerald-100 hover:scale-105 active:scale-95 shadow-md shadow-emerald-950/40"
            >
              <WhatsAppIcon className="h-4 w-4 text-emerald-400" />
              <span>WhatsApp Direct</span>
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition active:scale-95 shadow-sm"
              title="Copy Email Address"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Email Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-slate-400" />
                  <span>Copy Email</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

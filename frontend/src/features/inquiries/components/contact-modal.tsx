"use client";

import React, { useState } from "react";
import { useSubmitInquiryMutation } from "../api/use-submit-inquiry";
import { useResumeQuery } from "@/features/resume/api/use-resume";
import { InquiryFormSchema, InquiryFormData } from "../schemas/inquiry.schema";
import { WhatsAppIcon } from "@/components/brand-icons";
import { Send, CheckCircle2, AlertCircle, X, Mail } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [form, setForm] = useState<InquiryFormData>({ name: "", email: "", subject: "", message: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const mutation = useSubmitInquiryMutation();
  const { data } = useResumeQuery();

  const waDigits = data?.profile?.whatsapp ? data.profile.whatsapp.replace(/[^0-9]/g, "") : null;
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const validation = InquiryFormSchema.safeParse(form);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        if (issue.path[0]) errors[issue.path[0].toString()] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    mutation.mutate(validation.data, {
      onSuccess: () => setForm({ name: "", email: "", subject: "", message: "" }),
    });
  };

  const inputCls = "w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
          <Mail className="h-4 w-4" />
          <span>DIRECT CONTACT</span>
        </div>
        <h3 className="text-xl font-bold text-white">Get in Touch</h3>
        <p className="text-xs text-slate-400 mt-0.5">Interested in hiring or collaborating? Reach out regarding software engineering roles or full-stack web projects.</p>

        {waDigits && (
          <div className="mt-3 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-2.5">
            <div className="flex items-center gap-2 text-xs text-emerald-300">
              <WhatsAppIcon className="h-4 w-4 text-emerald-400" />
              <span>Direct WhatsApp Messaging</span>
            </div>
            <a
              href={`https://wa.me/${waDigits}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition"
            >
              <span>Chat Now</span>
            </a>
          </div>
        )}

        {mutation.isSuccess ? (
          <div className="my-6 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400" />
            <p className="mt-2 text-sm font-semibold text-emerald-300">Message Transmitted Successfully</p>
            <p className="mt-1 text-xs text-slate-400">Response SLA: Within 24 hours.</p>
            <button type="button" onClick={onClose} className="mt-4 rounded-lg bg-slate-800 px-4 py-1.5 text-xs text-slate-200 hover:bg-slate-700">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            {mutation.isError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/30 p-3 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{mutation.error.message}</span>
              </div>
            )}
            <div>
              <input type="text" placeholder="Your Name or Organization" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
              {fieldErrors.name && <p className="mt-1 text-xs text-red-400">{fieldErrors.name}</p>}
            </div>
            <div>
              <input type="email" placeholder="Your Work Email (e.g. user@enterprise.com)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
              {fieldErrors.email && <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>}
            </div>
            <div>
              <input type="text" placeholder="Subject / Project Scope" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputCls} />
              {fieldErrors.subject && <p className="mt-1 text-xs text-red-400">{fieldErrors.subject}</p>}
            </div>
            <div>
              <textarea rows={3} placeholder="Project requirements, architectural vision, or role details..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={inputCls} />
              {fieldErrors.message && <p className="mt-1 text-xs text-red-400">{fieldErrors.message}</p>}
            </div>
            <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
              <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-xs font-medium text-slate-400 hover:text-white">Cancel</button>
              <button type="submit" disabled={mutation.isPending} className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-5 py-2 text-xs font-bold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50 shadow-md">
                {mutation.isPending ? "Transmitting..." : <><Send className="h-3.5 w-3.5" /> Send Message</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useUpdateProfileMutation } from "../api/use-profile";
import { ProfileFormSchema } from "../schemas/profile.schema";
import { X, Save, AlertCircle, UserCheck } from "lucide-react";

interface EditProfileModalProps {
  initialData?: {
    name?: string | null;
    title?: string | null;
    summary?: string | null;
    location?: string | null;
    availability?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    github_url?: string | null;
    linkedin_url?: string | null;
    website_url?: string | null;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ initialData, isOpen, onClose }: EditProfileModalProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [availability, setAvailability] = useState(initialData?.availability || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [whatsapp, setWhatsapp] = useState(initialData?.whatsapp || "");
  const [githubUrl, setGithubUrl] = useState(initialData?.github_url || "");
  const [linkedinUrl, setLinkedinUrl] = useState(initialData?.linkedin_url || "");
  const [websiteUrl, setWebsiteUrl] = useState(initialData?.website_url || "");
  const [error, setError] = useState<string | null>(null);

  const mutation = useUpdateProfileMutation();
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = ProfileFormSchema.safeParse({
      name, title, summary,
      location: location || undefined,
      availability: availability || undefined,
      phone: phone || undefined,
      whatsapp: whatsapp || undefined,
      github_url: githubUrl || undefined,
      linkedin_url: linkedinUrl || undefined,
      website_url: websiteUrl || undefined,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Validation error");
      return;
    }
    mutation.mutate(parsed.data, { onSuccess: () => onClose() });
  };

  const inputCls = "w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
          <UserCheck className="h-4 w-4" />
          <span>PROFILE_SETTINGS // USER_PROFILE_UPDATE</span>
        </div>
        <h3 className="text-xl font-bold text-white">Edit Your Profile</h3>
        {(error || mutation.isError) && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/40 p-2.5 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error || mutation.error?.message}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Professional Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Executive Summary / Bio</label>
            <textarea rows={3} required value={summary} onChange={(e) => setSummary(e.target.value)} className={inputCls} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Location</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="San Francisco, CA" className={inputCls} />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Availability</label>
              <input type="text" value={availability} onChange={(e) => setAvailability(e.target.value)} placeholder="Available for Roles" className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Phone Number</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className={inputCls} />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">WhatsApp Number (wa.me click-to-chat)</label>
              <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+15550192834" className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">GitHub URL</label>
              <input type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." className={inputCls} />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">LinkedIn URL</label>
              <input type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..." className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Personal Website (optional)</label>
            <input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://..." className={inputCls} />
          </div>
          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-xs text-slate-400 hover:text-white">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-5 py-2 text-xs font-bold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50">
              <Save className="h-3.5 w-3.5" />
              <span>{mutation.isPending ? "Updating..." : "Save Profile"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

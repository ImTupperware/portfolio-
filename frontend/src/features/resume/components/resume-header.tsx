"use client";

import React, { useState } from "react";
import { useResumeQuery } from "../api/use-resume";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { EditProfileModal } from "@/features/profile/components/edit-profile-modal";
import { GitHubIcon, LinkedInIcon, WhatsAppIcon } from "@/components/brand-icons";
import { ResumeMetrics } from "./resume-metrics";
import { ResumeHeaderDock } from "./resume-header-dock";
import { HeroPortrait } from "./hero-portrait";
import { MapPin, Mail, Globe } from "lucide-react";

export function ResumeHeader() {
  const { data } = useResumeQuery();
  const profile = data?.profile;
  const isEditMode = useAuthStore((state) => state.isEditMode);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const waDigits = profile?.whatsapp ? profile.whatsapp.replace(/[^0-9]/g, "") : null;

  return (
    <section id="about" className="pt-8 sm:pt-14 pb-16 border-b border-white/[0.08]">
      <div className="flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-14">
        <div className="flex-1 max-w-2xl">
          {/* Status Capsule */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3.5 py-1 text-xs font-medium text-emerald-300 mb-5 shadow-sm shadow-emerald-950/40">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>{profile?.availability || "Open to Full-Time & Freelance Roles • Klang Valley & Remote • Available Immediately"}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
            {profile?.name || "AHMAD NURJUWAIDI"}
          </h1>

          <p className="mt-3 text-xl sm:text-2xl font-bold bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
            {profile?.title || "Software Engineering Fresh Graduate • Full-Stack Developer"}
          </p>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300 font-normal">
            {profile?.summary ||
              "Computer Science (Software Engineering) fresh graduate from Universiti Malaysia Pahang Al-Sultan Abdullah (UMPSA, 2025) and Freelance Full-Stack Developer. Completed a 6-month university Industrial Training at Stealthx Performance Sdn. Bhd., and actively helps manage my mother's business while engineering production systems—notably Cikda Biz, an offline-first POS PWA with thermal receipt printing designed for real-world retail workflows."}
          </p>

          {/* Quick Tech Highlights Pills */}
          <div className="mt-5 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-slate-300">
            {["Next.js 15", "React 19", "TypeScript", "Laravel 12", "PostgreSQL", "MySQL / TiDB", "Capacitor PWA", "Docker"].map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-white/10 bg-slate-900/60 px-2.5 py-1 text-slate-300 backdrop-blur-sm"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Social and Contact Links Pills */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5 text-xs font-medium text-slate-400">
            {profile?.location && (
              <span className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-slate-900/50 px-3 py-1 text-slate-300">
                <MapPin className="h-3.5 w-3.5 text-sky-400" />
                {profile.location}
              </span>
            )}
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-slate-900/50 px-3 py-1 text-slate-300 hover:text-white hover:border-sky-500/40 transition"
              >
                <Mail className="h-3.5 w-3.5 text-sky-400" />
                {profile.email}
              </a>
            )}
            {waDigits && (
              <a
                href={`https://wa.me/${waDigits}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-emerald-400 hover:bg-emerald-900/60 hover:text-emerald-300 transition font-semibold"
              >
                <WhatsAppIcon className="h-3.5 w-3.5 text-emerald-400" />
                WhatsApp
              </a>
            )}
            {profile?.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-slate-900/50 px-3 py-1 text-slate-300 hover:text-white hover:border-slate-600 transition"
              >
                <GitHubIcon className="h-3.5 w-3.5" />
                GitHub
              </a>
            )}
            {profile?.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-slate-900/50 px-3 py-1 text-slate-300 hover:text-white hover:border-sky-500/40 transition"
              >
                <LinkedInIcon className="h-3.5 w-3.5 text-sky-400" />
                LinkedIn
              </a>
            )}
            {profile?.website_url && (
              <a
                href={profile.website_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-slate-900/50 px-3 py-1 text-slate-300 hover:text-white hover:border-sky-500/40 transition"
              >
                <Globe className="h-3.5 w-3.5 text-sky-400" />
                Website
              </a>
            )}
          </div>

          {/* Metric Highlights Cluster */}
          <ResumeMetrics />
        </div>

        {/* Right Column: Floating Dock & Silhouette Portrait */}
        <div className="flex flex-col items-center lg:items-end gap-6 shrink-0">
          <ResumeHeaderDock
            isEditMode={isEditMode}
            whatsapp={profile?.whatsapp}
            onOpenEditProfile={() => setIsEditProfileOpen(true)}
          />
          <HeroPortrait name={profile?.name} />
        </div>
      </div>

      {isEditProfileOpen && (
        <EditProfileModal
          initialData={profile}
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
        />
      )}
    </section>
  );
}

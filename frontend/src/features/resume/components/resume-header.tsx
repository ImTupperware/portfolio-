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
    <section id="about" className="pt-10 sm:pt-14 pb-14 border-b border-slate-800/80">
      <div className="flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-12">
        <div className="flex-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-medium text-emerald-300 mb-5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{profile?.availability || "Fresh Graduate (2025) & Freelance Full-Stack Developer • Available Immediately"}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
            {profile?.name || "AHMAD NURJUWAIDI BIN CHE ADNAN"}
          </h1>

          <p className="mt-3 text-xl sm:text-2xl font-semibold bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
            {profile?.title || "Software Engineering Fresh Graduate | Freelance Full-Stack Developer"}
          </p>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300">
            {profile?.summary ||
              "Computer Science (Software Engineering) fresh graduate from Universiti Malaysia Pahang Al-Sultan Abdullah (UMPSA, 2025) and Freelance Full-Stack Developer. Completed a 6-month university Industrial Training at Stealthx Performance Sdn. Bhd., and actively helps manage my mother's business while developing production-ready systems—including the Cikda Biz Offline-First POS PWA built specifically to digitize her daily business operations."}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400">
            {profile?.location && (
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-slate-400" />{profile.location}</span>
            )}
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 hover:text-white transition">
                <Mail className="h-4 w-4 text-slate-400" />{profile.email}
              </a>
            )}
            {waDigits && (
              <a href={`https://wa.me/${waDigits}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition font-semibold">
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
            )}
            {profile?.github_url && (
              <a href={profile.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition">
                <GitHubIcon className="h-4 w-4" /> GitHub
              </a>
            )}
            {profile?.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition">
                <LinkedInIcon className="h-4 w-4" /> LinkedIn
              </a>
            )}
            {profile?.website_url && (
              <a href={profile.website_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition">
                <Globe className="h-4 w-4 text-slate-400" /> Website
              </a>
            )}
          </div>

          <ResumeMetrics />
        </div>

        <div className="flex flex-col items-center lg:items-end gap-5 shrink-0">
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

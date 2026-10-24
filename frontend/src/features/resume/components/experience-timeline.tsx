"use client";

import React from "react";
import { useResumeQuery } from "../api/use-resume";
import { ExperienceCard } from "./experience-card";
import { ExperienceSkeleton } from "./experience-skeleton";
import { ErrorBoundary } from "@/components/common/error-boundary";
import { Briefcase } from "lucide-react";

export function ExperienceTimeline() {
  const { data, isLoading, isError, error, refetch } = useResumeQuery();

  return (
    <ErrorBoundary fallbackTitle="Unable to load career experience" onReset={() => refetch()}>
      <section id="experience" className="py-16 border-t border-white/[0.08]">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-950/50 px-3.5 py-1 text-xs font-semibold text-sky-300 mb-3 shadow-sm shadow-sky-950/40">
            <Briefcase className="h-3.5 w-3.5 text-sky-400" />
            <span>Engineering Track Record</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Career &amp; Practical Experience
          </h2>
          <p className="mt-2 text-base text-slate-400 max-w-2xl font-normal">
            Freelance full-stack engineering, digitizing retail operations for my family&apos;s business with offline-first PWA architectures, and my 6-month university Industrial Training (LI).
          </p>
        </div>

        {isLoading && (
          <div className="space-y-6">
            <ExperienceSkeleton />
            <ExperienceSkeleton />
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-6 text-center text-sm text-red-400">
            Failed to fetch experience records: {error?.message || "Internal server error"}
          </div>
        )}

        {!isLoading && !isError && data && (
          <div className="mt-6 space-y-2">
            {data.experiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        )}
      </section>
    </ErrorBoundary>
  );
}

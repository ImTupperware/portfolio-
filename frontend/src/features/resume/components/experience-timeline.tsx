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
      <section id="experience" className="py-14 border-t border-slate-800/80">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-950/40 px-3 py-1 text-xs font-medium text-sky-300 mb-3">
            <Briefcase className="h-3.5 w-3.5 text-sky-400" />
            <span>Freelance, Business &amp; Industrial Training</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Freelance, Family Business &amp; Internship
          </h2>
          <p className="mt-2 text-base text-slate-400 max-w-2xl">
            Freelance full-stack software development, managing and digitizing my mother&apos;s business with the Cikda Biz POS PWA, and my university Industrial Training (LI).
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

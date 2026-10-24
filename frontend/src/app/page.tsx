import React, { Suspense } from "react";
import { ResumeHeader } from "@/features/resume/components/resume-header";
import { ProjectGrid } from "@/features/projects/components/project-grid";
import { ExperienceTimeline } from "@/features/resume/components/experience-timeline";
import { SkillsSection } from "@/features/skills/components/skills-section";
import { EducationSection } from "@/features/resume/components/education-section";
import { CertificationsGrid } from "@/features/resume/components/certifications-grid";
import { CtaSection } from "@/components/layout/cta-section";

export default function ResumePortfolioPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6">
      <ResumeHeader />
      <Suspense fallback={<div className="h-96 rounded-2xl bg-slate-900/40 animate-pulse my-12 border border-white/10" />}>
        <ProjectGrid />
      </Suspense>
      <ExperienceTimeline />
      <SkillsSection />
      <EducationSection />
      <CertificationsGrid />
      <CtaSection />
    </main>
  );
}

import React, { Suspense } from "react";
import { ResumeHeader } from "@/features/resume/components/resume-header";
import { ExperienceTimeline } from "@/features/resume/components/experience-timeline";
import { ProjectGrid } from "@/features/projects/components/project-grid";
import { SkillsSection } from "@/features/skills/components/skills-section";
import { CertificationsGrid } from "@/features/resume/components/certifications-grid";
import { EducationSection } from "@/features/resume/components/education-section";

export default function ResumePortfolioPage() {
  return (
    <main className="mx-auto max-w-7xl px-6">
      <ResumeHeader />
      <ExperienceTimeline />
      <Suspense fallback={<div className="h-96 rounded-2xl bg-slate-900/40 animate-pulse my-12 border border-slate-800" />}>
        <ProjectGrid />
      </Suspense>
      <SkillsSection />
      <EducationSection />
      <CertificationsGrid />
    </main>
  );
}

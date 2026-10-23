import { z } from "zod";
import { SkillSchema } from "@/features/skills/schemas/skill.schema";

export const ProfileSchema = z.object({
  name: z.string(),
  title: z.string(),
  summary: z.string(),
  email: z.string().email(),
  location: z.string(),
  availability: z.string(),
  phone: z.string().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
  github_url: z.string().nullable().optional(),
  linkedin_url: z.string().nullable().optional(),
  website_url: z.string().nullable().optional(),
});

export const WorkExperienceSchema = z.object({
  id: z.number(),
  user_id: z.number().optional(),
  company: z.string().min(1).max(150),
  role: z.string().min(1).max(150),
  employment_type: z.string().default("Full-time"),
  location: z.string().nullable().optional(),
  start_date: z.string(),
  end_date: z.string().nullable().optional(),
  is_current: z.boolean().default(false),
  is_visible: z.boolean().default(true),
  summary: z.string(),
  highlights: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  sort_order: z.number().int().default(0),
});

export const CertificationSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(200),
  issuer: z.string().min(1).max(150),
  issue_date: z.string(),
  expiry_date: z.string().nullable().optional(),
  credential_id: z.string().nullable().optional(),
  credential_url: z.string().url().nullable().optional(),
  sort_order: z.number().int().default(0),
});

export const EducationSchema = z.object({
  id: z.number(),
  institution: z.string().min(1).max(200),
  degree: z.string().min(1).max(150),
  field_of_study: z.string().min(1).max(150),
  start_year: z.number().int(),
  end_year: z.number().int().nullable().optional(),
  grade: z.string().nullable().optional(),
  sort_order: z.number().int().default(0),
});

export const ResumeBundleSchema = z.object({
  profile: ProfileSchema,
  experiences: z.array(WorkExperienceSchema),
  certifications: z.array(CertificationSchema),
  educations: z.array(EducationSchema),
  skills: z.array(SkillSchema),
});

export type Profile = z.infer<typeof ProfileSchema>;
export type WorkExperience = z.infer<typeof WorkExperienceSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type ResumeBundle = z.infer<typeof ResumeBundleSchema>;

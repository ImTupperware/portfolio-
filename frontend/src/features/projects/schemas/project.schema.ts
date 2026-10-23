import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  title: z.string().min(3).max(255),
  slug: z.string().min(2).max(255),
  summary: z.string().min(10).max(500),
  description: z.string().min(10),
  thumbnail_url: z.string().url().nullable().optional(),
  live_url: z.string().url().nullable().optional(),
  app_url: z.string().url().nullable().optional(),
  github_url: z.string().url().nullable().optional(),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  sort_order: z.number().int().default(0),
  views_count: z.number().int().default(0),
  tags: z.array(z.string()).default([]),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
});

export const ProjectFormSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(255),
  slug: z.string().trim().max(255).optional(),
  summary: z.string().trim().min(10, "Summary must be at least 10 characters").max(500),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  thumbnail_url: z.string().trim().url("Must be a valid URL").or(z.literal("")).optional(),
  live_url: z.string().trim().url("Must be a valid URL").or(z.literal("")).optional(),
  app_url: z.string().trim().url("Must be a valid URL").or(z.literal("")).optional(),
  github_url: z.string().trim().url("Must be a valid URL").or(z.literal("")).optional(),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  sort_order: z.coerce.number().int().min(0).default(0),
  tags: z.array(z.string().trim().max(50)).default([]),
});

export const PaginatedProjectsResponseSchema = z.object({
  data: z.array(ProjectSchema),
  links: z.object({
    first: z.string().nullable().optional(),
    last: z.string().nullable().optional(),
    prev: z.string().nullable().optional(),
    next: z.string().nullable().optional(),
  }),
  meta: z.object({
    current_page: z.number(),
    from: z.number().nullable().optional(),
    last_page: z.number(),
    per_page: z.number(),
    to: z.number().nullable().optional(),
    total: z.number(),
  }),
});

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectFormData = z.infer<typeof ProjectFormSchema>;
export type PaginatedProjectsResponse = z.infer<typeof PaginatedProjectsResponseSchema>;

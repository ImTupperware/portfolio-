import { z } from "zod";

export const SkillSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  name: z.string().min(1).max(100),
  category: z.string().min(1).max(50),
  proficiency: z.number().int().min(1).max(100),
  icon: z.string().nullable().optional(),
  sort_order: z.number().int().default(0),
  created_at: z.string().nullable().optional(),
});

export const SkillsResponseSchema = z.object({
  data: z.array(SkillSchema),
  meta: z.object({
    total: z.number(),
  }).optional(),
});

export type Skill = z.infer<typeof SkillSchema>;
export type SkillsResponse = z.infer<typeof SkillsResponseSchema>;

import { z } from "zod";

export const ProfileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  title: z.string().min(2, "Title must be at least 2 characters").max(150),
  summary: z.string().min(10, "Summary must be at least 10 characters").max(2000),
  location: z.string().max(100).nullable().optional().or(z.literal("")),
  availability: z.string().max(100).nullable().optional().or(z.literal("")),
  phone: z.string().max(50).nullable().optional().or(z.literal("")),
  whatsapp: z.string().max(50).nullable().optional().or(z.literal("")),
  github_url: z.string().url("Invalid GitHub URL").nullable().optional().or(z.literal("")),
  linkedin_url: z.string().url("Invalid LinkedIn URL").nullable().optional().or(z.literal("")),
  website_url: z.string().url("Invalid Website URL").nullable().optional().or(z.literal("")),
});

export type ProfileFormData = z.infer<typeof ProfileFormSchema>;

export interface UserProfile extends ProfileFormData {
  id?: number;
  email?: string;
  role?: string;
  whatsapp?: string | null;
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { resumeKeys } from "./use-resume";
import { skillKeys } from "@/features/skills/api/use-skills";
import { projectKeys } from "@/features/projects/api/use-projects";

export interface ResumeAiParsedData {
  profile: {
    name?: string;
    title?: string;
    summary?: string;
    location?: string;
    phone?: string;
    whatsapp?: string;
    github_url?: string;
    linkedin_url?: string;
    website_url?: string;
  };
  experiences: Array<{
    company: string;
    role: string;
    employment_type?: string;
    location?: string;
    start_date: string;
    end_date?: string | null;
    is_current?: boolean;
    summary: string;
    highlights?: string[];
    technologies?: string[];
  }>;
  skills: Array<{
    name: string;
    category?: string;
    proficiency?: number;
  }>;
  certifications: Array<{
    name: string;
    issuer?: string;
    issue_date?: string;
    credential_id?: string;
    credential_url?: string;
  }>;
  educations: Array<{
    institution: string;
    degree: string;
    field_of_study: string;
    start_year: number;
    end_year?: number | null;
    grade?: string | null;
  }>;
  projects?: Array<{
    title: string;
    slug?: string;
    summary?: string;
    description?: string;
    featured?: boolean;
    status?: string;
  }>;
}

export interface ParseResumeAiResponse {
  success: boolean;
  preview: ResumeAiParsedData;
}

export type ParseResumeInput = { file: File } | { text: string };

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}

export function useParseResumeAiMutation() {
  return useMutation({
    mutationFn: async (input: ParseResumeInput): Promise<ResumeAiParsedData> => {
      let body: string;
      if ("file" in input) {
        const fileBase64 = await fileToBase64(input.file);
        body = JSON.stringify({
          file_name: input.file.name,
          file_mime: input.file.type || "application/pdf",
          file_base64: fileBase64,
        });
      } else {
        body = JSON.stringify({ text: input.text });
      }

      const res = await apiClient<ParseResumeAiResponse>("/resume/parse-ai", {
        method: "POST",
        body,
      });

      return res.preview;
    },
  });
}

export function useImportResumeAiMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, mode }: { data: ResumeAiParsedData; mode: "replace" | "merge" }) => {
      return await apiClient<{ success: boolean; message: string }>("/resume/import-ai", {
        method: "POST",
        body: JSON.stringify({ data, mode }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.all });
      queryClient.invalidateQueries({ queryKey: skillKeys.all });
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

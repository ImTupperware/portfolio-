import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ResumeBundle, ResumeBundleSchema } from "../schemas/resume.schema";

export const resumeKeys = {
  all: ["resume"] as const,
  bundle: () => [...resumeKeys.all, "bundle"] as const,
  experiences: () => [...resumeKeys.all, "experiences"] as const,
};

export function useResumeQuery() {
  return useQuery({
    queryKey: resumeKeys.bundle(),
    queryFn: async (): Promise<ResumeBundle> => {
      const raw = await apiClient<ResumeBundle>("/resume");
      return ResumeBundleSchema.parse(raw);
    },
  });
}

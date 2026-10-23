import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { SkillsResponse, SkillsResponseSchema } from "../schemas/skill.schema";

export const skillKeys = {
  all: ["skills"] as const,
  list: (category?: string) => [...skillKeys.all, { category }] as const,
};

export function useSkillsQuery(category?: string) {
  return useQuery({
    queryKey: skillKeys.list(category),
    queryFn: async () => {
      const endpoint = category ? `/skills?category=${encodeURIComponent(category)}` : "/skills";
      const raw = await apiClient<SkillsResponse>(endpoint);
      return SkillsResponseSchema.parse(raw);
    },
  });
}

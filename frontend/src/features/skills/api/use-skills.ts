import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { SkillsResponse, SkillsResponseSchema } from "../schemas/skill.schema";
import { INITIAL_SKILLS } from "../data/initial-skills";

export const skillKeys = {
  all: ["skills"] as const,
  list: (category?: string) => [...skillKeys.all, { category }] as const,
};

export function useSkillsQuery(category?: string) {
  const initialData = useMemo(() => {
    if (!category || category === "All") return INITIAL_SKILLS;
    const filtered = INITIAL_SKILLS.data.filter(
      (s) => s.category.toLowerCase() === category.toLowerCase()
    );
    return {
      data: filtered,
      meta: { total: filtered.length },
    };
  }, [category]);

  return useQuery({
    queryKey: skillKeys.list(category),
    queryFn: async () => {
      const endpoint = category ? `/skills?category=${encodeURIComponent(category)}` : "/skills";
      const raw = await apiClient<SkillsResponse>(endpoint);
      return SkillsResponseSchema.parse(raw);
    },
    initialData,
    initialDataUpdatedAt: () => Date.now(),
    staleTime: 5 * 60 * 1000,
  });
}

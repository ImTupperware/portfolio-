import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { resumeKeys } from "./use-resume";
import { WorkExperience, WorkExperienceSchema } from "../schemas/resume.schema";

export function useUpdateExperienceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<WorkExperience> }) => {
      const response = await apiClient<{ data: WorkExperience }>(`/experiences/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      return WorkExperienceSchema.parse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.all });
    },
  });
}

export function useDeleteExperienceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await apiClient<{ success: boolean; message: string }>(`/experiences/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.all });
    },
  });
}

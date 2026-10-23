import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { projectKeys } from "./use-projects";
import { Project, ProjectFormData, ProjectSchema } from "../schemas/project.schema";

export function useUpdateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ProjectFormData> }) => {
      const response = await apiClient<{ data: Project }>(`/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      return ProjectSchema.parse(response.data);
    },
    onSuccess: () => {
      // Automatically triggers background SWR refetch across all project views
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await apiClient<{ success: boolean; message: string }>(`/projects/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

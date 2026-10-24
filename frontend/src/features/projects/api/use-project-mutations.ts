import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { projectKeys } from "./use-projects";
import { Project, ProjectFormData, ProjectSchema } from "../schemas/project.schema";

export function useUpdateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      slug,
      data,
    }: {
      id: number;
      slug?: string;
      data: Partial<ProjectFormData>;
    }) => {
      const identifier = slug || id;
      const response = await apiClient<{ data: Project }>(`/projects/${identifier}`, {
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
    mutationFn: async ({ id, slug }: { id: number; slug?: string }) => {
      const identifier = slug || id;
      return await apiClient<{ success: boolean; message: string }>(`/projects/${identifier}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { resumeKeys } from "./use-resume";
import { Certification } from "../schemas/resume.schema";

export function useCreateCertificationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Certification> & { name: string; issuer: string; issue_date: string }) => {
      return await apiClient<{ success: boolean; data: Certification }>("/certifications", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.all });
    },
  });
}

export function useUpdateCertificationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Certification> }) => {
      return await apiClient<{ success: boolean; data: Certification }>(`/certifications/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.all });
    },
  });
}

export function useDeleteCertificationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return await apiClient<{ success: boolean; message: string }>(`/certifications/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.all });
    },
  });
}

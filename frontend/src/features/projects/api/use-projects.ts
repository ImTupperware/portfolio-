import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  PaginatedProjectsResponse,
  PaginatedProjectsResponseSchema,
  Project,
  ProjectFormData,
  ProjectSchema,
} from "../schemas/project.schema";
import { INITIAL_PROJECTS } from "../data/initial-projects";

export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: (params: { page?: number; perPage?: number; tag?: string; status?: string }) =>
    [...projectKeys.lists(), params] as const,
  details: () => [...projectKeys.all, "detail"] as const,
  detail: (slug: string) => [...projectKeys.details(), slug] as const,
};

export function useProjectsQuery(params: {
  page?: number;
  perPage?: number;
  tag?: string;
  status?: string;
} = {}) {
  const initialData = useMemo(() => {
    let filtered = INITIAL_PROJECTS.data;
    if (params.tag && params.tag !== "All") {
      filtered = filtered.filter((p) =>
        p.tags.some((t) => t.toLowerCase().includes(params.tag!.toLowerCase()))
      );
    }
    return {
      ...INITIAL_PROJECTS,
      data: filtered,
      meta: {
        ...INITIAL_PROJECTS.meta,
        total: filtered.length,
      },
    };
  }, [params.tag]);

  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set("page", params.page.toString());
      if (params.perPage) searchParams.set("per_page", params.perPage.toString());
      if (params.tag) searchParams.set("tag", params.tag);
      if (params.status) searchParams.set("status", params.status);

      const qs = searchParams.toString();
      const raw = await apiClient<PaginatedProjectsResponse>(
        `/projects${qs ? `?${qs}` : ""}`
      );
      // Strictly parse and sanitize incoming server response with Zod
      return PaginatedProjectsResponseSchema.parse(raw);
    },
    initialData,
    initialDataUpdatedAt: 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProjectDetailQuery(slug: string) {
  const fallbackProject = useMemo(
    () => INITIAL_PROJECTS.data.find((p) => p.slug === slug),
    [slug]
  );

  return useQuery({
    queryKey: projectKeys.detail(slug),
    queryFn: async () => {
      const raw = await apiClient<{ data: Project }>(`/projects/${slug}`);
      return ProjectSchema.parse(raw.data);
    },
    initialData: fallbackProject,
    initialDataUpdatedAt: 0,
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(slug),
  });
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const response = await apiClient<{ data: Project }>("/projects", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return ProjectSchema.parse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return apiClient<{ success: boolean }>(`/projects/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuthStore, AuthUser } from "@/features/auth/stores/auth-store";
import { ProfileFormData } from "../schemas/profile.schema";

interface UpdateProfileResponse {
  success: boolean;
  message: string;
  user: AuthUser;
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await apiClient<UpdateProfileResponse>("/user/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      });
      return response.user;
    },
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      // Invalidate resume bundle so that all components reflect updated profile immediately
      queryClient.invalidateQueries({ queryKey: ["resume", "bundle"] });
    },
  });
}

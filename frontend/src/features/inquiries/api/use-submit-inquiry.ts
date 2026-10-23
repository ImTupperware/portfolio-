import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { InquiryFormData } from "../schemas/inquiry.schema";

interface InquiryResponse {
  success: boolean;
  message: string;
}

export function useSubmitInquiryMutation() {
  return useMutation({
    mutationFn: async (payload: InquiryFormData): Promise<InquiryResponse> => {
      return apiClient<InquiryResponse>("/inquiries", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
  });
}

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { SendAiChatInput, AiChatResponse } from "../schemas/ai-chat.schema";

export function useSendAiChatMutation() {
  return useMutation({
    mutationFn: async (payload: SendAiChatInput) => {
      return await apiClient<AiChatResponse>("/ai/chat", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
  });
}

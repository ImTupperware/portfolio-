import { z } from "zod";

export const ChatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  createdAt: z.string(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const SendAiChatSchema = z.object({
  message: z.string().min(2, "Message must be at least 2 characters").max(1000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional(),
});

export type SendAiChatInput = z.infer<typeof SendAiChatSchema>;

export interface AiChatResponse {
  success: boolean;
  reply: string;
}

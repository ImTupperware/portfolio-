import React from "react";
import { ChatMessage } from "../schemas/ai-chat.schema";
import { Bot, User } from "lucide-react";

interface AiChatMessageProps {
  message: ChatMessage;
}

export function AiChatMessage({ message }: AiChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 text-xs leading-relaxed ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${
          isUser ? "bg-sky-500 text-slate-950" : "border border-indigo-500/40 bg-indigo-950/80 text-indigo-400"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 whitespace-pre-wrap ${
          isUser
            ? "bg-sky-500 text-slate-950 font-medium rounded-tr-none shadow-sm"
            : "border border-slate-800 bg-slate-900/90 text-slate-200 rounded-tl-none shadow-md"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

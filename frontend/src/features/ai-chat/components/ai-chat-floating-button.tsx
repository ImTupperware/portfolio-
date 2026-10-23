"use client";

import React from "react";
import { useUIStore } from "@/stores/ui-store";
import { Sparkles } from "lucide-react";

export function AiChatFloatingButton() {
  const toggle = useUIStore((state) => state.toggleAiChat);
  const isOpen = useUIStore((state) => state.isAiChatOpen);

  if (isOpen) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      title="Ask AI Career Assistant"
      aria-label="Ask AI Career Assistant"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-indigo-500/50 bg-indigo-950/90 px-4 py-3 text-xs font-semibold text-white shadow-xl shadow-indigo-950/60 backdrop-blur-md transition duration-300 hover:bg-indigo-900 hover:scale-105 active:scale-95 group"
    >
      <div className="relative flex h-5 w-5 items-center justify-center">
        <Sparkles className="h-4 w-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>
      <span className="hidden sm:inline">Ask AI Assistant</span>
    </button>
  );
}

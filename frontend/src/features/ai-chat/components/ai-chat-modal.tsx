"use client";

import React, { useState, useRef, useEffect } from "react";
import { useUIStore } from "@/stores/ui-store";
import { useSendAiChatMutation } from "../api/use-ai-chat";
import { ChatMessage } from "../schemas/ai-chat.schema";
import { AiChatMessage } from "./ai-chat-message";
import { Sparkles, Send, X, Bot, Loader2 } from "lucide-react";

const STARTERS = [
  "What are Ahmad's core technical skills?",
  "Tell me about his experience at Stealthx Performance",
  "What featured projects has he built?",
  "How can I contact Ahmad directly?",
];

export function AiChatModal() {
  const isOpen = useUIStore((state) => state.isAiChatOpen);
  const close = useUIStore((state) => state.closeAiChat);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I am Ahmad's AI Career Assistant. Ask me anything about Ahmad's full-stack engineering background, skills, or projects!",
      createdAt: new Date().toISOString(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mutation = useSendAiChatMutation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, mutation.isPending]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || mutation.isPending) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: text, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    mutation.mutate(
      { message: text },
      {
        onSuccess: (data) => {
          const aiMsg: ChatMessage = { id: `a-${Date.now()}`, role: "assistant", content: data.reply, createdAt: new Date().toISOString() };
          setMessages((prev) => [...prev, aiMsg]);
        },
        onError: (err) => {
          const errMsg: ChatMessage = { id: `e-${Date.now()}`, role: "assistant", content: `Error: ${err.message}`, createdAt: new Date().toISOString() };
          setMessages((prev) => [...prev, errMsg]);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6 bg-slate-950/70 backdrop-blur-sm">
      <div className="relative flex h-[85vh] sm:h-[580px] w-full sm:w-[420px] flex-col rounded-t-3xl sm:rounded-2xl border border-indigo-500/30 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-400">
              <Sparkles className="h-4 w-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Ahmad AI Assistant</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </h3>
              <p className="text-[10px] text-slate-400">Ask about resume, skills & projects</p>
            </div>
          </div>
          <button type="button" onClick={close} className="rounded-lg p-1.5 text-slate-400 hover:text-white" aria-label="Close chat">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Message feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((m) => (
            <AiChatMessage key={m.id} message={m} />
          ))}
          {mutation.isPending && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 animate-pulse pl-1">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Analyzing resume facts...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick starter chips */}
        {messages.length <= 2 && (
          <div className="px-3 pb-2 flex flex-wrap gap-1.5">
            {STARTERS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(s)}
                className="rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1 text-[11px] text-slate-300 hover:border-indigo-500/40 hover:text-white transition"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Footer input */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="border-t border-slate-800 bg-slate-950 p-2.5 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask about Ahmad's career..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || mutation.isPending}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500 text-slate-950 hover:bg-indigo-400 disabled:opacity-40 transition"
            aria-label="Send message"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

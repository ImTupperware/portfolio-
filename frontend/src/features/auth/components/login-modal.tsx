"use client";

import React, { useState } from "react";
import { useAuthStore } from "../stores/auth-store";
import { apiClient, ApiError } from "@/lib/api-client";
import { X, AlertCircle, LogIn, Lock } from "lucide-react";

export function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, login } = useAuthStore();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiClient<{
        success: boolean;
        token: string;
        user: { id: number; name: string; email: string; role: string };
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      login(response.token, response.user);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.payload.message || "Invalid authentication credentials.");
      } else {
        setErrorMessage("Connection failure. Please ensure the API backend is reachable.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <button type="button" onClick={closeLoginModal} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
          <Lock className="h-4 w-4" />
          <span>PORTFOLIO_OWNER_AUTH</span>
        </div>
        <h3 className="text-xl font-bold text-white">Owner Sign In</h3>
        <p className="mt-1 text-xs text-slate-400">Sign in to edit your profile, career timeline, and projects.</p>

        {errorMessage && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/40 p-2.5 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50 active:scale-95 shadow-md shadow-sky-500/20"
          >
            {isLoading ? <span className="animate-spin h-3.5 w-3.5 border-2 border-slate-950 border-t-transparent rounded-full" /> : <LogIn className="h-3.5 w-3.5" />}
            <span>{isLoading ? "Authenticating..." : "Unlock Edit Controls"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

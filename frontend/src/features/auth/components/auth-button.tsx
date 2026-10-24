"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "../stores/auth-store";
import { Lock, LogOut, Edit3 } from "lucide-react";

export function AuthButton() {
  const { user, isEditMode, openLoginModal, logout, toggleEditMode, initFromStorage } = useAuthStore();

  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  if (!user) {
    return (
      <button
        type="button"
        onClick={openLoginModal}
        title="Owner Login"
        aria-label="Owner Login"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-slate-400 hover:text-white hover:border-white/20 hover:bg-slate-800 transition active:scale-95 shadow-sm"
      >
        <Lock className="h-3.5 w-3.5" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={toggleEditMode}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition active:scale-95 ${
          isEditMode
            ? "border-amber-500/50 bg-amber-950/70 text-amber-300 shadow-sm shadow-amber-500/20"
            : "border-white/10 bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800"
        }`}
        title={isEditMode ? "Edit Mode Active (Click to disable)" : "Enable Edit Mode"}
        aria-label="Toggle in-place content editor mode"
      >
        <Edit3 className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={logout}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-slate-400 transition hover:bg-red-950/40 hover:border-red-500/30 hover:text-red-400 active:scale-95"
        title="Log out"
        aria-label="Log out"
      >
        <LogOut className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

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
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white active:scale-95"
      >
        <Lock className="h-3 w-3 text-slate-400" />
        <span>Owner Login</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleEditMode}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
          isEditMode
            ? "border-amber-500/50 bg-amber-950/70 text-amber-300 shadow-sm shadow-amber-500/20"
            : "border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
        }`}
        title="Toggle in-place content editor mode"
      >
        <Edit3 className="h-3 w-3" />
        <span>{isEditMode ? "Edit Mode: Active" : "Enable Edit Mode"}</span>
      </button>

      <button
        type="button"
        onClick={logout}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/80 p-1.5 text-slate-400 transition hover:bg-red-950/40 hover:border-red-500/30 hover:text-red-400"
        title="Log out"
      >
        <LogOut className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

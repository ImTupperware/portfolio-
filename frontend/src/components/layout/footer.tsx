import React from "react";
import { Layers, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400 text-xs">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-sky-400" />
          <span className="font-medium text-slate-300">
            Ahmad Nurjuwaidi Bin Che Adnan &bull; Full-Stack Software Engineer
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Next.js 15 &bull; React 19 &bull; Laravel 12 &bull; PostgreSQL &amp; Supabase</span>
        </div>

        <p className="text-slate-500 font-medium">
          &copy; {new Date().getFullYear()} Ahmad Nurjuwaidi. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

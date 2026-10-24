import React from "react";
import { Layers, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-10 border-t border-white/[0.08] bg-slate-950/80 backdrop-blur-xl py-12 text-slate-400 text-xs">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 md:flex-row">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-sm shrink-0">
            <Layers className="h-3.5 w-3.5" />
          </div>
          <div className="text-left">
            <span className="font-bold text-slate-200 block text-sm">
              Ahmad Nurjuwaidi
            </span>
            <span className="text-[11px] text-slate-500">
              BSc Computer Science (Software Engineering) &bull; UMPSA &apos;25
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
          <span className="rounded-full border border-white/10 bg-slate-900/60 px-2.5 py-0.5">Next.js 15</span>
          <span className="rounded-full border border-white/10 bg-slate-900/60 px-2.5 py-0.5">React 19</span>
          <span className="rounded-full border border-white/10 bg-slate-900/60 px-2.5 py-0.5">TypeScript</span>
          <span className="rounded-full border border-white/10 bg-slate-900/60 px-2.5 py-0.5">Laravel 12</span>
          <span className="rounded-full border border-white/10 bg-slate-900/60 px-2.5 py-0.5">PostgreSQL &amp; TiDB</span>
        </div>

        <p className="text-slate-500 font-medium text-center md:text-right">
          &copy; {new Date().getFullYear()} Ahmad Nurjuwaidi. Built with Next.js &amp; Laravel.
        </p>
      </div>
    </footer>
  );
}

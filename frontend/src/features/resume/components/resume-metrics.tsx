import React from "react";

export function ResumeMetrics() {
  return (
    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3">
        <span className="block text-2xl font-extrabold text-white">80%</span>
        <span className="text-xs text-slate-400">Booking Errors Reduced</span>
      </div>
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3">
        <span className="block text-2xl font-extrabold text-sky-400">90%</span>
        <span className="text-xs text-slate-400">Staff Workload Cut</span>
      </div>
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3">
        <span className="block text-2xl font-extrabold text-teal-400">100%</span>
        <span className="text-xs text-slate-400">Offline POS Continuity</span>
      </div>
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3">
        <span className="block text-2xl font-extrabold text-indigo-400">3.01</span>
        <span className="text-xs text-slate-400">BSc CS (Hons) CGPA</span>
      </div>
    </div>
  );
}

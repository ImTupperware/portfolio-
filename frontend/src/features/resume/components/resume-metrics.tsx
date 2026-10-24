import React from "react";
import { TrendingUp, Clock, WifiOff, Award } from "lucide-react";

export function ResumeMetrics() {
  const metrics = [
    {
      value: "80%",
      label: "Booking Errors Cut",
      detail: "Automated barbershop SaaS slot scheduling",
      icon: TrendingUp,
      color: "from-sky-400 to-cyan-500",
      textColor: "text-sky-400",
      borderColor: "group-hover:border-sky-500/40",
    },
    {
      value: "90%",
      label: "Staff Admin Saved",
      detail: "Automated daily commissions & payouts",
      icon: Clock,
      color: "from-teal-400 to-emerald-500",
      textColor: "text-teal-400",
      borderColor: "group-hover:border-teal-500/40",
    },
    {
      value: "100%",
      label: "Offline POS Continuity",
      detail: "Zero downtime retail sales & thermal print",
      icon: WifiOff,
      color: "from-amber-400 to-orange-500",
      textColor: "text-amber-400",
      borderColor: "group-hover:border-amber-500/40",
    },
    {
      value: "3.01",
      label: "UMPSA BSc CS (Hons)",
      detail: "Software Engineering major (2025)",
      icon: Award,
      color: "from-indigo-400 to-violet-500",
      textColor: "text-indigo-400",
      borderColor: "group-hover:border-indigo-500/40",
    },
  ];

  return (
    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-slate-800/80">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div
            key={idx}
            className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/60 p-3.5 sm:p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-slate-900/80 hover:shadow-xl ${m.borderColor}`}
          >
            {/* Top Glowing Gradient Line */}
            <div
              className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r ${m.color} opacity-70 group-hover:opacity-100 transition-opacity`}
            />

            <div className="flex items-center justify-between mb-1">
              <span className={`text-2xl sm:text-3xl font-black tracking-tight ${m.textColor}`}>
                {m.value}
              </span>
              <Icon className="h-4 w-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
            </div>

            <span className="block text-xs font-bold text-slate-200 leading-snug">
              {m.label}
            </span>
            <span className="mt-0.5 block text-[11px] text-slate-400 leading-tight">
              {m.detail}
            </span>
          </div>
        );
      })}
    </div>
  );
}

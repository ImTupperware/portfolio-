"use client";

import React from "react";
import Image from "next/image";
import { GraduationCap, Laptop } from "lucide-react";

interface HeroPortraitProps {
  name?: string;
}

export function HeroPortrait({ name = "Ahmad Nurjuwaidi" }: HeroPortraitProps) {
  return (
    <div className="relative flex items-center justify-center select-none w-full max-w-[270px] sm:max-w-[360px] lg:max-w-[420px]">
      {/* Dynamic Multi-layered Ambient Aurora Glow */}
      <div
        aria-hidden="true"
        className="absolute top-10 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-gradient-to-tr from-sky-500/25 via-indigo-600/20 to-teal-400/20 blur-[90px] animate-pulse-glow pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-14 left-1/2 -translate-x-1/2 h-56 w-80 rounded-full bg-indigo-600/20 blur-[100px] pointer-events-none"
      />

      {/* Floating Modern Micro-Badges */}
      <div className="hidden sm:flex absolute -top-2 -left-4 z-20 items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-3.5 py-2 backdrop-blur-xl shadow-xl animate-float-slow">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
          <Laptop className="h-4 w-4" />
        </div>
        <div className="text-left">
          <p className="text-[11px] font-bold text-white leading-none">Cikda Biz POS</p>
          <p className="text-[10px] text-emerald-400 font-medium">Offline-First Architect</p>
        </div>
      </div>

      <div className="hidden sm:flex absolute bottom-24 -right-4 z-20 items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-3.5 py-2 backdrop-blur-xl shadow-xl">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-950/80 border border-sky-500/40 text-sky-400">
          <GraduationCap className="h-4 w-4" />
        </div>
        <div className="text-left">
          <p className="text-[11px] font-bold text-white leading-none">UMPSA 2025</p>
          <p className="text-[10px] text-sky-400 font-medium">BSc CS (SE) Honours</p>
        </div>
      </div>

      {/* Portrait with complete borderless blend */}
      <div
        className="relative w-full aspect-[4/5] flex items-end justify-center pointer-events-none z-10"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 65%, rgba(0,0,0,0.5) 85%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 65%, rgba(0,0,0,0.5) 85%, transparent 100%)",
        }}
      >
        <Image
          src="/ahmad-portrait.webp"
          alt={name}
          width={1033}
          height={1328}
          priority
          quality={95}
          className="w-full h-auto object-contain object-bottom drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)]"
        />

        {/* Soft bottom fade overlay merging seamlessly into page background (#0B0F17) */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/80 to-transparent pointer-events-none"
        />
      </div>
    </div>
  );
}

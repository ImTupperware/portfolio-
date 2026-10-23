"use client";

import React from "react";
import Image from "next/image";

interface HeroPortraitProps {
  name?: string;
}

export function HeroPortrait({ name = "Ahmad Nurjuwaidi" }: HeroPortraitProps) {
  return (
    <div className="relative flex items-center justify-center select-none w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[380px]">
      {/* Organic Ambient Backlight Glow (No border, fades smoothly into #0B0F17) */}
      <div
        aria-hidden="true"
        className="absolute top-10 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-gradient-to-tr from-sky-500/20 via-indigo-600/20 to-teal-400/10 blur-[80px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-16 left-1/2 -translate-x-1/2 h-48 w-72 rounded-full bg-indigo-600/15 blur-[90px] pointer-events-none"
      />

      {/* Portrait with complete borderless blend */}
      <div
        className="relative w-full aspect-[4/5] flex items-end justify-center pointer-events-none"
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
          className="w-full h-auto object-contain object-bottom drop-shadow-[0_25px_45px_rgba(0,0,0,0.85)]"
        />

        {/* Soft bottom fade overlay merging into page background (#0B0F17) */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/70 to-transparent pointer-events-none"
        />
      </div>
    </div>
  );
}

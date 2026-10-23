import React from "react";
import { ContactTrigger } from "@/features/inquiries/components/contact-trigger";
import { ShieldCheck, Database, Zap, Lock } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16">
      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-950/30 px-3.5 py-1 text-xs font-mono text-cyan-300 backdrop-blur-md mb-6">
        <Lock className="h-3.5 w-3.5 text-cyan-400" />
        <span>ZERO_TRUST ARCHITECTURE &bull; NEXT.JS 15 + LARAVEL 11</span>
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
        Building Resilient, <br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
          High-Integrity Systems
        </span>
      </h1>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-400">
        Principal Full-Stack Architect & Cyber Security Specialist engineering mission-critical web applications.
        Strict anti-IDOR authorization, ACID transactional consistency, TanStack Query reactive caching, and sub-150-line modular component design.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <ContactTrigger />
        <a
          href="#projects"
          className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
        >
          Explore Work
        </a>
      </div>

      <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-zinc-900 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-cyan-400" />
          <span>Anti-IDOR Ownership Gates</span>
        </div>
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-cyan-400" />
          <span>MySQL 8.0 B-Tree Indexes</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-cyan-400" />
          <span>TanStack Query v5 Zero-State</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-cyan-400" />
          <span>Token-Bucket Rate Limiters</span>
        </div>
      </div>
    </section>
  );
}

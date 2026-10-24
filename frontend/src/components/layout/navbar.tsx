"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUIStore } from "@/stores/ui-store";
import { AuthButton } from "@/features/auth/components/auth-button";
import { LoginModal } from "@/features/auth/components/login-modal";
import { Layers, Mail, Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const openContactModal = useUIStore((state) => state.openContactModal);

  const navLinks = [
    { href: "/#about", label: "About" },
    { href: "/#projects", label: "Projects" },
    { href: "/#experience", label: "Experience" },
    { href: "/#skills", label: "Skills" },
    { href: "/#education", label: "Education" },
    { href: "/#certifications", label: "Involvement" },
  ];

  return (
    <>
      <header className="sticky top-3 z-40 w-full px-4 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-2xl md:rounded-full border border-white/10 bg-slate-950/75 backdrop-blur-2xl shadow-2xl px-4 sm:px-6 py-2.5 transition-all">
          <div className="flex items-center justify-between">
            {/* Brand Logo & Name */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-teal-400 text-white shadow-md shadow-sky-500/25 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                <Layers className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors">
                    Ahmad Nurjuwaidi
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Available
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-400 hidden sm:block">
                  Software Engineering Fresh Graduate &bull; UMPSA &apos;25
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-300">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-3.5 py-1.5 transition-all hover:text-white hover:bg-white/5 active:scale-95"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions & Utilities */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={openContactModal}
                className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/40 bg-sky-950/60 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-sky-300 transition hover:bg-sky-900/80 hover:text-sky-200 active:scale-95 shadow-sm shadow-sky-950/40"
                title="Send Message"
              >
                <Mail className="h-3.5 w-3.5 text-sky-400" />
                <span className="hidden sm:inline">Contact</span>
              </button>

              <AuthButton />

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition active:scale-95"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="mt-3 pt-3 border-t border-white/10 lg:hidden flex flex-col gap-1 pb-2">
              <div className="grid grid-cols-2 gap-1.5 mb-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-white/5 bg-slate-900/60 py-2.5 px-3 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 hover:border-white/15 transition active:scale-95"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="pt-2 mt-1 border-t border-white/5 flex items-center justify-between px-1">
                <span className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Available Immediately (KL &bull; Remote)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openContactModal();
                  }}
                  className="inline-flex items-center gap-1 text-xs text-sky-400 font-bold hover:underline"
                >
                  <Mail className="h-3 w-3" /> Get in Touch
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      <LoginModal />
    </>
  );
}

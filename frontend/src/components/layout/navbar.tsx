"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUIStore } from "@/stores/ui-store";
import { AuthButton } from "@/features/auth/components/auth-button";
import { LoginModal } from "@/features/auth/components/login-modal";
import { Mail, Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const openContactModal = useUIStore((state) => state.openContactModal);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-white/[0.08] bg-[#0B0F17]/85 backdrop-blur-xl shadow-lg shadow-black/40"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4">
          {/* Brand Name (Logo box removed as requested) */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-sky-300 transition-colors">
              Ahmad Nurjuwaidi
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Available
            </span>
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openContactModal}
              className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/40 bg-sky-950/60 px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-sky-300 transition hover:bg-sky-900/80 hover:text-sky-200 active:scale-95 shadow-sm shadow-sky-950/40"
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
              className="lg:hidden flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition active:scale-95"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-white/[0.08] bg-[#0B0F17]/95 backdrop-blur-2xl lg:hidden px-4 py-3 shadow-2xl">
            <div className="grid grid-cols-2 gap-1.5 mb-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl border border-white/5 bg-slate-900/70 py-2.5 px-3 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 hover:border-white/15 transition active:scale-95"
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
      </header>
      <LoginModal />
    </>
  );
}

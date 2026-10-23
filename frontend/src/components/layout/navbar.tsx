"use client";

import React from "react";
import Link from "next/link";
import { useUIStore } from "@/stores/ui-store";
import { AuthButton } from "@/features/auth/components/auth-button";
import { LoginModal } from "@/features/auth/components/login-modal";
import { Layers, Mail } from "lucide-react";

export function Navbar() {
  const openContactModal = useUIStore((state) => state.openContactModal);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20 transition-transform group-hover:scale-105">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block">
                Ahmad Nurjuwaidi
              </span>
              <span className="block text-xs font-medium text-slate-400">
                Software Engineering Fresh Graduate
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="/#about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/#experience" className="hover:text-white transition-colors">
              Internship
            </Link>
            <Link href="/#projects" className="hover:text-white transition-colors">
              Projects
            </Link>
            <Link href="/#skills" className="hover:text-white transition-colors">
              Skills
            </Link>
            <Link href="/#education" className="hover:text-white transition-colors">
              Education
            </Link>
            <Link href="/#certifications" className="hover:text-white transition-colors">
              Involvement
            </Link>
            <button
              type="button"
              onClick={openContactModal}
              className="flex items-center gap-1.5 rounded-lg bg-slate-800/90 border border-slate-700/80 px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white active:scale-95"
            >
              <Mail className="h-3.5 w-3.5 text-sky-400" />
              <span>Contact</span>
            </button>
            <AuthButton />
          </nav>
        </div>
      </header>
      <LoginModal />
    </>
  );
}

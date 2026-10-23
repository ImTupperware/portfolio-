"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useUIStore } from "@/stores/ui-store";
import { Mail } from "lucide-react";

const DynamicContactModal = dynamic(() => import("./contact-modal"), {
  ssr: false,
  loading: () => null,
});

interface ContactTriggerProps {
  iconOnly?: boolean;
}

export function ContactTrigger({ iconOnly = false }: ContactTriggerProps) {
  const isContactModalOpen = useUIStore((state) => state.isContactModalOpen);
  const openContactModal = useUIStore((state) => state.openContactModal);
  const closeContactModal = useUIStore((state) => state.closeContactModal);

  return (
    <>
      <button
        type="button"
        onClick={openContactModal}
        title="Get in Touch / Contact"
        aria-label="Get in Touch / Contact"
        className={
          iconOnly
            ? "flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20 transition hover:bg-sky-400 hover:scale-105 active:scale-95"
            : "inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-sky-500/20 transition hover:bg-sky-400 active:scale-95"
        }
      >
        <Mail className="h-5 w-5" />
        {!iconOnly && <span>Get in Touch</span>}
      </button>

      {isContactModalOpen && (
        <DynamicContactModal isOpen={isContactModalOpen} onClose={closeContactModal} />
      )}
    </>
  );
}

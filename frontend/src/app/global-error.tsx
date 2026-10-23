"use client";

import React from "react";
import { ErrorFallback } from "@/components/common/error-fallback";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full flex items-center justify-center bg-zinc-950 p-6 text-zinc-100">
        <div className="w-full max-w-md">
          <ErrorFallback
            title="Critical System Error"
            message={error.message || "A critical failure prevented the application from loading."}
            correlationId={error.digest}
            onReset={reset}
          />
        </div>
      </body>
    </html>
  );
}

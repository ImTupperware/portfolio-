"use client";

import React, { useEffect } from "react";
import { ErrorFallback } from "@/components/common/error-fallback";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception to monitoring provider
    console.error("Next.js Root Segment caught error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full max-w-md">
        <ErrorFallback
          title="Application Segment Error"
          message={error.message || "An unexpected error disrupted the application view."}
          correlationId={error.digest}
          onReset={reset}
        />
      </div>
    </div>
  );
}

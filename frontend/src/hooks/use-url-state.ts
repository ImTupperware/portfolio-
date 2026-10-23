"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

export interface UrlFilterParams {
  tag?: string;
  search?: string;
  page?: number;
  status?: string;
}

export function useUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Read current URL State
  const tag = searchParams.get("tag") || undefined;
  const search = searchParams.get("search") || undefined;
  const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
  const status = searchParams.get("status") || undefined;

  // Update URL State without full page reload
  const setUrlParams = useCallback(
    (updates: Partial<UrlFilterParams>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      Object.entries(updates).forEach(([key, val]) => {
        if (val === undefined || val === null || val === "" || (key === "page" && val === 1)) {
          current.delete(key);
        } else {
          current.set(key, String(val));
        }
      });

      const queryString = current.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;

      startTransition(() => {
        router.replace(targetUrl, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  const resetUrlParams = useCallback(() => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }, [pathname, router]);

  return {
    state: { tag, search, page, status },
    setUrlParams,
    resetUrlParams,
    isPending,
  };
}

"use client";

import React, { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Search, X } from "lucide-react";

interface OrderSearchInputProps {
  initialValue?: string;
  onSearchChange: (value: string) => void;
}

export function OrderSearchInput({
  initialValue = "",
  onSearchChange,
}: OrderSearchInputProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Propagate only when debounced value changes
  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  return (
    <div className="relative w-full max-w-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
        <Search className="h-4 w-4" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by order #, customer..."
        className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 py-2 pl-9 pr-8 text-sm text-zinc-100 placeholder-zinc-500 transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={() => setSearchTerm("")}
          className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-zinc-400 hover:text-white"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

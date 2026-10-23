import React from "react";

interface OrderFilterTabsProps {
  currentStatus?: string;
  onStatusSelect: (status?: string) => void;
}

const TABS = [
  { id: "all", label: "All Orders" },
  { id: "pending", label: "Pending" },
  { id: "processing", label: "Processing" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

export function OrderFilterTabs({
  currentStatus = "all",
  onStatusSelect,
}: OrderFilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-zinc-900/60 border border-zinc-800">
      {TABS.map((tab) => {
        const isActive = (currentStatus || "all") === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onStatusSelect(tab.id === "all" ? undefined : tab.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              isActive
                ? "bg-cyan-500 text-zinc-950 font-bold shadow-md shadow-cyan-500/20"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

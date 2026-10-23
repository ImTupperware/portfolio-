import React from "react";
import { OrderStatus } from "../schemas/order.schema";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-amber-950/60 text-amber-300 border-amber-500/30",
  },
  processing: {
    label: "Processing",
    className: "bg-blue-950/60 text-blue-300 border-blue-500/30",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-950/60 text-emerald-300 border-emerald-500/30",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-950/60 text-red-300 border-red-500/30",
  },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    className: "bg-zinc-800 text-zinc-300 border-zinc-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

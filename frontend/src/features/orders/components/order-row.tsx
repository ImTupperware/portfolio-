import React from "react";
import { Order } from "../schemas/order.schema";
import { OrderStatusBadge } from "./order-status-badge";
import { Package, CreditCard, Calendar } from "lucide-react";

interface OrderRowProps {
  order: Order;
}

export function OrderRow({ order }: OrderRowProps) {
  const formattedDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recent";

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm transition duration-200 hover:border-zinc-700 hover:bg-zinc-900/80">
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-zinc-300 group-hover:text-cyan-400 transition-colors">
          <Package className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-white tracking-tight">
              {order.order_number}
            </span>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-zinc-400">
            <span className="text-zinc-200 font-medium">{order.customer_name}</span>
            <span className="text-zinc-500">&bull;</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-zinc-500" />
              {formattedDate}
            </span>
            <span className="text-zinc-500">&bull;</span>
            <span className="flex items-center gap-1">
              <CreditCard className="h-3 w-3 text-zinc-500" />
              {order.payment_method}
            </span>
          </div>
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-zinc-800 pt-2 sm:pt-0">
        <span className="font-mono text-base font-bold text-white">
          ${order.total_amount.toFixed(2)}
        </span>
        <span className="text-xs text-zinc-500 font-mono">
          {order.items_count} {order.items_count === 1 ? "item" : "items"}
        </span>
      </div>
    </div>
  );
}

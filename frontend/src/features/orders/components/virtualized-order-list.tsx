"use client";

import React, { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Order } from "../schemas/order.schema";
import { OrderRow } from "./order-row";

interface VirtualizedOrderListProps {
  orders: Order[];
}

export function VirtualizedOrderList({ orders }: VirtualizedOrderListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: orders.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 82, // approximate height of OrderRow + gap
    overscan: 5,
  });

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/10 p-2">
      <div className="mb-2 px-2 flex justify-between items-center text-[11px] font-mono text-cyan-400">
        <span>VIRTUAL_ENGINE_ACTIVE // &gt;50_ITEMS</span>
        <span>Rendering {orders.length} orders at 60 FPS</span>
      </div>

      <div
        ref={parentRef}
        className="h-[600px] w-full overflow-y-auto pr-2 scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700"
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const order = orders[virtualRow.index];
            return (
              <div
                key={order.id}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className="pb-2.5"
              >
                <OrderRow order={order} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import { Package, X } from "lucide-react";
import type { Order } from "@/lib/types";

export default function OrdersModal({
  open,
  orders,
  onClose,
}: {
  open: boolean;
  orders: Order[];
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 p-4">
      <div className="card w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-base font-semibold text-ink">My orders</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-muted hover:text-ink">
            <X className="size-5" />
          </button>
        </div>
        <div className="scroll-thin max-h-[70vh] space-y-3 overflow-y-auto p-5">
          {orders.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="mx-auto size-10 text-line" />
              <p className="mt-3 text-sm text-muted">No orders yet. Your placed orders will appear here.</p>
            </div>
          ) : (
            orders.map((order) => (
              <article key={order.id} className="rounded-xl border border-line p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-ink">{order.id}</p>
                    <p className="text-[11px] text-muted">
                      {new Date(order.createdAt).toLocaleDateString("en-US")} · {order.customer.email}
                    </p>
                  </div>
                  <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[10px] font-semibold text-brand">
                    Confirmed
                  </span>
                </div>
                <div className="mt-3 space-y-1 border-t border-line pt-3">
                  {order.items.map((item) => (
                    <div key={item.slug} className="flex justify-between text-xs">
                      <span className="text-muted">{item.name} × {item.quantity}</span>
                      <span className="text-ink">${item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-between border-t border-line pt-3 text-sm font-bold text-ink">
                  <span>Total</span><span>${order.total}</span>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

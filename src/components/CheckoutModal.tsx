"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";
import type { CartItem, Order } from "@/lib/types";

type Props = {
  open: boolean;
  items: CartItem[];
  discountCode: string;
  onClose: () => void;
  onPlaced: (order: Order) => void;
};

const FIELDS = [
  { key: "name", label: "Full name", placeholder: "Aarav Sharma" },
  { key: "email", label: "Email", placeholder: "aarav@example.com" },
  { key: "address", label: "Address", placeholder: "42 Market Street" },
  { key: "city", label: "City", placeholder: "Bengaluru" },
  { key: "zip", label: "ZIP / PIN", placeholder: "560001" },
] as const;

export default function CheckoutModal({ open, items, discountCode, onClose, onPlaced }: Props) {
  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", zip: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<Order | null>(null);

  if (!open) return null;

  async function placeOrder(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: items.map((item) => ({ slug: item.slug, quantity: item.quantity })),
          discountCode: discountCode || undefined,
        }),
      });
      const payload = (await response.json()) as { order?: Order; error?: string };
      if (!response.ok || !payload.order) throw new Error(payload.error ?? "Could not place order");
      setOrder(payload.order);
      onPlaced(payload.order);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 p-4">
      <div className="card w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-base font-semibold text-ink">
            {order ? "Order confirmed" : "Checkout"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-muted hover:text-ink">
            <X className="size-5" />
          </button>
        </div>

        {order ? (
          <div className="px-6 py-10 text-center">
            <CheckCircle2 className="mx-auto size-14 text-brand" />
            <h3 className="mt-4 text-xl font-bold text-ink">Thank you, {order.customer.name.split(" ")[0]}!</h3>
            <p className="mt-2 text-sm text-muted">Your order has been placed successfully.</p>
            <div className="mx-auto mt-5 max-w-xs rounded-xl border border-line bg-panel2 p-4 text-left text-sm">
              <div className="flex justify-between"><span className="text-muted">Order ID</span><span className="font-semibold text-ink">{order.id}</span></div>
              <div className="mt-2 flex justify-between"><span className="text-muted">Items</span><span className="text-ink">{order.items.length}</span></div>
              <div className="mt-2 flex justify-between border-t border-line pt-2 font-bold text-ink"><span>Total</span><span>${order.total}</span></div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand/90"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <form onSubmit={placeOrder} className="scroll-thin max-h-[75vh] space-y-4 overflow-y-auto px-5 py-5">
            <div className="rounded-xl bg-panel2 p-3 text-xs text-muted">
              {items.length} item{items.length === 1 ? "" : "s"} · demo checkout, no payment is taken.
            </div>
            {FIELDS.map((field) => (
              <label key={field.key} className="block">
                <span className="text-xs font-medium text-ink">{field.label}</span>
                <input
                  required
                  type={field.key === "email" ? "email" : "text"}
                  value={form[field.key]}
                  onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                  placeholder={field.placeholder}
                  className="mt-1.5 w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-ink outline-none placeholder:text-muted focus:border-brand"
                />
              </label>
            ))}
            {error ? <p className="text-xs text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-50"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : null}
              {busy ? "Placing order…" : "Place order"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { Minus, Plus, ShoppingBag, Tag, Trash2, X } from "lucide-react";
import type { CartItem } from "@/lib/types";

type Props = {
  open: boolean;
  items: CartItem[];
  discountCode: string;
  applied: boolean;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  onClose: () => void;
  onQuantity: (slug: string, delta: number) => void;
  onRemove: (slug: string) => void;
  onDiscountChange: (value: string) => void;
  onApplyDiscount: () => void;
  onCheckout: () => void;
};

export default function CartDrawer({
  open,
  items,
  discountCode,
  applied,
  subtotal,
  discount,
  shipping,
  total,
  onClose,
  onQuantity,
  onRemove,
  onDiscountChange,
  onApplyDiscount,
  onCheckout,
}: Props) {
  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close cart"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-[2px]"
      />
      <aside className="slide-in fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-line bg-panel shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-5 text-brand" />
            <h2 className="text-base font-semibold text-ink">Your cart</h2>
            <span className="rounded-full bg-panel2 px-2 py-0.5 text-xs text-muted">{items.length}</span>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-muted hover:text-ink">
            <X className="size-5" />
          </button>
        </div>

        <div className="scroll-thin min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="size-10 text-line" />
              <p className="mt-3 text-sm font-medium text-ink">Your cart is empty</p>
              <p className="mt-1 text-xs text-muted">Add something you like — free shipping over $100.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.slug} className="flex gap-3 rounded-xl border border-line p-3">
                  <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-panel2">
                    <Image src={item.image} alt={item.name} width={64} height={64} className="size-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{item.name}</p>
                    <p className="text-xs text-muted">${item.price} each</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center rounded-lg border border-line">
                        <button
                          type="button"
                          onClick={() => onQuantity(item.slug, -1)}
                          aria-label="Decrease quantity"
                          className="px-2 py-1 text-muted hover:text-ink"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-semibold text-ink">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onQuantity(item.slug, 1)}
                          aria-label="Increase quantity"
                          className="px-2 py-1 text-muted hover:text-ink"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(item.slug)}
                        aria-label={`Remove ${item.name}`}
                        className="text-muted hover:text-red-600"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-ink">${item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-line px-5 py-4">
          <div className="flex gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-line px-3">
              <Tag className="size-3.5 text-muted" />
              <input
                value={discountCode}
                onChange={(event) => onDiscountChange(event.target.value)}
                placeholder="Discount code"
                className="w-full bg-transparent py-2 text-xs text-ink outline-none placeholder:text-muted"
              />
            </div>
            <button
              type="button"
              onClick={onApplyDiscount}
              disabled={!discountCode.trim()}
              className="rounded-lg border border-line px-3 text-xs font-semibold text-brand disabled:opacity-40"
            >
              Apply
            </button>
          </div>
          {applied ? <p className="mt-1.5 text-[11px] text-brand">WELCOME10 applied — 10% off 🎉</p> : null}
          {!applied && discountCode ? (
            <p className="mt-1.5 text-[11px] text-muted">Hint: try WELCOME10</p>
          ) : null}

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted">
              <span>Subtotal</span><span>${subtotal}</span>
            </div>
            {discount ? (
              <div className="flex justify-between text-brand">
                <span>Discount</span><span>-${discount}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-muted">
              <span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
            </div>
            <div className="flex justify-between border-t border-line pt-2 text-base font-bold text-ink">
              <span>Total</span><span>${total}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={items.length === 0}
            onClick={onCheckout}
            className="mt-4 w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-40"
          >
            Checkout
          </button>
          <p className="mt-2 text-center text-[10px] text-muted">Demo checkout — no real payment is taken</p>
        </div>
      </aside>
    </>
  );
}

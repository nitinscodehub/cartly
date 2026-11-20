import { randomUUID } from "node:crypto";
import { findProduct } from "./products";
import type { Order, OrderItem } from "./types";

type OrderStore = { orders: Order[] };

const globalScope = globalThis as typeof globalThis & { __cartlyOrders?: OrderStore };
const store: OrderStore = globalScope.__cartlyOrders ?? { orders: [] };
globalScope.__cartlyOrders = store;

export function listOrders() {
  return [...store.orders].reverse();
}

type CreateInput = {
  customer: Order["customer"];
  items: Array<{ slug: string; quantity: number }>;
  discountCode?: string;
};

export function createOrder(input: CreateInput): Order {
  const validItems: OrderItem[] = [];

  for (const line of input.items) {
    const product = findProduct(line.slug);
    const quantity = Math.min(Math.max(Math.floor(line.quantity), 1), 20);
    if (!product) continue;
    validItems.push({
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity,
    });
  }

  if (!validItems.length) throw new Error("Cart is empty");

  const customer = input.customer;
  if (!customer?.name?.trim() || !customer?.email?.includes("@")) {
    throw new Error("A valid name and email are required");
  }

  const subtotal = validItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = input.discountCode?.trim().toUpperCase() === "WELCOME10"
    ? Math.round(subtotal * 0.1)
    : 0;
  const shipping = subtotal - discount >= 100 ? 0 : 9;

  const order: Order = {
    id: `CR-${randomUUID().slice(0, 8).toUpperCase()}`,
    customer: {
      name: customer.name.trim().slice(0, 120),
      email: customer.email.trim().slice(0, 160),
      address: (customer.address ?? "").trim().slice(0, 200),
      city: (customer.city ?? "").trim().slice(0, 120),
      zip: (customer.zip ?? "").trim().slice(0, 20),
    },
    items: validItems,
    subtotal,
    discount,
    shipping,
    total: subtotal - discount + shipping,
    createdAt: new Date().toISOString(),
  };

  store.orders.push(order);
  return order;
}

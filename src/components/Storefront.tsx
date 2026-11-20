"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Package,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import CartDrawer from "./CartDrawer";
import CheckoutModal from "./CheckoutModal";
import OrdersModal from "./OrdersModal";
import ProductCard from "./ProductCard";
import { CATEGORIES } from "@/lib/products";
import type { CartItem, Order, Product } from "@/lib/types";

type Props = { initialProducts: Product[] };

export default function Storefront({ initialProducts }: Props) {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [applied, setApplied] = useState(false);
  const [toast, setToast] = useState("");

  const filtered = useMemo(() => {
    let list = initialProducts.filter(
      (product) => category === "All" || product.category === category,
    );
    const query = search.trim().toLowerCase();
    if (query) {
      list = list.filter((product) =>
        `${product.name} ${product.category} ${product.description}`
          .toLowerCase()
          .includes(query),
      );
    }
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [initialProducts, category, search, sort]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = applied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal - discount >= 100 ? 0 : 9;
  const total = subtotal - discount + shipping;

  function notify(message: string) {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  }

  function addToCart(product: Product) {
    setCart((previous) => {
      const existing = previous.find((item) => item.slug === product.slug);
      if (existing) {
        return previous.map((item) =>
          item.slug === product.slug ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [
        ...previous,
        { slug: product.slug, name: product.name, price: product.price, image: product.image, quantity: 1 },
      ];
    });
    notify(`${product.name} added to cart`);
  }

  function changeQuantity(slug: string, delta: number) {
    setCart((previous) =>
      previous
        .map((item) =>
          item.slug === slug ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  async function loadOrders() {
    const response = await fetch("/api/orders");
    if (response.ok) {
      const payload = (await response.json()) as { orders: Order[] };
      setOrders(payload.orders);
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line bg-panel/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-brand text-white">
              <ShoppingBag className="size-4" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-ink">cartly</span>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
            <button type="button" onClick={() => setCategory("All")} className="hover:text-ink">Shop</button>
            <button type="button" onClick={() => setCategory("Audio")} className="hover:text-ink">Audio</button>
            <button type="button" onClick={() => setCategory("Workspace")} className="hover:text-ink">Workspace</button>
            <button type="button" onClick={() => { setOrdersOpen(true); void loadOrders(); }} className="hover:text-ink">Orders</button>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setOrdersOpen(true); void loadOrders(); }}
              className="hidden items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs text-muted hover:text-ink sm:flex"
            >
              <Package className="size-4" /> Orders
            </button>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 rounded-lg bg-brand px-3.5 py-2 text-xs font-semibold text-white hover:bg-brand/90"
            >
              <ShoppingBag className="size-4" /> Cart
              {cartCount ? (
                <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-4 pt-6 lg:px-8">
          <div
            className="relative overflow-hidden rounded-3xl px-6 py-12 text-white sm:px-10 sm:py-16"
            style={{ background: "linear-gradient(120deg, #0f766e 0%, #115e59 52%, #c2410c 100%)" }}
          >
            <div className="absolute -right-16 -top-24 size-72 rounded-full bg-white/10 blur-2xl" />
            <div className="relative max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                New season · 2026 Collection
              </p>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                Upgrade your everyday.
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
                Thoughtfully designed gear for work, rest and everything between. Free shipping on orders over $100.
              </p>
              <button
                type="button"
                onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand transition-transform hover:translate-x-1"
              >
                Shop bestsellers <ArrowRight className="size-4" />
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Truck, title: "Free shipping over $100", text: "Fast, tracked delivery" },
              { icon: RotateCcw, title: "30-day easy returns", text: "No questions asked" },
              { icon: ShieldCheck, title: "Secure checkout", text: "Your data stays yours" },
            ].map((item) => (
              <div key={item.title} className="card flex items-center gap-3 p-4">
                <item.icon className="size-5 shrink-0 text-brand" />
                <div>
                  <p className="text-xs font-semibold text-ink">{item.title}</p>
                  <p className="text-[11px] text-muted">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="products" className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink">Explore the collection</h2>
              <p className="mt-1 text-sm text-muted">{filtered.length} products handpicked for you</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 rounded-xl border border-line bg-panel px-3">
                <Search className="size-4 text-muted" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products..."
                  className="w-40 bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-muted sm:w-56"
                />
              </label>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="rounded-xl border border-line bg-panel px-3 py-2.5 text-sm text-ink outline-none"
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="rating">Top rated</option>
              </select>
            </div>
          </div>

          <div className="scroll-thin mb-6 flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  category === item
                    ? "bg-brand text-white"
                    : "border border-line bg-panel text-muted hover:text-ink"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {filtered.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.slug} product={product} onAdd={addToCart} />
              ))}
            </div>
          ) : (
            <div className="card py-20 text-center">
              <p className="text-sm font-medium text-ink">No products found</p>
              <p className="mt-1 text-xs text-muted">Try another search or category.</p>
              <button
                type="button"
                onClick={() => { setSearch(""); setCategory("All"); }}
                className="mt-4 text-xs font-semibold text-brand"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-line bg-panel">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-8 text-xs text-muted lg:px-8">
          <p>© 2026 Cartly. Built as a portfolio demo.</p>
          <p>Next.js · TypeScript · Tailwind CSS</p>
        </div>
      </footer>

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-xl bg-ink px-4 py-2.5 text-xs font-medium text-white shadow-lg rise">
          {toast}
        </div>
      ) : null}

      <CartDrawer
        open={cartOpen}
        items={cart}
        discountCode={discountCode}
        applied={applied}
        subtotal={subtotal}
        discount={discount}
        shipping={shipping}
        total={total}
        onClose={() => setCartOpen(false)}
        onQuantity={changeQuantity}
        onRemove={(slug) => setCart((previous) => previous.filter((item) => item.slug !== slug))}
        onDiscountChange={setDiscountCode}
        onApplyDiscount={() => {
          if (discountCode.trim().toUpperCase() === "WELCOME10") {
            setApplied(true);
            notify("Discount applied!");
          } else {
            notify("Invalid code — try WELCOME10");
          }
        }}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
      />

      <CheckoutModal
        open={checkoutOpen}
        items={cart}
        discountCode={discountCode}
        onClose={() => {
          setCheckoutOpen(false);
          setCart([]);
          setApplied(false);
          setDiscountCode("");
        }}
        onPlaced={() => void loadOrders()}
      />

      <OrdersModal open={ordersOpen} orders={orders} onClose={() => setOrdersOpen(false)} />
    </div>
  );
}

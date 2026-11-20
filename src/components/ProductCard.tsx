"use client";

import Image from "next/image";
import { Plus, Star } from "lucide-react";
import type { Product } from "@/lib/types";

export default function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (product: Product) => void;
}) {
  return (
    <article className="card group flex h-full flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-panel2">
        <Image
          src={product.image}
          alt={product.name}
          width={600}
          height={600}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold text-white">
            {product.badge}
          </span>
        ) : null}
        {product.compareAt ? (
          <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-white">
            Save ${product.compareAt - product.price}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-brand">
          {product.category}
        </p>
        <h3 className="mt-1 text-sm font-semibold text-ink">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{product.description}</p>

        <div className="mt-3 flex items-center gap-1 text-xs">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-ink">{product.rating}</span>
          <span className="text-muted">({product.reviews})</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-ink">${product.price}</span>
            {product.compareAt ? (
              <span className="text-xs text-muted line-through">${product.compareAt}</span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => onAdd(product)}
            className="inline-flex items-center gap-1 rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand/90"
          >
            <Plus className="size-3.5" /> Add
          </button>
        </div>
      </div>
    </article>
  );
}

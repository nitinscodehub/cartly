import { NextResponse, type NextRequest } from "next/server";
import { CATEGORIES, PRODUCTS } from "@/lib/products";

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const category = params.get("category");
  const query = params.get("q")?.toLowerCase().trim();
  const sort = params.get("sort");

  let products = [...PRODUCTS];

  if (category && category !== "All") {
    products = products.filter((product) => product.category === category);
  }
  if (query) {
    products = products.filter((product) =>
      `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query),
    );
  }
  if (sort === "price-asc") products.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") products.sort((a, b) => b.price - a.price);
  if (sort === "rating") products.sort((a, b) => b.rating - a.rating);

  return NextResponse.json({ products, categories: CATEGORIES });
}

import { NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/products";
import { listOrders } from "@/lib/orders";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "cartly",
    products: PRODUCTS.length,
    orders: listOrders().length,
    paymentMode: "demo-checkout",
    time: new Date().toISOString(),
  });
}

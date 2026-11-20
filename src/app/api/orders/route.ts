import { NextResponse, type NextRequest } from "next/server";
import { createOrder, listOrders } from "@/lib/orders";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({ orders: listOrders() });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      customer?: { name?: string; email?: string; address?: string; city?: string; zip?: string };
      items?: Array<{ slug?: string; quantity?: number }>;
      discountCode?: string;
    };

    const order = createOrder({
      customer: {
        name: body.customer?.name ?? "",
        email: body.customer?.email ?? "",
        address: body.customer?.address ?? "",
        city: body.customer?.city ?? "",
        zip: body.customer?.zip ?? "",
      },
      items: (body.items ?? [])
        .filter((item) => item.slug)
        .map((item) => ({ slug: item.slug as string, quantity: Number(item.quantity) || 1 })),
      discountCode: body.discountCode,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not place order";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/services";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId") || undefined;
    const orders = await orderService.getOrders(customerId);
    return NextResponse.json({ success: true, data: orders });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer_name, customer_phone, shipping_address, items, subtotal, vat_amount, shipping_fee, total, payment_method } = body;

    if (!customer_name || !customer_phone || !shipping_address || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required order fields or items" },
        { status: 400 }
      );
    }

    const calculatedSubtotal = subtotal !== undefined ? subtotal : items.reduce((acc: number, it: any) => acc + (it.total_price || (it.unit_price * it.quantity)), 0);
    const calculatedVat = vat_amount !== undefined ? vat_amount : Math.round(calculatedSubtotal * 0.05 * 100) / 100;
    const calculatedShipping = shipping_fee !== undefined ? shipping_fee : (calculatedSubtotal >= 500 ? 0 : 25);
    const calculatedTotal = total !== undefined ? total : calculatedSubtotal + calculatedVat + calculatedShipping;

    const newOrder = await orderService.createOrder({
      customer_name,
      customer_email: body.customer_email || "",
      customer_phone,
      shipping_address,
      items,
      subtotal: calculatedSubtotal,
      vat_amount: calculatedVat,
      shipping_fee: calculatedShipping,
      total: calculatedTotal,
      currency: "AED",
      payment_method: payment_method || "cod",
      status: "confirmed",
    });

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to place order" }, { status: 500 });
  }
}

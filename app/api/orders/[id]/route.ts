import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/services";
import { OrderStatus } from "@/types";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const order = await orderService.getOrderById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status } = body;

    if (!["pending", "confirmed", "processing", "dispatched", "delivered", "cancelled"].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid order status" }, { status: 400 });
    }

    const updated = await orderService.updateStatus(id, status as OrderStatus);
    return NextResponse.json({ success: updated, data: { id, status } });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update order status" }, { status: 500 });
  }
}

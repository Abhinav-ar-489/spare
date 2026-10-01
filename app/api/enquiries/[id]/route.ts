import { NextRequest, NextResponse } from "next/server";
import { enquiryService } from "@/services";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status } = body;

    if (!["new", "contacted", "resolved"].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    const updated = await enquiryService.updateStatus(id, status);
    return NextResponse.json({ success: updated });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update status" }, { status: 500 });
  }
}

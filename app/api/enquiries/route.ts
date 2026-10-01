import { NextRequest, NextResponse } from "next/server";
import { enquiryService } from "@/services";
import { enquirySchema } from "@/lib/validations/enquiry";

export async function GET() {
  try {
    const list = await enquiryService.getEnquiries();
    return NextResponse.json({ success: true, data: list });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch enquiries" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = enquirySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error.format() },
        { status: 400 }
      );
    }

    const created = await enquiryService.createEnquiry(validation.data);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create enquiry" }, { status: 500 });
  }
}

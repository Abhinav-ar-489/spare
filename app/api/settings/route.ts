import { NextRequest, NextResponse } from "next/server";
import { settingsService } from "@/services";
import { siteSettingsSchema } from "@/lib/validations/settings";

export async function GET() {
  try {
    const settings = await settingsService.getSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = siteSettingsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error.format() },
        { status: 400 }
      );
    }

    const updated = await settingsService.updateSettings(validation.data);
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}

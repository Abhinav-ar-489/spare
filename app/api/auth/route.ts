import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services";

export async function GET() {
  try {
    const user = await authService.getCurrentUser();
    return NextResponse.json({ success: true, data: user });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to get user session" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, name, phone, role } = body;

    if (action === "register") {
      if (!email || !name) {
        return NextResponse.json({ success: false, error: "Name and email are required" }, { status: 400 });
      }
      const user = await authService.register(name, email, phone || "", role || "customer");
      return NextResponse.json({ success: true, data: user });
    }

    // Default action: login
    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const roleHint = email.toLowerCase().includes("admin") ? "admin" : undefined;
    const user = await authService.login(email, roleHint);
    return NextResponse.json({ success: true, data: user });
  } catch {
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await authService.logout();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Logout failed" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { brandService } from "@/services";

export async function GET() {
  try {
    const brands = await brandService.getBrands();
    return NextResponse.json({ success: true, brands });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch brands" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, logo_url } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ success: false, error: "Brand name is required" }, { status: 400 });
    }

    const brand = await brandService.createBrand({
      name: name.trim(),
      slug: slug?.trim() || undefined,
      description: description?.trim() || undefined,
      logo_url: logo_url?.trim() || undefined,
    });

    return NextResponse.json({ success: true, brand });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create brand";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

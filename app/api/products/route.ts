import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/services/product-service";
import { productSchema } from "@/lib/validations/product";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;
    const brandId = searchParams.get("brandId") || undefined;
    const makeId = searchParams.get("makeId") || undefined;
    const modelId = searchParams.get("modelId") || undefined;
    const variantId = searchParams.get("variantId") || undefined;
    const isFeatured = searchParams.get("isFeatured") === "true" ? true : undefined;
    const isAvailable = searchParams.get("isAvailable") === "true" ? true : undefined;
    const sortBy = (searchParams.get("sortBy") as any) || undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
    const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : undefined;

    const data = await productService.getProducts({
      query,
      categoryId,
      brandId,
      makeId,
      modelId,
      variantId,
      isFeatured,
      isAvailable,
      sortBy,
      limit,
      offset,
    });

    return NextResponse.json({ success: true, ...data });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = productSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error.format() },
        { status: 400 }
      );
    }

    const created = await productService.createProduct(validation.data as any);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
  }
}

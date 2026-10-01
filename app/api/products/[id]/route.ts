import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/services/product-service";
import { productSchema } from "@/lib/validations/product";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const product = await productService.getProductById(id);
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const validation = productSchema.partial().safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error.format() },
        { status: 400 }
      );
    }

    const updated = await productService.updateProduct(id, validation.data as any);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const deleted = await productService.deleteProduct(id);
    return NextResponse.json({ success: deleted });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 });
  }
}

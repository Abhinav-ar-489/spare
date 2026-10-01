import { NextRequest, NextResponse } from "next/server";
import { vehicleService } from "@/services";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const makeId = searchParams.get("makeId") || undefined;
    const modelId = searchParams.get("modelId") || undefined;

    const makes = await vehicleService.getMakes();
    const models = await vehicleService.getModels(makeId);
    const variants = await vehicleService.getVariants(modelId);

    return NextResponse.json({
      success: true,
      makes,
      models,
      variants,
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch vehicle data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type,
      name,
      slug,
      logo_url,
      make_id,
      model_id,
      year_start,
      year_end,
      fuel_type,
      engine_capacity,
      transmission,
      // Complete vehicle bundle fields
      makeId,
      makeName,
      modelId,
      modelName,
      variantName,
      yearStart,
      yearEnd,
      engineCapacity,
    } = body;

    // 1. Add Make Only
    if (type === "make") {
      if (!name?.trim()) {
        return NextResponse.json({ success: false, error: "Make name is required" }, { status: 400 });
      }
      const make = await vehicleService.createMake({
        name: name.trim(),
        slug: slug?.trim() || undefined,
        logo_url: logo_url?.trim() || undefined,
      });
      return NextResponse.json({ success: true, make });
    }

    // 2. Add Model Only
    if (type === "model") {
      if (!make_id || !name?.trim()) {
        return NextResponse.json({ success: false, error: "Make ID and model name are required" }, { status: 400 });
      }
      const model = await vehicleService.createModel({
        make_id,
        name: name.trim(),
        slug: slug?.trim() || undefined,
        year_start: year_start ? Number(year_start) : 2020,
        year_end: year_end ? Number(year_end) : null,
      });
      return NextResponse.json({ success: true, model });
    }

    // 3. Add Variant Only
    if (type === "variant") {
      if (!model_id || !name?.trim()) {
        return NextResponse.json({ success: false, error: "Model ID and variant name are required" }, { status: 400 });
      }
      const variant = await vehicleService.createVariant({
        model_id,
        name: name.trim(),
        fuel_type,
        engine_capacity,
        transmission,
      });
      return NextResponse.json({ success: true, variant });
    }

    // 4. Complete Vehicle Creation (Make + Model + Trim Variant)
    const effectiveMakeName = makeName || name;
    const effectiveModelName = modelName;
    const effectiveVariantName = variantName || `${engineCapacity || "Standard"} Trim`;

    if (!makeId && !effectiveMakeName?.trim()) {
      return NextResponse.json({ success: false, error: "Vehicle make is required" }, { status: 400 });
    }
    if (!modelId && !effectiveModelName?.trim()) {
      return NextResponse.json({ success: false, error: "Vehicle model is required" }, { status: 400 });
    }

    const result = await vehicleService.createCompleteVehicle({
      makeId,
      makeName: effectiveMakeName?.trim(),
      modelId,
      modelName: effectiveModelName?.trim(),
      yearStart: yearStart ? Number(yearStart) : 2020,
      yearEnd: yearEnd ? Number(yearEnd) : null,
      variantName: effectiveVariantName.trim(),
      fuelType: fuel_type || "Petrol",
      engineCapacity: engineCapacity || engine_capacity || "3.5L V6",
      transmission: transmission || "Automatic",
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to process vehicle request";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Car, ChevronDown, Check, Sparkles } from "lucide-react";
import { VehicleMake, VehicleModel, VehicleVariant } from "@/types";
import { Button } from "../ui/button";

interface VehicleSelectorProps {
  makes: VehicleMake[];
  models: VehicleModel[];
  variants: VehicleVariant[];
  className?: string;
  onSelectVehicle?: (details: {
    makeId?: string;
    modelId?: string;
    variantId?: string;
    description: string;
  }) => void;
}

export function VehicleSelector({
  makes,
  models,
  variants,
  className = "",
  onSelectVehicle,
}: VehicleSelectorProps) {
  const router = useRouter();

  const [selectedMake, setSelectedMake] = React.useState<string>("");
  const [selectedModel, setSelectedModel] = React.useState<string>("");
  const [selectedYear, setSelectedYear] = React.useState<string>("");
  const [selectedVariant, setSelectedVariant] = React.useState<string>("");

  // Filter models based on selected make
  const availableModels = React.useMemo(() => {
    if (!selectedMake) return [];
    return models.filter((m) => m.make_id === selectedMake);
  }, [selectedMake, models]);

  // Derive model year range
  const currentModelObj = React.useMemo(() => {
    return models.find((m) => m.id === selectedModel);
  }, [selectedModel, models]);

  const availableYears = React.useMemo(() => {
    if (!currentModelObj) return [];
    const start = currentModelObj.year_start;
    const end = currentModelObj.year_end || new Date().getFullYear();
    const yrs: number[] = [];
    for (let y = end; y >= start; y--) {
      yrs.push(y);
    }
    return yrs;
  }, [currentModelObj]);

  // Filter variants based on selected model
  const availableVariants = React.useMemo(() => {
    if (!selectedModel) return [];
    return variants.filter((v) => v.model_id === selectedModel);
  }, [selectedModel, variants]);

  // Handle Make change
  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMake(e.target.value);
    setSelectedModel("");
    setSelectedYear("");
    setSelectedVariant("");
  };

  // Handle Model change
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
    setSelectedYear("");
    setSelectedVariant("");
  };

  const handleSearchCompatible = () => {
    const makeObj = makes.find((m) => m.id === selectedMake);
    const modelObj = models.find((m) => m.id === selectedModel);
    const variantObj = variants.find((v) => v.id === selectedVariant);

    const vehicleText = [
      makeObj?.name,
      modelObj?.name,
      selectedYear ? `(${selectedYear})` : "",
      variantObj?.name,
    ]
      .filter(Boolean)
      .join(" ");

    if (onSelectVehicle) {
      onSelectVehicle({
        makeId: selectedMake || undefined,
        modelId: selectedModel || undefined,
        variantId: selectedVariant || undefined,
        description: vehicleText,
      });
      return;
    }

    const params = new URLSearchParams();
    if (selectedMake) params.set("makeId", selectedMake);
    if (selectedModel) params.set("modelId", selectedModel);
    if (selectedVariant) params.set("variantId", selectedVariant);
    if (vehicleText) params.set("vehicleText", vehicleText);

    router.push(`/parts?${params.toString()}`);
  };

  const isConfigured = Boolean(selectedMake && selectedModel);

  return (
    <div
      className={`rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white/85 backdrop-blur-xl p-5 sm:p-7 shadow-[0_8px_30px_-6px_rgba(17,20,18,0.05)] ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-[rgba(17,20,18,0.06)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#e8f5ee] flex items-center justify-center text-[#16834b]">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#111412] tracking-tight">
              Vehicle Specific Fitment
            </h3>
            <p className="text-xs text-[#68706b]">
              Verify OEM compatible brake, engine, suspension & filtration spares
            </p>
          </div>
        </div>

        {isConfigured && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#16834b] bg-[#e8f5ee] px-2.5 py-1 rounded-md">
            <Check className="w-3.5 h-3.5" />
            Selection Active
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-5">
        {/* Step 1: Make */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#68706b]">
            1. Select Make
          </label>
          <div className="relative">
            <select
              value={selectedMake}
              onChange={handleMakeChange}
              className="w-full h-11 appearance-none rounded-xl border border-[rgba(17,20,18,0.12)] bg-[#f7f8f7]/70 hover:bg-white focus:bg-white px-3.5 pr-8 text-sm font-medium text-[#111412] focus:border-[#16834b] focus:outline-none transition-colors"
            >
              <option value="">All Vehicle Makes</option>
              {makes.map((make) => (
                <option key={make.id} value={make.id}>
                  {make.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#68706b] pointer-events-none" />
          </div>
        </div>

        {/* Step 2: Model */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#68706b]">
            2. Select Model
          </label>
          <div className="relative">
            <select
              value={selectedModel}
              onChange={handleModelChange}
              disabled={!selectedMake}
              className="w-full h-11 appearance-none rounded-xl border border-[rgba(17,20,18,0.12)] bg-[#f7f8f7]/70 hover:bg-white focus:bg-white px-3.5 pr-8 text-sm font-medium text-[#111412] focus:border-[#16834b] focus:outline-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <option value="">
                {selectedMake ? "Choose Model" : "Select Make First"}
              </option>
              {availableModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.year_start} - {model.year_end || "Present"})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#68706b] pointer-events-none" />
          </div>
        </div>

        {/* Step 3: Year */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#68706b]">
            3. Model Year
          </label>
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              disabled={!selectedModel}
              className="w-full h-11 appearance-none rounded-xl border border-[rgba(17,20,18,0.12)] bg-[#f7f8f7]/70 hover:bg-white focus:bg-white px-3.5 pr-8 text-sm font-medium text-[#111412] focus:border-[#16834b] focus:outline-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <option value="">Any Year</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#68706b] pointer-events-none" />
          </div>
        </div>

        {/* Step 4: Variant */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#68706b]">
            4. Engine / Trim
          </label>
          <div className="relative">
            <select
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value)}
              disabled={!selectedModel}
              className="w-full h-11 appearance-none rounded-xl border border-[rgba(17,20,18,0.12)] bg-[#f7f8f7]/70 hover:bg-white focus:bg-white px-3.5 pr-8 text-sm font-medium text-[#111412] focus:border-[#16834b] focus:outline-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <option value="">All Engine Variants</option>
              {availableVariants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.fuel_type})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#68706b] pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[rgba(17,20,18,0.06)]">
        <p className="text-xs text-[#68706b] text-center sm:text-left">
          Need assistance verifying your VIN or chassis number?{" "}
          <span className="text-[#16834b] font-medium">
            Our engineers can verify via WhatsApp.
          </span>
        </p>

        <Button
          onClick={handleSearchCompatible}
          variant="primary"
          size="md"
          className="w-full sm:w-auto px-6 font-semibold"
        >
          <Sparkles className="w-4 h-4" />
          <span>Find Compatible Spares</span>
        </Button>
      </div>
    </div>
  );
}

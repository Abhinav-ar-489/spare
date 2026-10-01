"use client";

import * as React from "react";
import {
  Car,
  Plus,
  Search,
  CheckCircle2,
  X,
  Layers,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { VehicleMake, VehicleModel, VehicleVariant } from "@/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface VehiclesManagerProps {
  initialMakes: VehicleMake[];
  initialModels: VehicleModel[];
  initialVariants: VehicleVariant[];
}

export function VehiclesManager({
  initialMakes,
  initialModels,
  initialVariants,
}: VehiclesManagerProps) {
  const [makes, setMakes] = React.useState<VehicleMake[]>(initialMakes);
  const [models, setModels] = React.useState<VehicleModel[]>(initialModels);
  const [variants, setVariants] = React.useState<VehicleVariant[]>(initialVariants);
  const [search, setSearch] = React.useState("");

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  // Form Mode: "complete" (Make + Model + Trim) | "make" | "model" | "variant"
  const [formMode, setFormMode] = React.useState<"complete" | "make" | "model">("complete");

  // Form State
  const [selectedMakeId, setSelectedMakeId] = React.useState("");
  const [newMakeName, setNewMakeName] = React.useState("");
  const [modelName, setModelName] = React.useState("");
  const [yearStart, setYearStart] = React.useState("2022");
  const [yearEnd, setYearEnd] = React.useState("");
  const [variantName, setVariantName] = React.useState("");
  const [engineCapacity, setEngineCapacity] = React.useState("3.5L V6");
  const [fuelType, setFuelType] = React.useState<"Petrol" | "Diesel" | "Hybrid" | "Electric" | "CNG">("Petrol");
  const [transmission, setTransmission] = React.useState<"Automatic" | "Manual" | "CVT" | "DCT">("Automatic");

  // Search filtering
  const filteredMakes = React.useMemo(() => {
    if (!search.trim()) return makes;
    const q = search.toLowerCase();

    return makes.filter((mk) => {
      const matchMake = mk.name.toLowerCase().includes(q);
      const makeModels = models.filter((m) => m.make_id === mk.id);
      const matchModel = makeModels.some((m) => m.name.toLowerCase().includes(q));
      const modelIds = makeModels.map((m) => m.id);
      const matchVariant = variants.some(
        (v) => modelIds.includes(v.model_id) && v.name.toLowerCase().includes(q)
      );
      return matchMake || matchModel || matchVariant;
    });
  }, [makes, models, variants, search]);

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formMode === "complete") {
      if (!selectedMakeId && !newMakeName.trim()) {
        setError("Please select an existing Make or enter a new Make name.");
        return;
      }
      if (!modelName.trim()) {
        setError("Please enter a Model name.");
        return;
      }
      if (!variantName.trim()) {
        setError("Please enter a Trim / Variant name.");
        return;
      }
    } else if (formMode === "make") {
      if (!newMakeName.trim()) {
        setError("Please enter Make name.");
        return;
      }
    } else if (formMode === "model") {
      if (!selectedMakeId) {
        setError("Please select a Make for this model.");
        return;
      }
      if (!modelName.trim()) {
        setError("Please enter Model name.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      let payload: Record<string, unknown> = {};

      if (formMode === "complete") {
        payload = {
          type: "vehicle",
          makeId: selectedMakeId || undefined,
          makeName: newMakeName.trim() || undefined,
          modelName: modelName.trim(),
          variantName: variantName.trim(),
          yearStart: parseInt(yearStart) || 2020,
          yearEnd: yearEnd ? parseInt(yearEnd) : null,
          engineCapacity: engineCapacity.trim(),
          fuel_type: fuelType,
          transmission,
        };
      } else if (formMode === "make") {
        payload = {
          type: "make",
          name: newMakeName.trim(),
        };
      } else if (formMode === "model") {
        payload = {
          type: "model",
          make_id: selectedMakeId,
          name: modelName.trim(),
          year_start: parseInt(yearStart) || 2020,
          year_end: yearEnd ? parseInt(yearEnd) : null,
        };
      }

      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Failed to add vehicle.");
        setIsSubmitting(false);
        return;
      }

      // Update state with newly created records
      if (data.make) {
        setMakes((prev) => {
          if (prev.some((m) => m.id === data.make.id)) return prev;
          return [...prev, data.make];
        });
      }
      if (data.model) {
        setModels((prev) => {
          if (prev.some((m) => m.id === data.model.id)) return prev;
          return [...prev, data.model];
        });
      }
      if (data.variant) {
        setVariants((prev) => {
          if (prev.some((v) => v.id === data.variant.id)) return prev;
          return [...prev, data.variant];
        });
      }

      setSuccessMsg(
        formMode === "complete"
          ? `Vehicle "${data.make?.name} ${data.model?.name} (${data.variant?.name})" added successfully!`
          : "Vehicle entry added successfully!"
      );

      setIsModalOpen(false);
      // Reset form
      setNewMakeName("");
      setModelName("");
      setVariantName("");
      setTimeout(() => setSuccessMsg(null), 4500);
    } catch {
      setError("Network error occurred while adding vehicle.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111412]">
            Vehicle Compatibility Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#68706b] mt-0.5">
            {makes.length} Automobile Makes, {models.length} Models, and {variants.length} Trim Variants mapped for part fitment.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setError(null);
            setIsModalOpen(true);
          }}
          className="font-bold gap-2 shadow-md shadow-[#16834b]/20 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </Button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-[#e8f5ee] border border-[#16834b]/30 text-xs text-[#0d6338] font-medium flex items-center gap-2 animate-in fade-in-50">
          <CheckCircle2 className="w-4 h-4 text-[#16834b] shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search and Stats Bar */}
      <div className="flex items-center justify-between gap-4 p-3 rounded-2xl glass-card border border-white/90">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#68706b] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Make, Model (e.g. LC300, Patrol), or Engine..."
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-[rgba(17,20,18,0.08)] bg-white text-xs text-[#111412] placeholder:text-[#68706b]/60 focus:outline-none focus:border-[#16834b]"
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#68706b] shrink-0 pr-2">
          <span>{filteredMakes.length} Makes</span>
          <span>•</span>
          <span>{variants.length} Mapped Trims</span>
        </div>
      </div>

      {/* Vehicles Grid Tree */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMakes.map((mk) => {
          const makeModels = models.filter((m) => m.make_id === mk.id);

          return (
            <div
              key={mk.id}
              className="p-5 rounded-3xl glass-card border border-white/90 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[rgba(17,20,18,0.06)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#111412] flex items-center justify-center text-white shadow-2xs">
                    <Car className="w-4 h-4 text-[#16834b]" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#111412] leading-tight">
                      {mk.name}
                    </h2>
                    <span className="text-[10px] text-[#68706b]">
                      {mk.slug}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#f2f4f2] text-[#111412]">
                  {makeModels.length} Models
                </span>
              </div>

              <div className="space-y-3">
                {makeModels.map((md) => {
                  const modelVariants = variants.filter((v) => v.model_id === md.id);

                  return (
                    <div
                      key={md.id}
                      className="p-3.5 rounded-2xl bg-white/70 border border-[rgba(17,20,18,0.06)] text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between font-bold text-[#111412]">
                        <span className="text-xs">{md.name}</span>
                        <span className="text-[10px] text-[#68706b] font-mono px-2 py-0.5 rounded-md bg-[#f2f4f2]">
                          {md.year_start} - {md.year_end || "Present"}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {modelVariants.map((vr) => (
                          <div
                            key={vr.id}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#e8f5ee]/80 border border-[#16834b]/15 text-[11px] font-medium text-[#0d6338]"
                          >
                            <span>{vr.name}</span>
                            <span className="text-[9px] text-[#16834b]/70 font-semibold">
                              • {vr.fuel_type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in-50 duration-200">
          <div className="w-full max-w-xl rounded-3xl glass-card border border-white/95 p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl hover:bg-white/80 text-[#68706b] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-[#111412] flex items-center justify-center text-white">
                <Car className="w-5 h-5 text-[#16834b]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#111412]">
                  Add Vehicle for Compatibility
                </h2>
                <p className="text-xs text-[#68706b]">
                  Register makes, models, and engine trims so parts can be mapped with precision.
                </p>
              </div>
            </div>

            {/* Mode Selector */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#f2f4f2] mb-5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFormMode("complete")}
                className={`py-2 rounded-xl transition-all ${
                  formMode === "complete"
                    ? "bg-white text-[#111412] shadow-xs"
                    : "text-[#68706b] hover:text-[#111412]"
                }`}
              >
                Complete Vehicle
              </button>
              <button
                type="button"
                onClick={() => setFormMode("make")}
                className={`py-2 rounded-xl transition-all ${
                  formMode === "make"
                    ? "bg-white text-[#111412] shadow-xs"
                    : "text-[#68706b] hover:text-[#111412]"
                }`}
              >
                Make Only
              </button>
              <button
                type="button"
                onClick={() => setFormMode("model")}
                className={`py-2 rounded-xl transition-all ${
                  formMode === "model"
                    ? "bg-white text-[#111412] shadow-xs"
                    : "text-[#68706b] hover:text-[#111412]"
                }`}
              >
                Model Only
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateVehicle} className="space-y-4">
              {/* Step 1: Vehicle Make */}
              {formMode !== "make" && (
                <div>
                  <label className="block text-xs font-semibold text-[#111412] mb-1">
                    Select Existing Make OR Type New Below
                  </label>
                  <select
                    value={selectedMakeId}
                    onChange={(e) => {
                      setSelectedMakeId(e.target.value);
                      if (e.target.value) setNewMakeName("");
                    }}
                    className="w-full h-11 px-3 rounded-xl border border-[rgba(17,20,18,0.12)] bg-white text-xs text-[#111412] focus:outline-none focus:border-[#16834b]"
                  >
                    <option value="">-- Or enter new make below --</option>
                    {makes.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Or New Make Name */}
              {(!selectedMakeId || formMode === "make") && (
                <div>
                  <label className="block text-xs font-semibold text-[#111412] mb-1">
                    New Make Name *
                  </label>
                  <Input
                    value={newMakeName}
                    onChange={(e) => setNewMakeName(e.target.value)}
                    placeholder="e.g. Porsche, Audi, Ford, Genesis, Geely"
                    required={!selectedMakeId}
                  />
                </div>
              )}

              {/* Step 2: Model Name and Years */}
              {formMode !== "make" && (
                <div className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-[#111412] mb-1">
                      Model Name *
                    </label>
                    <Input
                      value={modelName}
                      onChange={(e) => setModelName(e.target.value)}
                      placeholder="e.g. Land Cruiser Prado 250, Patrol Y63, Cayenne, Defender 110"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#111412] mb-1">
                        Year Start *
                      </label>
                      <Input
                        type="number"
                        value={yearStart}
                        onChange={(e) => setYearStart(e.target.value)}
                        placeholder="2022"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#111412] mb-1">
                        Year End (Leave empty for Present)
                      </label>
                      <Input
                        type="number"
                        value={yearEnd}
                        onChange={(e) => setYearEnd(e.target.value)}
                        placeholder="e.g. 2026 or Present"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Engine / Trim Variant */}
              {formMode === "complete" && (
                <div className="space-y-4 pt-1 border-t border-[rgba(17,20,18,0.06)]">
                  <div>
                    <label className="block text-xs font-semibold text-[#111412] mb-1">
                      Trim / Engine Variant Name *
                    </label>
                    <Input
                      value={variantName}
                      onChange={(e) => setVariantName(e.target.value)}
                      placeholder="e.g. 3.5L Twin-Turbo V6 GR-Sport, 4.0L V8 Turbo, 2.8L D-4D"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#111412] mb-1">
                        Engine Spec
                      </label>
                      <Input
                        value={engineCapacity}
                        onChange={(e) => setEngineCapacity(e.target.value)}
                        placeholder="e.g. 3.5L V6"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#111412] mb-1">
                        Fuel Type
                      </label>
                      <select
                        value={fuelType}
                        onChange={(e) => setFuelType(e.target.value as "Petrol" | "Diesel" | "Hybrid" | "Electric" | "CNG")}
                        className="w-full h-11 px-2.5 rounded-xl border border-[rgba(17,20,18,0.12)] bg-white text-xs text-[#111412]"
                      >
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Electric">Electric</option>
                        <option value="CNG">CNG</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#111412] mb-1">
                        Transmission
                      </label>
                      <select
                        value={transmission}
                        onChange={(e) => setTransmission(e.target.value as "Automatic" | "Manual" | "CVT" | "DCT")}
                        className="w-full h-11 px-2.5 rounded-xl border border-[rgba(17,20,18,0.12)] bg-white text-xs text-[#111412]"
                      >
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                        <option value="CVT">CVT</option>
                        <option value="DCT">DCT</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  className="font-bold gap-1.5 shadow-md shadow-[#16834b]/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {formMode === "complete"
                      ? "Create & Map Vehicle"
                      : formMode === "make"
                      ? "Create Make"
                      : "Create Model"}
                  </span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

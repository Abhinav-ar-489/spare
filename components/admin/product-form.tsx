"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Upload,
  Plus,
  Trash2,
  Check,
  Camera,
  Car,
  Tag,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  X,
} from "lucide-react";
import { Brand, Category, Product, VehicleMake, VehicleModel, VehicleVariant } from "@/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ProductFormProps {
  initialProduct?: Product;
  categories: Category[];
  brands: Brand[];
  makes: VehicleMake[];
  models: VehicleModel[];
  variants: VehicleVariant[];
  isEdit?: boolean;
}

export function ProductForm({
  initialProduct,
  categories,
  brands,
  makes,
  models,
  variants,
  isEdit = false,
}: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Dynamic Lists for On-The-Fly Additions
  const [brandList, setBrandList] = React.useState<Brand[]>(brands);
  const [makesList, setMakesList] = React.useState<VehicleMake[]>(makes);
  const [modelsList, setModelsList] = React.useState<VehicleModel[]>(models);
  const [variantsList, setVariantsList] = React.useState<VehicleVariant[]>(variants);

  // Quick Brand Modal State
  const [isBrandModalOpen, setIsBrandModalOpen] = React.useState(false);
  const [newBrandName, setNewBrandName] = React.useState("");
  const [isBrandSaving, setIsBrandSaving] = React.useState(false);

  // Quick Vehicle Modal State
  const [isVehicleModalOpen, setIsVehicleModalOpen] = React.useState(false);
  const [quickMakeId, setQuickMakeId] = React.useState("");
  const [quickMakeName, setQuickMakeName] = React.useState("");
  const [quickModelName, setQuickModelName] = React.useState("");
  const [quickYearStart, setQuickYearStart] = React.useState("2023");
  const [quickYearEnd, setQuickYearEnd] = React.useState("");
  const [quickVariantName, setQuickVariantName] = React.useState("");
  const [quickFuelType, setQuickFuelType] = React.useState<"Petrol" | "Diesel" | "Hybrid" | "Electric" | "CNG">("Petrol");
  const [quickEngineCapacity, setQuickEngineCapacity] = React.useState("3.5L V6");
  const [isVehicleSaving, setIsVehicleSaving] = React.useState(false);

  // Form State
  const [name, setName] = React.useState(initialProduct?.name || "");
  const [brandId, setBrandId] = React.useState(initialProduct?.brand_id || brands[0]?.id || "");
  const [categoryId, setCategoryId] = React.useState(initialProduct?.category_id || categories[0]?.id || "");
  const [partNumber, setPartNumber] = React.useState(initialProduct?.part_number || "");
  const [oemNumber, setOemNumber] = React.useState(initialProduct?.oem_number || "");
  const [description, setDescription] = React.useState(initialProduct?.description || "");
  const [price, setPrice] = React.useState<string>(initialProduct?.price ? String(initialProduct.price) : "");
  const [discountPrice, setDiscountPrice] = React.useState<string>(
    initialProduct?.discount_price ? String(initialProduct.discount_price) : ""
  );
  const [stock, setStock] = React.useState<number>(initialProduct?.stock !== undefined ? initialProduct.stock : 10);
  const [isAvailable, setIsAvailable] = React.useState(initialProduct?.is_available !== false);
  const [isFeatured, setIsFeatured] = React.useState(initialProduct?.is_featured || false);

  // Images state
  const [images, setImages] = React.useState<Array<{ url: string; alt: string; is_primary: boolean }>>(
    initialProduct?.images && initialProduct.images.length > 0
      ? initialProduct.images.map((img) => ({
          url: img.url,
          alt: img.alt || "Part image",
          is_primary: img.is_primary,
        }))
      : [
          {
            url: "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?w=800&auto=format&fit=crop&q=80",
            alt: "Default part photo",
            is_primary: true,
          },
        ]
  );

  // Specifications Key-Value state
  const [specs, setSpecs] = React.useState<Array<{ key: string; value: string }>>(
    initialProduct?.specifications
      ? Object.entries(initialProduct.specifications).map(([key, value]) => ({
          key,
          value,
        }))
      : [
          { key: "Fitting Position", value: "Front Axle" },
          { key: "Material", value: "Ceramic Composite" },
          { key: "Certification", value: "ECE-R90 Certified" },
        ]
  );

  // Vehicle Compatibility Selector
  const [compatMake, setCompatMake] = React.useState("");
  const [compatModel, setCompatModel] = React.useState("");
  const [compatVariant, setCompatVariant] = React.useState("");
  const [compatNotes, setCompatNotes] = React.useState("");

  const [selectedCompats, setSelectedCompats] = React.useState<
    Array<{ variantId: string; notes?: string }>
  >(
    initialProduct?.compatibilities?.map((c) => ({
      variantId: c.variant_id,
      notes: c.notes,
    })) || []
  );

  const availableModels = React.useMemo(() => {
    if (!compatMake) return [];
    return modelsList.filter((m) => m.make_id === compatMake);
  }, [compatMake, modelsList]);

  const availableVariants = React.useMemo(() => {
    if (!compatModel) return [];
    return variantsList.filter((v) => v.model_id === compatModel);
  }, [compatModel, variantsList]);

  const handleQuickAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    setIsBrandSaving(true);
    try {
      const res = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newBrandName.trim() }),
      });
      const data = await res.json();
      if (data.success && data.brand) {
        setBrandList((prev) => [data.brand, ...prev]);
        setBrandId(data.brand.id);
        setIsBrandModalOpen(false);
        setNewBrandName("");
      }
    } catch {
      // ignore
    } finally {
      setIsBrandSaving(false);
    }
  };

  const handleQuickAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickModelName.trim() || (!quickMakeId && !quickMakeName.trim())) return;
    setIsVehicleSaving(true);
    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "vehicle",
          makeId: quickMakeId || undefined,
          makeName: quickMakeName.trim() || undefined,
          modelName: quickModelName.trim(),
          yearStart: parseInt(quickYearStart) || 2020,
          yearEnd: quickYearEnd ? parseInt(quickYearEnd) : null,
          variantName: quickVariantName.trim() || `${quickEngineCapacity || "Standard"} Trim`,
          fuel_type: quickFuelType,
          engineCapacity: quickEngineCapacity.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.variant) {
        if (data.make) {
          setMakesList((prev) =>
            prev.some((m) => m.id === data.make.id) ? prev : [...prev, data.make]
          );
          setCompatMake(data.make.id);
        }
        if (data.model) {
          setModelsList((prev) =>
            prev.some((m) => m.id === data.model.id) ? prev : [...prev, data.model]
          );
          setCompatModel(data.model.id);
        }
        if (data.variant) {
          setVariantsList((prev) =>
            prev.some((v) => v.id === data.variant.id) ? prev : [...prev, data.variant]
          );
          setCompatVariant(data.variant.id);
        }
        setIsVehicleModalOpen(false);
        setQuickMakeName("");
        setQuickModelName("");
        setQuickVariantName("");
      }
    } catch {
      // ignore
    } finally {
      setIsVehicleSaving(false);
    }
  };

  // Handle local mobile camera/file photo upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setImages((prev) => [
            ...prev,
            {
              url: dataUrl,
              alt: file.name,
              is_primary: prev.length === 0,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const setPrimaryImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, idx) => ({
        ...img,
        is_primary: idx === index,
      }))
    );
  };

  const addSpecRow = () => {
    setSpecs((prev) => [...prev, { key: "", value: "" }]);
  };

  const updateSpecRow = (index: number, field: "key" | "value", val: string) => {
    setSpecs((prev) =>
      prev.map((row, idx) => (idx === index ? { ...row, [field]: val } : row))
    );
  };

  const removeSpecRow = (index: number) => {
    setSpecs((prev) => prev.filter((_, idx) => idx !== index));
  };

  const addCompatibility = () => {
    if (!compatVariant) return;
    if (!selectedCompats.some((c) => c.variantId === compatVariant)) {
      setSelectedCompats((prev) => [
        ...prev,
        { variantId: compatVariant, notes: compatNotes || undefined },
      ]);
    }
    setCompatNotes("");
  };

  const removeCompatibility = (variantId: string) => {
    setSelectedCompats((prev) => prev.filter((c) => c.variantId !== variantId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Build specifications dictionary
    const specsMap: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.key.trim() && s.value.trim()) {
        specsMap[s.key.trim()] = s.value.trim();
      }
    });

    const payload = {
      name,
      brand_id: brandId,
      category_id: categoryId,
      part_number: partNumber,
      oem_number: oemNumber,
      description,
      price: price ? parseFloat(price) : null,
      discount_price: discountPrice ? parseFloat(discountPrice) : null,
      stock,
      is_available: isAvailable,
      is_featured: isFeatured,
      specifications: specsMap,
      images,
      tags: [categories.find((c) => c.id === categoryId)?.name || "Part"],
      compatibilities: selectedCompats,
    };

    try {
      const url = isEdit && initialProduct
        ? `/api/products/${initialProduct.id}`
        : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Failed to save product");
        setIsSubmitting(false);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("An error occurred while saving the product");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#68706b] hover:text-[#111412] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>

        <span className="text-xs font-semibold text-[#16834b] bg-[#e8f5ee] px-2.5 py-1 rounded-md">
          {isEdit ? "Editing SKU" : "New Workshop Product"}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111412]">
          {isEdit ? `Edit ${initialProduct?.name}` : "Add New Automotive Part"}
        </h1>
        <p className="text-xs text-[#68706b]">
          Mobile-optimized for workshop technicians & inventory managers.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Photos & Media (Phone Camera friendly) */}
        <div className="rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#111412] flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#16834b]" />
                <span>1. Product Photos & Media</span>
              </h2>
              <p className="text-xs text-[#68706b]">
                Take photos with your phone camera or select from device gallery.
              </p>
            </div>
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#e8f5ee] text-[#0d6338] text-xs font-semibold hover:bg-[#16834b] hover:text-white transition-colors">
              <Camera className="w-4 h-4" />
              <span>Take / Upload Photo</span>
              <input
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Photo gallery preview strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`relative aspect-4/3 rounded-xl overflow-hidden border-2 bg-[#f7f8f7] ${
                  img.is_primary ? "border-[#16834b]" : "border-[rgba(17,20,18,0.08)]"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="160px"
                  className="object-cover"
                />

                {img.is_primary ? (
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[9px] font-bold rounded bg-[#16834b] text-white">
                    Primary Cover
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPrimaryImage(idx)}
                    className="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[9px] font-semibold rounded bg-white/80 backdrop-blur-md text-[#111412] hover:bg-white"
                  >
                    Set Primary
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1.5 right-1.5 p-1 rounded bg-black/60 text-white hover:bg-rose-600 transition-colors"
                  aria-label="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Basic Information */}
        <div className="rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold text-[#111412] flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#16834b]" />
            <span>2. Part Identification</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-[#111412] mb-1">
              Part Title / Name *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bosch Premium Ceramic Front Brake Pad Set"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#111412]">
                  Manufacturer Brand *
                </label>
                <button
                  type="button"
                  onClick={() => setIsBrandModalOpen(true)}
                  className="text-[11px] font-bold text-[#16834b] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>New Brand</span>
                </button>
              </div>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full h-11 rounded-xl border border-[rgba(17,20,18,0.12)] bg-white px-3 text-sm text-[#111412] focus:border-[#16834b] focus:outline-none"
              >
                {brandList.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111412] mb-1">
                Major System / Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-11 rounded-xl border border-[rgba(17,20,18,0.12)] bg-white px-3 text-sm text-[#111412] focus:border-[#16834b] focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#111412] mb-1">
                Part Number (Manufacturer SKU) *
              </label>
              <Input
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value.toUpperCase())}
                placeholder="e.g. BP-4821"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111412] mb-1">
                OEM Cross-Reference Number (Optional)
              </label>
              <Input
                value={oemNumber}
                onChange={(e) => setOemNumber(e.target.value.toUpperCase())}
                placeholder="e.g. 04465-0K280"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111412] mb-1">
              Engineering Description *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe materials, friction tolerances, operating temps, and fitment notes..."
              className="w-full rounded-xl border border-[rgba(17,20,18,0.12)] p-3 text-sm text-[#111412] focus:border-[#16834b] focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Section 3: Vehicle Compatibility */}
        <div className="rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#111412] flex items-center gap-2">
              <Car className="w-4 h-4 text-[#16834b]" />
              <span>3. Vehicle Compatibility Matrix</span>
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#68706b]">
                {selectedCompats.length} model variants linked
              </span>
              <button
                type="button"
                onClick={() => setIsVehicleModalOpen(true)}
                className="text-xs font-bold text-[#16834b] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Vehicle</span>
              </button>
            </div>
          </div>

          {/* Quick link vehicle selector */}
          <div className="p-3.5 rounded-xl bg-[#f7f8f7] border border-[rgba(17,20,18,0.06)] space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <select
                value={compatMake}
                onChange={(e) => {
                  setCompatMake(e.target.value);
                  setCompatModel("");
                  setCompatVariant("");
                }}
                className="h-10 rounded-lg border border-[rgba(17,20,18,0.1)] bg-white px-2.5 text-xs text-[#111412] focus:border-[#16834b] focus:outline-none"
              >
                <option value="">1. Choose Make</option>
                {makesList.map((mk) => (
                  <option key={mk.id} value={mk.id}>
                    {mk.name}
                  </option>
                ))}
              </select>

              <select
                value={compatModel}
                onChange={(e) => {
                  setCompatModel(e.target.value);
                  setCompatVariant("");
                }}
                disabled={!compatMake}
                className="h-10 rounded-lg border border-[rgba(17,20,18,0.1)] bg-white px-2.5 text-xs text-[#111412] focus:border-[#16834b] focus:outline-none disabled:opacity-50"
              >
                <option value="">2. Choose Model</option>
                {availableModels.map((md) => (
                  <option key={md.id} value={md.id}>
                    {md.name}
                  </option>
                ))}
              </select>

              <select
                value={compatVariant}
                onChange={(e) => setCompatVariant(e.target.value)}
                disabled={!compatModel}
                className="h-10 rounded-lg border border-[rgba(17,20,18,0.1)] bg-white px-2.5 text-xs text-[#111412] focus:border-[#16834b] focus:outline-none disabled:opacity-50"
              >
                <option value="">3. Choose Engine / Trim</option>
                {availableVariants.map((vr) => (
                  <option key={vr.id} value={vr.id}>
                    {vr.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={compatNotes}
                onChange={(e) => setCompatNotes(e.target.value)}
                placeholder="Optional fitment note (e.g. Front calipers only)"
                className="flex-1 h-9 rounded-lg border border-[rgba(17,20,18,0.1)] bg-white px-3 text-xs text-[#111412] focus:border-[#16834b] focus:outline-none"
              />
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={addCompatibility}
                disabled={!compatVariant}
                className="font-semibold text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Link Vehicle</span>
              </Button>
            </div>
          </div>

          {/* List of currently linked vehicles */}
          {selectedCompats.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {selectedCompats.map((c) => {
                const v = variantsList.find((item) => item.id === c.variantId);
                const m = modelsList.find((item) => item.id === v?.model_id);
                const mk = makesList.find((item) => item.id === m?.make_id);

                return (
                  <div
                    key={c.variantId}
                    className="p-2.5 rounded-lg bg-white border border-[rgba(17,20,18,0.08)] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-[#111412]">
                        {mk?.name} {m?.name} • {v?.name}
                      </span>
                      {c.notes && (
                        <span className="text-[#68706b] block text-[11px]">
                          Note: {c.notes}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCompatibility(c.variantId)}
                      className="text-rose-600 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 4: Specifications */}
        <div className="rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#111412] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#16834b]" />
              <span>4. Technical Specifications</span>
            </h2>
            <button
              type="button"
              onClick={addSpecRow}
              className="text-xs font-semibold text-[#16834b] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Spec Row</span>
            </button>
          </div>

          <div className="space-y-2">
            {specs.map((row, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={row.key}
                  onChange={(e) => updateSpecRow(idx, "key", e.target.value)}
                  placeholder="Parameter (e.g. Diameter)"
                  className="w-1/2 h-9 rounded-lg border border-[rgba(17,20,18,0.1)] bg-white px-3 text-xs text-[#111412] focus:border-[#16834b] focus:outline-none"
                />
                <input
                  type="text"
                  value={row.value}
                  onChange={(e) => updateSpecRow(idx, "value", e.target.value)}
                  placeholder="Value (e.g. 319 mm)"
                  className="w-1/2 h-9 rounded-lg border border-[rgba(17,20,18,0.1)] bg-white px-3 text-xs text-[#111412] focus:border-[#16834b] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeSpecRow(idx)}
                  className="text-[#68706b] hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Pricing, Inventory & Flags */}
        <div className="rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold text-[#111412] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#16834b]" />
            <span>5. Pricing & Stock Telemetry</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#111412] mb-1">
                Selling Price (₹ INR)
              </label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 3450"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111412] mb-1">
                Discount Price (₹ Optional)
              </label>
              <Input
                type="number"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="e.g. 2890"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111412] mb-1">
                Current Physical Stock
              </label>
              <Input
                type="number"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                placeholder="e.g. 15"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[rgba(17,20,18,0.06)]">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-[#f7f8f7] cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 rounded text-[#16834b] focus:ring-[#16834b]"
              />
              <div>
                <span className="text-xs font-bold text-[#111412] block">
                  Active & Available
                </span>
                <span className="text-[11px] text-[#68706b]">
                  Visible on the public store catalog
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-[#f7f8f7] cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-[#16834b] focus:ring-[#16834b]"
              />
              <div>
                <span className="text-xs font-bold text-[#111412] block">
                  Featured on Homepage
                </span>
                <span className="text-[11px] text-[#68706b]">
                  Promoted in primary homepage showcase
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Sticky Mobile/Desktop Action Submit Bar */}
        <div className="sticky bottom-14 lg:bottom-4 z-20 bg-white/95 backdrop-blur-xl border border-[rgba(17,20,18,0.1)] p-4 rounded-2xl shadow-xl flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="px-8 font-bold gap-2"
          >
            <Check className="w-5 h-5" />
            <span>{isEdit ? "Update Spare Part" : "Publish Part to Catalog"}</span>
          </Button>
        </div>
      </form>

      {/* Quick Add Brand Modal */}
      {isBrandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in-50 duration-200">
          <div className="w-full max-w-md rounded-3xl glass-card border border-white/95 p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsBrandModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl hover:bg-white/80 text-[#68706b] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-[#111412] mb-1">
              Add New Manufacturer Brand
            </h3>
            <p className="text-xs text-[#68706b] mb-4">
              Register a new parts brand to immediately assign to this product.
            </p>

            <form onSubmit={handleQuickAddBrand} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#111412] mb-1">
                  Brand Name *
                </label>
                <Input
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  placeholder="e.g. Aisin, Akebono, Koyo, KYB, NGK"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsBrandModalOpen(false)}
                  disabled={isBrandSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isBrandSaving}
                  className="font-bold gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Brand</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Vehicle Modal */}
      {isVehicleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in-50 duration-200">
          <div className="w-full max-w-lg rounded-3xl glass-card border border-white/95 p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsVehicleModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl hover:bg-white/80 text-[#68706b] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-[#111412] flex items-center justify-center text-white">
                <Car className="w-3.5 h-3.5 text-[#16834b]" />
              </div>
              <h3 className="text-base font-bold text-[#111412]">
                Add New Vehicle for Fitment
              </h3>
            </div>
            <p className="text-xs text-[#68706b] mb-4">
              Map a new vehicle model so it immediately populates in the compatibility dropdowns.
            </p>

            <form onSubmit={handleQuickAddVehicle} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#111412] mb-1">
                  Automobile Make *
                </label>
                <select
                  value={quickMakeId}
                  onChange={(e) => {
                    setQuickMakeId(e.target.value);
                    if (e.target.value) setQuickMakeName("");
                  }}
                  className="w-full h-10 px-3 rounded-xl border border-[rgba(17,20,18,0.12)] bg-white text-xs text-[#111412] mb-1.5"
                >
                  <option value="">-- Choose Existing Make (or type new below) --</option>
                  {makesList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                {!quickMakeId && (
                  <Input
                    value={quickMakeName}
                    onChange={(e) => setQuickMakeName(e.target.value)}
                    placeholder="Or type new Make (e.g. Porsche, Audi, Ford)"
                    required={!quickMakeId}
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111412] mb-1">
                  Model Name *
                </label>
                <Input
                  value={quickModelName}
                  onChange={(e) => setQuickModelName(e.target.value)}
                  placeholder="e.g. Land Cruiser Prado 250, Patrol Y63, Cayenne"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#111412] mb-1">
                    Year Start *
                  </label>
                  <Input
                    type="number"
                    value={quickYearStart}
                    onChange={(e) => setQuickYearStart(e.target.value)}
                    placeholder="2023"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111412] mb-1">
                    Year End (Optional)
                  </label>
                  <Input
                    type="number"
                    value={quickYearEnd}
                    onChange={(e) => setQuickYearEnd(e.target.value)}
                    placeholder="Leave empty for Present"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111412] mb-1">
                  Trim / Engine Variant Name *
                </label>
                <Input
                  value={quickVariantName}
                  onChange={(e) => setQuickVariantName(e.target.value)}
                  placeholder="e.g. 2.4L Turbo Hybrid, 5.6L V8 NISMO, 3.0L V6"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#111412] mb-1">
                    Fuel Type
                  </label>
                  <select
                    value={quickFuelType}
                    onChange={(e) => setQuickFuelType(e.target.value as any)}
                    className="w-full h-10 px-2.5 rounded-xl border border-[rgba(17,20,18,0.12)] bg-white text-xs text-[#111412]"
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
                    Engine Displacement
                  </label>
                  <Input
                    value={quickEngineCapacity}
                    onChange={(e) => setQuickEngineCapacity(e.target.value)}
                    placeholder="e.g. 3.5L V6"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[rgba(17,20,18,0.06)]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsVehicleModalOpen(false)}
                  disabled={isVehicleSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isVehicleSaving}
                  className="font-bold gap-1 shadow-md shadow-[#16834b]/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save & Select Vehicle</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

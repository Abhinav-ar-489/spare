"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Car,
  ChevronDown,
} from "lucide-react";
import { Brand, Category, Product, VehicleMake, VehicleModel, VehicleVariant } from "@/types";
import { ProductCard } from "./product-card";
import { Button } from "../ui/button";

interface PartsCatalogClientProps {
  initialProducts: Product[];
  categories: Category[];
  brands: Brand[];
  makes: VehicleMake[];
  models: VehicleModel[];
  variants: VehicleVariant[];
}

export function PartsCatalogClient({
  initialProducts,
  categories,
  brands,
  makes,
  models,
  variants,
}: PartsCatalogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search & filter state initialized from searchParams
  const [query, setQuery] = React.useState(searchParams.get("query") || "");
  const [selectedCategory, setSelectedCategory] = React.useState(searchParams.get("categoryId") || "");
  const [selectedBrand, setSelectedBrand] = React.useState(searchParams.get("brandId") || "");
  const [selectedMake, setSelectedMake] = React.useState(searchParams.get("makeId") || "");
  const [selectedModel, setSelectedModel] = React.useState(searchParams.get("modelId") || "");
  const [selectedVariant, setSelectedVariant] = React.useState(searchParams.get("variantId") || "");
  const [onlyInStock, setOnlyInStock] = React.useState(searchParams.get("isAvailable") === "true");
  const [onlyFeatured, setOnlyFeatured] = React.useState(searchParams.get("isFeatured") === "true");
  const [sortBy, setSortBy] = React.useState(searchParams.get("sortBy") || "newest");
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

  // Sync state if searchParams change
  React.useEffect(() => {
    setQuery(searchParams.get("query") || "");
    setSelectedCategory(searchParams.get("categoryId") || "");
    setSelectedBrand(searchParams.get("brandId") || "");
    setSelectedMake(searchParams.get("makeId") || "");
    setSelectedModel(searchParams.get("modelId") || "");
    setSelectedVariant(searchParams.get("variantId") || "");
    setOnlyInStock(searchParams.get("isAvailable") === "true");
    setOnlyFeatured(searchParams.get("isFeatured") === "true");
    setSortBy(searchParams.get("sortBy") || "newest");
  }, [searchParams]);

  // Derived filtered models & variants for dropdowns
  const availableModels = React.useMemo(() => {
    if (!selectedMake) return [];
    return models.filter((m) => m.make_id === selectedMake);
  }, [selectedMake, models]);

  const availableVariants = React.useMemo(() => {
    if (!selectedModel) return [];
    return variants.filter((v) => v.model_id === selectedModel);
  }, [selectedModel, variants]);

  // Filtered and sorted products
  const filteredProducts = React.useMemo(() => {
    let list = [...initialProducts];

    // Search query
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter((p) => {
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesPartNo = p.part_number.toLowerCase().includes(q);
        const matchesOem = p.oem_number?.toLowerCase().includes(q);
        const matchesBrand = p.brand?.name.toLowerCase().includes(q);
        const matchesCat = p.category?.name.toLowerCase().includes(q);
        const matchesTags = p.tags?.some((t) => t.toLowerCase().includes(q));

        const matchesVehicle = p.compatibilities?.some((c) => {
          const varName = c.variant?.name.toLowerCase() || "";
          const modelName = c.variant?.model?.name.toLowerCase() || "";
          const makeName = c.variant?.model?.make?.name.toLowerCase() || "";
          return (
            varName.includes(q) ||
            modelName.includes(q) ||
            makeName.includes(q) ||
            `${makeName} ${modelName}`.includes(q)
          );
        });

        return (
          matchesName ||
          matchesPartNo ||
          matchesOem ||
          matchesBrand ||
          matchesCat ||
          matchesTags ||
          matchesVehicle
        );
      });
    }

    if (selectedCategory) {
      list = list.filter((p) => p.category_id === selectedCategory);
    }

    if (selectedBrand) {
      list = list.filter((p) => p.brand_id === selectedBrand);
    }

    if (selectedVariant) {
      list = list.filter((p) =>
        p.compatibilities?.some((c) => c.variant_id === selectedVariant)
      );
    } else if (selectedModel) {
      const modelVarIds = variants.filter((v) => v.model_id === selectedModel).map((v) => v.id);
      list = list.filter((p) =>
        p.compatibilities?.some((c) => modelVarIds.includes(c.variant_id))
      );
    } else if (selectedMake) {
      const makeModelIds = models.filter((m) => m.make_id === selectedMake).map((m) => m.id);
      const makeVarIds = variants.filter((v) => makeModelIds.includes(v.model_id)).map((v) => v.id);
      list = list.filter((p) =>
        p.compatibilities?.some((c) => makeVarIds.includes(c.variant_id))
      );
    }

    if (onlyInStock) {
      list = list.filter((p) => p.is_available && p.stock > 0);
    }

    if (onlyFeatured) {
      list = list.filter((p) => p.is_featured);
    }

    // Sort
    if (sortBy === "price_low") {
      list.sort((a, b) => (a.discount_price || a.price || 0) - (b.discount_price || b.price || 0));
    } else if (sortBy === "price_high") {
      list.sort((a, b) => (b.discount_price || b.price || 0) - (a.discount_price || a.price || 0));
    } else if (sortBy === "name_asc") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name_desc") {
      list.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return list;
  }, [
    initialProducts,
    query,
    selectedCategory,
    selectedBrand,
    selectedMake,
    selectedModel,
    selectedVariant,
    onlyInStock,
    onlyFeatured,
    sortBy,
    models,
    variants,
  ]);

  const activeFiltersCount = [
    Boolean(query),
    Boolean(selectedCategory),
    Boolean(selectedBrand),
    Boolean(selectedMake || selectedModel || selectedVariant),
    onlyInStock,
    onlyFeatured,
  ].filter(Boolean).length;

  const resetAllFilters = () => {
    setQuery("");
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedMake("");
    setSelectedModel("");
    setSelectedVariant("");
    setOnlyInStock(false);
    setOnlyFeatured(false);
    setSortBy("newest");
    router.push("/parts");
  };

  const selectedVehicleDescription = React.useMemo(() => {
    const mk = makes.find((m) => m.id === selectedMake)?.name;
    const md = models.find((m) => m.id === selectedModel)?.name;
    const vr = variants.find((v) => v.id === selectedVariant)?.name;
    if (mk || md || vr) {
      return [mk, md, vr].filter(Boolean).join(" ");
    }
    return undefined;
  }, [selectedMake, selectedModel, selectedVariant, makes, models, variants]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[rgba(17,20,18,0.08)]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#16834b]">
            Direct OEM Inventory
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#111412] mt-0.5">
            Automotive Replacement Spares
          </h1>
          <p className="text-sm text-[#68706b] mt-1">
            Displaying {filteredProducts.length} certified components matching your criteria.
          </p>
        </div>

        {/* Search Input in Header */}
        <div className="w-full md:w-80 relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#16834b]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by part, OEM or car..."
            className="w-full h-11 pl-10 pr-8 rounded-xl border border-[rgba(17,20,18,0.12)] bg-[#f7f8f7] text-sm text-[#111412] placeholder:text-[#68706b]/60 focus:bg-white focus:border-[#16834b] focus:outline-none focus:ring-2 focus:ring-[#16834b]/15 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#68706b] hover:text-[#111412]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Vehicle Fitment Active Banner if Selected */}
      {selectedVehicleDescription && (
        <div className="mt-4 p-3.5 rounded-xl bg-[#e8f5ee] border border-[#16834b]/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Car className="w-4 h-4 text-[#16834b]" />
            <span className="text-xs sm:text-sm font-semibold text-[#0d6338]">
              Active Vehicle Filter: {selectedVehicleDescription}
            </span>
          </div>
          <button
            onClick={() => {
              setSelectedMake("");
              setSelectedModel("");
              setSelectedVariant("");
            }}
            className="text-xs font-semibold text-[#0d6338] hover:underline flex items-center gap-1"
          >
            Clear Vehicle
          </button>
        </div>
      )}

      {/* Layout: Sidebar Filter + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
        {/* Mobile Filter Sheet Trigger */}
        <div className="lg:hidden flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => setMobileFilterOpen(true)}
            className="flex-1 justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#16834b]" />
            <span>Filters ({activeFiltersCount})</span>
          </Button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 px-3 rounded-xl border border-[rgba(17,20,18,0.12)] bg-white text-xs font-semibold text-[#111412] focus:outline-none focus:border-[#16834b]"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
          </select>
        </div>

        {/* Sidebar Filters (Desktop & Mobile Drawer) */}
        <aside
          className={`lg:block ${
            mobileFilterOpen
              ? "fixed inset-0 z-50 bg-white p-6 overflow-y-auto"
              : "hidden"
          } space-y-6`}
        >
          {/* Mobile drawer header */}
          <div className="lg:hidden flex items-center justify-between pb-4 border-b border-[rgba(17,20,18,0.08)] mb-4">
            <h3 className="text-base font-bold text-[#111412] flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#16834b]" />
              <span>Filters</span>
            </h3>
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="p-1 rounded-lg text-[#68706b]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#111412] flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#16834b]" />
              Filter by System
            </span>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetAllFilters}
                className="text-xs font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* Vehicle Compatibility Filter Dropdowns */}
          <div className="rounded-xl border border-[rgba(17,20,18,0.08)] bg-[#f7f8f7]/50 p-4 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#68706b] flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-[#16834b]" />
              Vehicle Compatibility
            </span>

            {/* Make */}
            <div className="relative">
              <select
                value={selectedMake}
                onChange={(e) => {
                  setSelectedMake(e.target.value);
                  setSelectedModel("");
                  setSelectedVariant("");
                }}
                className="w-full h-9 rounded-lg border border-[rgba(17,20,18,0.1)] bg-white px-2.5 text-xs text-[#111412] focus:border-[#16834b] focus:outline-none"
              >
                <option value="">All Vehicle Makes</option>
                {makes.map((mk) => (
                  <option key={mk.id} value={mk.id}>
                    {mk.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Model */}
            {selectedMake && (
              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={(e) => {
                    setSelectedModel(e.target.value);
                    setSelectedVariant("");
                  }}
                  className="w-full h-9 rounded-lg border border-[rgba(17,20,18,0.1)] bg-white px-2.5 text-xs text-[#111412] focus:border-[#16834b] focus:outline-none"
                >
                  <option value="">All Models</option>
                  {availableModels.map((md) => (
                    <option key={md.id} value={md.id}>
                      {md.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Variant */}
            {selectedModel && (
              <div className="relative">
                <select
                  value={selectedVariant}
                  onChange={(e) => setSelectedVariant(e.target.value)}
                  className="w-full h-9 rounded-lg border border-[rgba(17,20,18,0.1)] bg-white px-2.5 text-xs text-[#111412] focus:border-[#16834b] focus:outline-none"
                >
                  <option value="">All Trims / Engines</option>
                  {availableVariants.map((vr) => (
                    <option key={vr.id} value={vr.id}>
                      {vr.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#111412] block">
              Categories
            </span>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedCategory("")}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === ""
                    ? "bg-[#e8f5ee] text-[#0d6338] font-bold"
                    : "text-[#68706b] hover:bg-[#f7f8f7] hover:text-[#111412]"
                }`}
              >
                <span>All Categories</span>
                <span>{initialProducts.length}</span>
              </button>
              {categories.map((cat) => {
                const count = initialProducts.filter((p) => p.category_id === cat.id).length;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(isSelected ? "" : cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isSelected
                        ? "bg-[#e8f5ee] text-[#0d6338] font-bold"
                        : "text-[#68706b] hover:bg-[#f7f8f7] hover:text-[#111412]"
                    }`}
                  >
                    <span className="truncate pr-2">{cat.name}</span>
                    <span className="text-[11px] opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2 pt-2 border-t border-[rgba(17,20,18,0.06)]">
            <span className="text-xs font-semibold text-[#111412] block">
              OEM Brands
            </span>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedBrand("")}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedBrand === ""
                    ? "bg-[#e8f5ee] text-[#0d6338] font-bold"
                    : "text-[#68706b] hover:bg-[#f7f8f7] hover:text-[#111412]"
                }`}
              >
                <span>All Brands</span>
                <span>{initialProducts.length}</span>
              </button>
              {brands.map((br) => {
                const count = initialProducts.filter((p) => p.brand_id === br.id).length;
                const isSelected = selectedBrand === br.id;
                return (
                  <button
                    key={br.id}
                    type="button"
                    onClick={() => setSelectedBrand(isSelected ? "" : br.id)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isSelected
                        ? "bg-[#e8f5ee] text-[#0d6338] font-bold"
                        : "text-[#68706b] hover:bg-[#f7f8f7] hover:text-[#111412]"
                    }`}
                  >
                    <span>{br.name}</span>
                    <span className="text-[11px] opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Availability & Featured toggles */}
          <div className="space-y-2.5 pt-2 border-t border-[rgba(17,20,18,0.06)]">
            <label className="flex items-center gap-2.5 text-xs font-medium text-[#111412] cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 rounded text-[#16834b] focus:ring-[#16834b] border-[rgba(17,20,18,0.2)]"
              />
              <span>In Stock Only</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs font-medium text-[#111412] cursor-pointer">
              <input
                type="checkbox"
                checked={onlyFeatured}
                onChange={(e) => setOnlyFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-[#16834b] focus:ring-[#16834b] border-[rgba(17,20,18,0.2)]"
              />
              <span>Featured Components</span>
            </label>
          </div>

          {/* Mobile apply button */}
          <div className="lg:hidden pt-4">
            <Button
              variant="primary"
              className="w-full justify-center"
              onClick={() => setMobileFilterOpen(false)}
            >
              Show {filteredProducts.length} Results
            </Button>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {/* Desktop Sort Row */}
          <div className="hidden lg:flex items-center justify-between mb-6 pb-3 border-b border-[rgba(17,20,18,0.06)] text-xs text-[#68706b]">
            <span>
              Showing <strong className="text-[#111412]">{filteredProducts.length}</strong> parts
            </span>

            <div className="flex items-center gap-2">
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-8 px-2.5 rounded-lg border border-[rgba(17,20,18,0.1)] bg-white text-xs font-semibold text-[#111412] focus:outline-none focus:border-[#16834b]"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
              </select>
            </div>
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-[rgba(17,20,18,0.08)] bg-[#f7f8f7]/50 p-12 text-center flex flex-col items-center justify-center my-6">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[rgba(17,20,18,0.08)] flex items-center justify-center text-[#68706b] mb-4 shadow-2xs">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#111412]">No parts match your criteria</h3>
              <p className="text-xs text-[#68706b] mt-1 max-w-sm">
                Try searching for another part name, OEM number, or clearing your active vehicle and category filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={resetAllFilters}
                className="mt-5"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                <span>Reset All Filters</span>
              </Button>
            </div>
          ) : (
            /* Responsive Product Grid: 3 cols on desktop within the 3-span area */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  selectedVehicleText={selectedVehicleDescription}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

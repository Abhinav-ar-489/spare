"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  X,
  Sparkles,
  Layers,
  Search,
} from "lucide-react";
import { Brand } from "@/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface BrandsManagerProps {
  initialBrands: Brand[];
}

export function BrandsManager({ initialBrands }: BrandsManagerProps) {
  const [brands, setBrands] = React.useState<Brand[]>(initialBrands);
  const [search, setSearch] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  // Form Fields
  const [brandName, setBrandName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [logoUrl, setLogoUrl] = React.useState("");
  const [description, setDescription] = React.useState("");

  const filteredBrands = React.useMemo(() => {
    if (!search.trim()) return brands;
    const q = search.toLowerCase();
    return brands.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
    );
  }, [brands, search]);

  const handleNameChange = (val: string) => {
    setBrandName(val);
    if (!slug || slug === val.slice(0, -1).toLowerCase().replace(/[^a-z0-9]+/g, "-")) {
      setSlug(val.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
    }
  };

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) {
      setError("Please enter a brand name.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: brandName.trim(),
          slug: slug.trim() || undefined,
          logo_url: logoUrl.trim() || undefined,
          description: description.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Failed to add brand");
        setIsSubmitting(false);
        return;
      }

      setBrands((prev) => [data.brand, ...prev]);
      setSuccessMsg(`Brand "${data.brand.name}" added successfully.`);
      setIsModalOpen(false);
      setBrandName("");
      setSlug("");
      setLogoUrl("");
      setDescription("");

      setTimeout(() => setSuccessMsg(null), 4000);
    } catch {
      setError("Network error occurred while creating brand.");
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
            Authorized Parts Brands Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-[#68706b] mt-0.5">
            Manage Tier-1 OEM and premium aftermarket manufacturers for spare parts inventory.
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
          <span>Add New Brand</span>
        </Button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-[#e8f5ee] border border-[#16834b]/30 text-xs text-[#0d6338] font-medium flex items-center gap-2 animate-in fade-in-50">
          <CheckCircle2 className="w-4 h-4 text-[#16834b] shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search and Stats Filter */}
      <div className="flex items-center justify-between gap-4 p-3 rounded-2xl glass-card border border-white/90">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#68706b] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brands by name, keyword or slug..."
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-[rgba(17,20,18,0.08)] bg-white text-xs text-[#111412] placeholder:text-[#68706b]/60 focus:outline-none focus:border-[#16834b]"
          />
        </div>
        <span className="text-xs font-semibold text-[#68706b] shrink-0 pr-2">
          {filteredBrands.length} Brands Available
        </span>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredBrands.map((b) => (
          <div
            key={b.id}
            className="p-5 rounded-2xl glass-card border border-white/90 shadow-sm flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-[#111412] truncate max-w-[140px]">
                  {b.name}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#e8f5ee] text-[#0d6338] shrink-0">
                  {b.parts_count || 0} Parts
                </span>
              </div>

              <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-[#f7f8f7] mb-3 border border-[rgba(17,20,18,0.04)]">
                <Image
                  src={b.logo_url}
                  alt={b.name}
                  fill
                  sizes="240px"
                  className="object-cover"
                />
              </div>

              <p className="text-xs text-[#68706b] leading-relaxed line-clamp-3">
                {b.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[rgba(17,20,18,0.06)] flex items-center justify-between text-xs">
              <span className="text-[#68706b] font-mono text-[11px] truncate max-w-[120px]">
                /{b.slug}
              </span>
              <Link
                href={`/brands/${b.slug}`}
                target="_blank"
                className="font-semibold text-[#16834b] hover:underline flex items-center gap-1"
              >
                <span>Store</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Brand Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in-50 duration-200">
          <div className="w-full max-w-lg rounded-3xl glass-card border border-white/95 p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl hover:bg-white/80 text-[#68706b] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-[#111412] flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5 text-[#16834b]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#111412]">
                  Add Authorized Parts Brand
                </h2>
                <p className="text-xs text-[#68706b]">
                  Register a new OEM or performance aftermarket manufacturer.
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateBrand} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#111412] mb-1">
                  Brand Name *
                </label>
                <Input
                  value={brandName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Aisin, Akebono, Koyo, KYB, NGK"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111412] mb-1">
                  URL Slug
                </label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. aisin"
                />
                <p className="text-[10px] text-[#68706b] mt-0.5">
                  Identifier for URLs: /brands/{slug || "brand-name"}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111412] mb-1">
                  Brand Logo / Header Image URL
                </label>
                <Input
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://... (or leave blank for high-res automotive default)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111412] mb-1">
                  Description & Manufacturing Heritage
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the manufacturer's core component specialties (e.g. Japanese transmission assemblies, brake pads, water pumps)..."
                  rows={3}
                  className="w-full p-3 rounded-xl border border-[rgba(17,20,18,0.12)] bg-white/90 text-xs text-[#111412] placeholder:text-[#68706b]/60 focus:outline-none focus:border-[#16834b] focus:ring-2 focus:ring-[#16834b]/10 resize-none font-sans"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
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
                  <span>Create Brand</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

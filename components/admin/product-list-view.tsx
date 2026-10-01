"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Archive,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Car,
} from "lucide-react";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils/formatters";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface ProductListViewProps {
  initialProducts: Product[];
}

export function ProductListView({ initialProducts }: ProductListViewProps) {
  const [products, setProducts] = React.useState(initialProducts);
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.part_number.toLowerCase().includes(q) ||
        p.oem_number?.toLowerCase().includes(q) ||
        p.brand?.name.toLowerCase().includes(q)
    );
  }, [products, query]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete product");
    }
  };

  const handleToggleAvailable = async (product: Product) => {
    try {
      const updatedStatus = !product.is_available;
      await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_available: updatedStatus }),
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, is_available: updatedStatus } : p
        )
      );
    } catch {
      alert("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111412]">
            Spare Parts Inventory
          </h1>
          <p className="text-xs sm:text-sm text-[#68706b] mt-0.5">
            Total of {products.length} registered parts with live stock telemetry.
          </p>
        </div>

        <Link href="/admin/products/new">
          <Button variant="primary" size="md" className="font-semibold gap-1.5 shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Add New Part</span>
          </Button>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-3 rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white shadow-2xs flex items-center gap-3">
        <Search className="w-4 h-4 text-[#16834b] ml-1 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by part number, title, or OEM code..."
          className="w-full text-xs sm:text-sm text-[#111412] placeholder:text-[#68706b]/60 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-xs text-[#68706b] hover:text-[#111412] px-2 py-0.5 rounded"
          >
            Clear
          </button>
        )}
      </div>

      {/* Mobile Card Layout (visible on small screens) */}
      <div className="grid grid-cols-1 gap-3.5 md:hidden">
        {filtered.map((prod) => {
          const imgUrl =
            prod.images?.[0]?.url ||
            "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?w=200&auto=format&fit=crop&q=80";

          return (
            <div
              key={prod.id}
              className="p-4 rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white space-y-3 shadow-2xs"
            >
              <div className="flex items-start gap-3">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#f7f8f7] shrink-0 border border-[rgba(17,20,18,0.06)]">
                  <Image
                    src={imgUrl}
                    alt={prod.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#16834b]">
                    {prod.brand?.name || "OEM"} • Part #{prod.part_number}
                  </span>
                  <h3 className="text-sm font-bold text-[#111412] leading-snug line-clamp-1">
                    {prod.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1 text-xs">
                    <span className="font-extrabold text-[#111412]">
                      {formatCurrency(prod.discount_price || prod.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleAvailable(prod)}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        prod.is_available
                          ? "bg-[#e8f5ee] text-[#0d6338]"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {prod.is_available ? "● In Stock" : "○ Hidden"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-[rgba(17,20,18,0.06)] flex items-center justify-between gap-2">
                <Link
                  href={`/parts/${prod.slug}`}
                  target="_blank"
                  className="text-xs text-[#68706b] hover:text-[#111412] flex items-center gap-1 font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Store Preview</span>
                </Link>

                <div className="flex items-center gap-2">
                  <Link href={`/admin/products/${prod.id}`}>
                    <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                      <Edit className="w-3.5 h-3.5 mr-1" />
                      <span>Edit</span>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(prod.id, prod.name)}
                    className="h-8 px-2 text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View (hidden on small screens) */}
      <div className="hidden md:block rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#f7f8f7] text-[#68706b] uppercase font-bold text-[10px] tracking-wider border-b border-[rgba(17,20,18,0.06)]">
            <tr>
              <th className="px-5 py-3.5">Part Details</th>
              <th className="px-4 py-3.5">Brand & Category</th>
              <th className="px-4 py-3.5">Price</th>
              <th className="px-4 py-3.5">Stock Status</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(17,20,18,0.04)]">
            {filtered.map((prod) => {
              const imgUrl =
                prod.images?.[0]?.url ||
                "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?w=200&auto=format&fit=crop&q=80";

              return (
                <tr key={prod.id} className="hover:bg-[#f7f8f7]/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-[#f7f8f7] shrink-0 border border-[rgba(17,20,18,0.06)]">
                        <Image
                          src={imgUrl}
                          alt={prod.name}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <Link
                          href={`/admin/products/${prod.id}`}
                          className="font-bold text-[#111412] hover:text-[#16834b] line-clamp-1"
                        >
                          {prod.name}
                        </Link>
                        <span className="font-mono text-[#68706b] text-[11px] block">
                          Part: {prod.part_number}
                          {prod.oem_number && ` • OEM: ${prod.oem_number}`}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="font-semibold text-[#111412] block">
                      {prod.brand?.name || "OEM"}
                    </span>
                    <span className="text-[#68706b] text-[11px] block">
                      {prod.category?.name || "General"}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="font-bold text-[#111412] block">
                      {formatCurrency(prod.discount_price || prod.price)}
                    </span>
                    {prod.discount_price && (
                      <span className="line-through text-[#68706b] text-[10px] block">
                        {formatCurrency(prod.price)}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => handleToggleAvailable(prod)}
                      className="cursor-pointer"
                    >
                      {prod.is_available && prod.stock > 0 ? (
                        <Badge variant="success" size="sm">
                          <CheckCircle2 className="w-3 h-3 text-[#16834b]" />
                          {prod.stock} in Stock
                        </Badge>
                      ) : (
                        <Badge variant="neutral" size="sm">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          Out / Disabled
                        </Badge>
                      )}
                    </button>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/parts/${prod.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-[#68706b] hover:text-[#111412] hover:bg-white"
                        title="View Public Store Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/products/${prod.id}`}
                        className="p-1.5 rounded-lg text-[#68706b] hover:text-[#16834b] hover:bg-[#e8f5ee]"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(prod.id, prod.name)}
                        className="p-1.5 rounded-lg text-[#68706b] hover:text-rose-600 hover:bg-rose-50"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

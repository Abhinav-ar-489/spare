"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Plus,
  AlertCircle,
  CheckCircle2,
  FolderTree,
  MessageSquare,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Car,
  ChevronRight,
} from "lucide-react";
import { Enquiry, Product } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface DashboardViewProps {
  stats: {
    totalProducts: number;
    activeProducts: number;
    outOfStock: number;
    totalCategories: number;
    totalBrands: number;
    totalEnquiries: number;
    newEnquiries: number;
  };
  recentProducts: Product[];
  recentEnquiries: Enquiry[];
}

export function DashboardView({
  stats,
  recentProducts: initialProducts,
  recentEnquiries: initialEnquiries,
}: DashboardViewProps) {
  const [enquiries, setEnquiries] = React.useState(initialEnquiries);
  const [products] = React.useState(initialProducts);

  const handleUpdateStatus = async (
    id: string,
    status: "new" | "contacted" | "resolved"
  ) => {
    try {
      await fetch(`/api/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      );
    } catch {
      // Revert if error
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111412]">
            Workshop Operations Desk
          </h1>
          <p className="text-xs sm:text-sm text-[#68706b] mt-0.5">
            Real-time telemetry for spare parts inventory, fitment compatibility, and customer requests.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2.5">
          <Link href="/admin/products/new">
            <Button variant="primary" size="md" className="font-semibold gap-1.5 shadow-sm">
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Button>
          </Link>
          <Link href="/admin/enquiries">
            <Button variant="outline" size="md" className="font-semibold gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#16834b]" />
              <span>Enquiries</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {/* Card 1: Total Products */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white shadow-2xs">
          <div className="flex items-center justify-between text-[#68706b] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Catalog Spares
            </span>
            <Package className="w-4 h-4 text-[#16834b]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#111412]">
            {stats.totalProducts}
          </div>
          <p className="text-[11px] text-[#16834b] font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{stats.activeProducts} active on store</span>
          </p>
        </div>

        {/* Card 2: Out of Stock */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white shadow-2xs">
          <div className="flex items-center justify-between text-[#68706b] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Stock Attention
            </span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#111412]">
            {stats.outOfStock}
          </div>
          <p className="text-[11px] text-[#68706b] mt-1">
            Parts requiring OEM replenishment
          </p>
        </div>

        {/* Card 3: Categories & Brands */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white shadow-2xs">
          <div className="flex items-center justify-between text-[#68706b] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Systems & Brands
            </span>
            <FolderTree className="w-4 h-4 text-[#16834b]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#111412]">
            {stats.totalCategories} / {stats.totalBrands}
          </div>
          <p className="text-[11px] text-[#68706b] mt-1">
            Categories & OEM partners active
          </p>
        </div>

        {/* Card 4: New Enquiries */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white shadow-2xs">
          <div className="flex items-center justify-between text-[#68706b] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Customer Leads
            </span>
            <MessageSquare className="w-4 h-4 text-[#16834b]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#111412]">
            {stats.totalEnquiries}
          </div>
          <p className="text-[11px] text-[#16834b] font-medium mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16834b] animate-pulse" />
            <span>{stats.newEnquiries} awaiting response</span>
          </p>
        </div>
      </div>

      {/* 2-Column Split: Recent Enquiries & Recent Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Recent Enquiries (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(17,20,18,0.06)]">
            <div>
              <h2 className="text-base font-bold text-[#111412]">
                Recent Inquiries & Quote Requests
              </h2>
              <p className="text-xs text-[#68706b]">
                Real-time requests submitted via website & WhatsApp bridge
              </p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-semibold text-[#16834b] hover:text-[#0d6338] transition-colors"
            >
              View All ({enquiries.length}) →
            </Link>
          </div>

          {enquiries.length === 0 ? (
            <p className="text-xs text-[#68706b] py-6 text-center">
              No enquiries recorded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {enquiries.slice(0, 4).map((enq) => (
                <div
                  key={enq.id}
                  className="p-3.5 rounded-xl border border-[rgba(17,20,18,0.06)] bg-[#f7f8f7]/50 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-[#111412]">
                        {enq.name}
                      </span>
                      <span className="text-xs text-[#68706b] ml-2">
                        {enq.phone}
                      </span>
                    </div>

                    {/* Status Badge & Dropdown */}
                    <div className="flex items-center gap-1.5">
                      <select
                        value={enq.status}
                        onChange={(e) =>
                          handleUpdateStatus(
                            enq.id,
                            e.target.value as "new" | "contacted" | "resolved"
                          )
                        }
                        className={`text-[11px] font-semibold rounded-md px-2 py-0.5 border-0 focus:ring-1 focus:ring-[#16834b] cursor-pointer ${
                          enq.status === "new"
                            ? "bg-[#e8f5ee] text-[#0d6338]"
                            : enq.status === "contacted"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-[#f2f4f2] text-[#68706b]"
                        }`}
                      >
                        <option value="new">New Lead</option>
                        <option value="contacted">Contacted</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </div>

                  {enq.vehicle_details && (
                    <div className="text-[11px] text-[#111412] font-medium flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-[#16834b]" />
                      <span>{enq.vehicle_details}</span>
                    </div>
                  )}

                  <p className="text-xs text-[#68706b] line-clamp-2 leading-relaxed">
                    &quot;{enq.message}&quot;
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-[#68706b] pt-1">
                    <span>{formatDate(enq.created_at)}</span>
                    <a
                      href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#16834b] hover:underline"
                    >
                      WhatsApp Reply →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Products (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(17,20,18,0.06)]">
            <div>
              <h2 className="text-base font-bold text-[#111412]">
                Inventory Spares
              </h2>
              <p className="text-xs text-[#68706b]">
                Latest items added to the catalog
              </p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-[#16834b] hover:text-[#0d6338] transition-colors"
            >
              All Parts →
            </Link>
          </div>

          <div className="space-y-3">
            {products.slice(0, 5).map((prod) => {
              const imgUrl = prod.images?.[0]?.url || "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?w=200&auto=format&fit=crop&q=80";
              return (
                <div
                  key={prod.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-[rgba(17,20,18,0.06)] bg-[#f7f8f7]/40 hover:bg-[#f7f8f7] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-white shrink-0 border border-[rgba(17,20,18,0.06)]">
                      <Image
                        src={imgUrl}
                        alt={prod.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/admin/products/${prod.id}`}
                        className="text-xs font-semibold text-[#111412] hover:text-[#16834b] truncate block"
                      >
                        {prod.name}
                      </Link>
                      <span className="text-[11px] font-mono text-[#68706b] block">
                        #{prod.part_number} • {prod.brand?.name || "OEM"}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[#111412] block">
                      {formatCurrency(prod.discount_price || prod.price)}
                    </span>
                    <span
                      className={`text-[10px] font-semibold ${
                        prod.is_available && prod.stock > 0
                          ? "text-[#16834b]"
                          : "text-rose-600"
                      }`}
                    >
                      {prod.is_available && prod.stock > 0
                        ? `${prod.stock} in stock`
                        : "Out of stock"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-[rgba(17,20,18,0.06)]">
            <Link href="/admin/products/new">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5 mr-1 text-[#16834b]" />
                <span>Create New Part SKU</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

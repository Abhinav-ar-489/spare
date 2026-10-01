"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, CheckCircle2, AlertCircle, ShoppingBag } from "lucide-react";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils/formatters";
import { useCart } from "@/context/cart-context";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface ProductCardProps {
  product: Product;
  selectedVehicleText?: string;
}

export function ProductCard({ product, selectedVehicleText }: ProductCardProps) {
  const { addItem } = useCart();

  const primaryImage =
    product.images?.find((img) => img.is_primary)?.url ||
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?w=600&auto=format&fit=crop&q=80";

  // Derive short compatibility summary if available
  const compatibilitySummary = selectedVehicleText
    ? selectedVehicleText
    : product.compatibilities && product.compatibilities.length > 0
    ? `${product.compatibilities[0]?.variant?.model?.make?.name || ""} ${
        product.compatibilities[0]?.variant?.model?.name || ""
      }${
        product.compatibilities.length > 1
          ? ` +${product.compatibilities.length - 1} more`
          : ""
      }`
    : "Universal Fitment";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  return (
    <div className="group relative flex flex-col rounded-2xl glass-card border border-white/90 p-3.5 sm:p-4 transition-all duration-300">
      {/* Product Image Frame */}
      <Link
        href={`/parts/${product.slug}`}
        className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-[#f7f8f7] border border-[rgba(17,20,18,0.04)] mb-3.5 block"
      >
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Brand floating badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className="inline-block px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg glass-badge text-[#111412] shadow-sm">
            {product.brand?.name || "OEM"}
          </span>
        </div>

        {/* Featured pill */}
        {product.is_featured && (
          <div className="absolute top-2.5 right-2.5">
            <span className="inline-block px-2 py-0.5 text-[10px] font-medium tracking-tight rounded-md bg-[#16834b] text-white shadow-sm">
              Featured
            </span>
          </div>
        )}
      </Link>

      {/* Part details */}
      <div className="flex flex-col flex-1">
        {/* Category & Part Number */}
        <div className="flex items-center justify-between text-xs text-[#68706b] mb-1 font-mono">
          <span className="font-semibold text-[#16834b]">
            {product.part_number}
          </span>
          {product.oem_number && (
            <span className="truncate max-w-[120px] text-[11px] text-[#68706b]/80" title={`OEM: ${product.oem_number}`}>
              OEM: {product.oem_number}
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/parts/${product.slug}`} className="group-hover:text-[#16834b] transition-colors">
          <h3 className="text-sm sm:text-base font-semibold text-[#111412] leading-snug line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Compatibility info */}
        <div className="text-xs text-[#68706b] mb-3 line-clamp-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#16834b]/60 shrink-0" />
          <span className="truncate">{compatibilitySummary}</span>
        </div>

        {/* Price & Availability row */}
        <div className="mt-auto pt-3 border-t border-[rgba(17,20,18,0.06)] flex items-center justify-between">
          <div>
            <div className="text-base sm:text-lg font-extrabold text-[#111412] tracking-tight">
              {formatCurrency(product.discount_price || product.price, product.currency)}
            </div>
            {product.discount_price && product.price && (
              <span className="text-xs text-[#68706b] line-through -mt-1 block">
                {formatCurrency(product.price, product.currency)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {product.is_available && product.stock > 0 ? (
              <Badge variant="success" size="sm">
                <CheckCircle2 className="w-3 h-3 text-[#16834b]" />
                In Stock
              </Badge>
            ) : (
              <Badge variant="neutral" size="sm">
                <AlertCircle className="w-3 h-3 text-[#68706b]" />
                On Request
              </Badge>
            )}
          </div>
        </div>

        {/* Action row: Add to Cart + View Details */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            disabled={!product.is_available || product.stock <= 0}
            className="text-xs font-semibold rounded-xl gap-1.5 justify-center"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </Button>

          <Link
            href={`/parts/${product.slug}`}
            className="flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs font-semibold text-[#111412] bg-[#f7f8f7] hover:bg-[#e8f5ee] hover:text-[#0d6338] transition-all"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

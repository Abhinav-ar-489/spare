"use client";

import * as React from "react";
import Link from "next/link";
import {
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  Sparkles,
  Car,
  FileText,
  CreditCard,
  ChevronRight,
  ShoppingBag,
  Plus,
  Minus,
} from "lucide-react";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils/formatters";
import { useCart } from "@/context/cart-context";
import { ImageGallery } from "./image-gallery";
import { WhatsAppButton } from "./whatsapp-button";
import { EnquiryModal } from "./enquiry-modal";
import { ProductCard } from "./product-card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = React.useState(false);
  const [addedAnimation, setAddedAnimation] = React.useState(false);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-[#68706b] mb-6 overflow-x-auto whitespace-nowrap pb-1">
        <Link href="/" className="hover:text-[#111412] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#68706b]/40 shrink-0" />
        <Link href="/parts" className="hover:text-[#111412] transition-colors">
          Parts
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#68706b]/40 shrink-0" />
        {product.category && (
          <>
            <Link
              href={`/categories/${product.category.slug}`}
              className="hover:text-[#111412] transition-colors"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#68706b]/40 shrink-0" />
          </>
        )}
        <span className="text-[#111412] font-semibold truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Col: Image Gallery (6 cols) */}
        <div className="lg:col-span-6">
          <ImageGallery images={product.images} productName={product.name} />

          {/* Quick Technical Guarantee Panel */}
          <div className="mt-6 rounded-2xl glass-card border border-white/80 p-4.5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111412] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#16834b]" />
              Authenticity & Dispatch Guarantee
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs text-[#68706b]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16834b] shrink-0" />
                <span>100% Genuine OEM Sourced</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#16834b] shrink-0" />
                <span>Next-Day Express Freight</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-[#16834b] shrink-0" />
                <span>Chassis / VIN Fitment Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-[#16834b] shrink-0" />
                <span>5% VAT Tax Invoice (FTA Compliant)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Product Information & CTAs (6 cols) */}
        <div className="lg:col-span-6 flex flex-col">
          {/* Brand & Part Identifiers */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#111412] text-white">
                {product.brand?.name || "OEM"}
              </span>
              <span className="text-xs font-mono text-[#16834b] font-bold bg-[#e8f5ee] px-2.5 py-1 rounded-lg">
                Part #{product.part_number}
              </span>
            </div>

            {product.is_available && product.stock > 0 ? (
              <Badge variant="success" size="md">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16834b]" />
                In Stock ({product.stock} units in Dubai Warehouse)
              </Badge>
            ) : (
              <Badge variant="neutral" size="md">
                <AlertCircle className="w-3.5 h-3.5 text-[#68706b]" />
                Direct Order on Request
              </Badge>
            )}
          </div>

          {/* Product Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111412] leading-tight mb-2">
            {product.name}
          </h1>

          {/* OEM Number cross reference */}
          {product.oem_number && (
            <p className="text-xs font-mono text-[#68706b] mb-4">
              OEM Cross-Reference: <span className="text-[#111412] font-semibold">{product.oem_number}</span>
            </p>
          )}

          {/* Price Block in AED */}
          <div className="py-4 my-2 border-y border-[rgba(17,20,18,0.06)] flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#111412] tracking-tight">
              {formatCurrency(product.discount_price || product.price, product.currency)}
            </span>
            {product.discount_price && product.price && (
              <span className="text-base text-[#68706b] line-through font-medium">
                {formatCurrency(product.price, product.currency)}
              </span>
            )}
            <span className="text-xs text-[#68706b]">
              (+5% VAT calculated at checkout • Same-day dispatch available)
            </span>
          </div>

          {/* Add to Cart with Quantity Selector */}
          <div className="my-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[rgba(17,20,18,0.14)] rounded-xl bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f7f8f7] text-[#111412]"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-[#111412]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f7f8f7] text-[#111412]"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.is_available || product.stock <= 0}
                className="flex-1 font-bold text-sm sm:text-base gap-2 shadow-md shadow-[#16834b]/20"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{addedAnimation ? "✓ Added to Cart!" : "Add to Shopping Cart"}</span>
              </Button>
            </div>

            {/* Direct WhatsApp Quote Button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <WhatsAppButton
                product={product}
                size="lg"
                className="w-full text-sm font-semibold justify-center bg-[#111412] hover:bg-[#222]"
                label="Enquire via WhatsApp"
              />

              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsEnquiryModalOpen(true)}
                className="w-full text-sm font-semibold justify-center"
              >
                <span>Request Custom Quote</span>
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111412]">
              Engineering & Performance Overview
            </h3>
            <p className="text-sm text-[#68706b] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Vehicle Compatibility Box */}
          <div className="mt-6 rounded-2xl glass-card border border-white/80 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111412] flex items-center gap-1.5">
                <Car className="w-4 h-4 text-[#16834b]" />
                Confirmed Vehicle Compatibility
              </h3>
              <span className="text-[11px] font-semibold text-[#16834b] bg-[#e8f5ee] px-2 py-0.5 rounded">
                Verified Fit
              </span>
            </div>

            {product.compatibilities && product.compatibilities.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {product.compatibilities.map((comp) => {
                  const makeName = comp.variant?.model?.make?.name || "";
                  const modelName = comp.variant?.model?.name || "";
                  const variantName = comp.variant?.name || "";
                  const years = comp.variant?.model
                    ? `(${comp.variant.model.year_start} - ${comp.variant.model.year_end || "Present"})`
                    : "";

                  return (
                    <div
                      key={comp.id}
                      className="p-2.5 rounded-xl bg-[#f7f8f7] text-xs flex items-center justify-between border border-[rgba(17,20,18,0.04)]"
                    >
                      <div>
                        <span className="font-semibold text-[#111412]">
                          {makeName} {modelName} {years}
                        </span>
                        <span className="text-[#68706b] block">
                          Trim: {variantName}
                        </span>
                      </div>
                      {comp.notes && (
                        <span className="text-[11px] text-[#68706b] italic max-w-[140px] truncate">
                          {comp.notes}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[#68706b]">
                Standard universal fitment across conforming systems. Contact WhatsApp desk to verify your chassis code.
              </p>
            )}
          </div>

          {/* Specifications Table */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111412]">
                Technical Specifications
              </h3>
              <div className="rounded-2xl border border-[rgba(17,20,18,0.08)] overflow-hidden">
                <table className="w-full text-xs text-left">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, val], idx) => (
                      <tr
                        key={key}
                        className={idx % 2 === 0 ? "bg-white" : "bg-[#f7f8f7]/60"}
                      >
                        <td className="px-4 py-2.5 font-semibold text-[#111412] w-1/2 border-b border-[rgba(17,20,18,0.04)]">
                          {key}
                        </td>
                        <td className="px-4 py-2.5 text-[#68706b] font-mono border-b border-[rgba(17,20,18,0.04)]">
                          {val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-16 sm:mt-24 pt-12 border-t border-[rgba(17,20,18,0.08)]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#16834b]">
                Complementary Spares
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#111412] mt-0.5">
                Related Components in {product.category?.name || "Category"}
              </h2>
            </div>
            <Link
              href={`/categories/${product.category?.slug || ""}`}
              className="text-xs font-semibold text-[#16834b] hover:text-[#0d6338]"
            >
              Browse Category →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Interactive Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        product={product}
      />
    </div>
  );
}

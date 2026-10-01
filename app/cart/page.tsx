"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatCurrency } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    vatAmount,
    shippingFee,
    total,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#f7f8f7] border border-[rgba(17,20,18,0.06)] flex items-center justify-center text-[#68706b] mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#111412]">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-sm text-[#68706b] max-w-sm mx-auto">
          Add certified automotive spare parts from our catalog to review pricing and calculate 5% VAT.
        </p>
        <div className="pt-2">
          <Link href="/parts">
            <Button variant="primary" size="lg" className="font-bold">
              Browse Spare Parts Catalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(17,20,18,0.08)]">
        <div>
          <Link
            href="/parts"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#68706b] hover:text-[#111412] mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111412]">
            Shopping Cart ({items.length} {items.length === 1 ? "Item" : "Items"})
          </h1>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-medium text-rose-600 hover:text-rose-700 self-start sm:self-auto"
        >
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Cart Items Table / Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          {items.map(({ product, quantity }) => {
            const imgUrl =
              product.images?.[0]?.url ||
              "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?w=200&auto=format&fit=crop&q=80";
            const unitPrice =
              product.discount_price || product.price || 0;
            const lineTotal = unitPrice * quantity;

            return (
              <div
                key={product.id}
                className="p-4 sm:p-5 rounded-3xl border border-[rgba(17,20,18,0.08)] bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-[#f7f8f7] shrink-0 border border-[rgba(17,20,18,0.06)]">
                    <Image
                      src={imgUrl}
                      alt={product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#16834b] block">
                      {product.brand?.name || "OEM"} • #{product.part_number}
                    </span>
                    <Link
                      href={`/parts/${product.slug}`}
                      className="text-sm font-bold text-[#111412] hover:text-[#16834b] line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <span className="text-xs text-[#68706b] font-medium block mt-0.5">
                      Unit: {formatCurrency(unitPrice)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[rgba(17,20,18,0.04)]">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-[rgba(17,20,18,0.14)] rounded-xl bg-white p-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f7f8f7] text-[#111412]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#111412]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f7f8f7] text-[#111412]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold text-[#111412] block">
                      {formatCurrency(lineTotal)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="text-[11px] text-[#68706b] hover:text-rose-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Order Summary (4 cols) */}
        <div className="lg:col-span-4">
          <div className="p-6 rounded-3xl glass-card border border-white/80 shadow-lg space-y-5 sticky top-24">
            <h2 className="text-base font-bold text-[#111412] pb-3 border-b border-[rgba(17,20,18,0.06)]">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-xs text-[#68706b]">
              <div className="flex justify-between">
                <span>Subtotal (Excl. VAT)</span>
                <span className="font-semibold text-[#111412]">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>5% VAT (FTA Compliant)</span>
                <span className="font-semibold text-[#111412]">
                  {formatCurrency(vatAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Courier Express Dispatch</span>
                <span className="font-semibold text-[#111412]">
                  {shippingFee === 0 ? "FREE" : formatCurrency(shippingFee)}
                </span>
              </div>

              <div className="pt-3 border-t border-[rgba(17,20,18,0.06)] flex justify-between text-base font-extrabold text-[#111412]">
                <span>Total Amount Due</span>
                <span className="text-[#16834b]">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <Link href="/checkout" className="block pt-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full font-bold justify-center gap-2 shadow-md shadow-[#16834b]/20"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <div className="text-[11px] text-[#68706b] space-y-1.5 pt-2">
              <div className="flex items-center gap-1.5 text-[#16834b] font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Genuine Certified OEM Spares</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4" />
                <span>Free delivery across UAE on orders above AED 500</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

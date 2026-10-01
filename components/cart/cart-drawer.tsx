"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatCurrency } from "@/lib/utils/formatters";
import { Button } from "../ui/button";

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    subtotal,
    vatAmount,
    shippingFee,
    total,
  } = useCart();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Translucent Backdrop */}
      <div
        className="fixed inset-0 bg-[#111412]/35 backdrop-blur-md transition-opacity duration-300"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
        {/* Evident Frosted Glass Drawer Panel */}
        <div className="w-screen max-w-md glass-drawer border-l border-white/90 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-white/70 bg-white/60 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#e8f5ee] flex items-center justify-center text-[#16834b] border border-[#16834b]/20">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#111412]">
                  Your Cart
                </h3>
                <span className="text-[11px] text-[#68706b]">
                  {items.length} {items.length === 1 ? "item" : "items"} selected
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={closeDrawer}
              className="p-1.5 rounded-xl text-[#68706b] hover:text-[#111412] hover:bg-white/80 transition-colors border border-transparent hover:border-white/80"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/80 backdrop-blur-md border border-white/90 flex items-center justify-center text-[#68706b] shadow-sm">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[#111412]">
                    Your shopping cart is empty
                  </p>
                  <p className="text-xs text-[#68706b] max-w-xs">
                    Explore our certified OEM parts catalog to find compatible components for your vehicle.
                  </p>
                </div>
                <Link href="/parts" onClick={closeDrawer}>
                  <Button variant="primary" size="sm">
                    Browse Parts Catalog
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => {
                  const primaryImg =
                    item.product.images?.find((img) => img.is_primary)?.url ||
                    item.product.images?.[0]?.url ||
                    "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400";

                  return (
                    <div
                      key={item.product.id}
                      className="flex gap-3 p-3 rounded-2xl glass-card border border-white/80 shadow-2xs transition-all hover:bg-white/90"
                    >
                      {/* Product Image Frame */}
                      <div className="relative w-18 h-18 rounded-xl overflow-hidden bg-white shrink-0 border border-white/80 shadow-2xs">
                        <Image
                          src={primaryImg}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-xs font-bold text-[#111412] leading-tight truncate">
                              {item.product.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeItem(item.product.id)}
                              className="text-[#68706b] hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-[10px] text-[#68706b] font-mono">
                            OEM: {item.product.part_number}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity selector */}
                          <div className="inline-flex items-center border border-white/90 rounded-lg bg-white/80 shadow-2xs">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity - 1)
                              }
                              className="p-1 hover:bg-[#f7f8f7] rounded-l-lg transition-colors text-[#68706b] cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-[#111412]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                              className="p-1 hover:bg-[#f7f8f7] rounded-r-lg transition-colors text-[#68706b] cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs font-bold text-[#111412]">
                            {formatCurrency(
                              (item.product.discount_price || item.product.price || 0) * item.quantity
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Drawer Footer: Subtotal & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-white/80 bg-white/70 backdrop-blur-xl space-y-3">
              <div className="space-y-1.5 text-xs text-[#68706b]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
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
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3 text-[#16834b]" />
                    <span>Courier Express Delivery</span>
                  </span>
                  <span className="font-semibold text-[#111412]">
                    {shippingFee === 0 ? "FREE" : formatCurrency(shippingFee)}
                  </span>
                </div>
                <div className="pt-2 border-t border-[rgba(17,20,18,0.06)] flex justify-between text-sm font-extrabold text-[#111412]">
                  <span>Total Due</span>
                  <span className="text-[#16834b] text-base">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Link href="/checkout" onClick={closeDrawer} className="block">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full font-bold justify-center gap-2 shadow-lg shadow-[#16834b]/20"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <div className="flex items-center justify-between text-[11px] text-[#68706b]">
                  <Link
                    href="/cart"
                    onClick={closeDrawer}
                    className="hover:text-[#111412] underline"
                  >
                    View detailed cart
                  </Link>
                  <span className="flex items-center gap-1 text-[#16834b] font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    Genuine OEM Certified
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

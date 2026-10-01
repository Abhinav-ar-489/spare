"use client";

import * as React from "react";
import Image from "next/image";
import { ShieldCheck, Check } from "lucide-react";
import { ProductImage } from "@/types";
import { cn } from "@/lib/utils/cn";

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const displayImages =
    images && images.length > 0
      ? images
      : [
          {
            id: "fallback-1",
            url: "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?w=800&auto=format&fit=crop&q=80",
            alt: productName,
            display_order: 1,
            is_primary: true,
          },
        ];

  const currentImage = displayImages[selectedIndex] || displayImages[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Stage */}
      <div className="relative aspect-4/3 sm:aspect-16/11 w-full overflow-hidden rounded-2xl border border-[rgba(17,20,18,0.08)] bg-[#f7f8f7] shadow-sm">
        <Image
          src={currentImage.url}
          alt={currentImage.alt || productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center transition-all duration-300 hover:scale-105"
        />

        {/* Verified OEM Stamp */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-[rgba(17,20,18,0.08)] shadow-sm">
          <ShieldCheck className="w-4 h-4 text-[#16834b]" />
          <span className="text-xs font-semibold text-[#111412] tracking-tight">
            Certified Genuine OEM
          </span>
        </div>

        {/* Image index counter */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-mono">
            {selectedIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {displayImages.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={cn(
                  "relative h-18 w-22 sm:h-20 sm:w-24 shrink-0 overflow-hidden rounded-xl border-2 bg-[#f7f8f7] transition-all",
                  isSelected
                    ? "border-[#16834b] ring-2 ring-[#16834b]/20 scale-102"
                    : "border-[rgba(17,20,18,0.08)] hover:border-[rgba(17,20,18,0.2)] opacity-70 hover:opacity-100"
                )}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `${productName} thumbnail ${idx + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#16834b] text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

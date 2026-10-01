import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "../products/product-card";
import { Button } from "../ui/button";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-16 sm:py-20 bg-[#f7f8f7]/70 border-y border-[rgba(17,20,18,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#16834b] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Certified Components</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111412]">
              Featured Genuine Automotive Spares
            </h2>
            <p className="text-sm text-[#68706b] mt-1 max-w-xl">
              Handpicked OEM replacement parts verified for durability, fitment precision, and manufacturer warranty.
            </p>
          </div>

          <Link href="/parts?isFeatured=true">
            <Button variant="outline" size="sm" className="font-semibold gap-1.5">
              <span>View All Featured</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* 4-column responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

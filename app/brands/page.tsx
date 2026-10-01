import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Award, ShieldCheck } from "lucide-react";
import { brandService } from "@/services";

export const metadata: Metadata = {
  title: "OEM Manufacturer Brands Portfolio | ApexAuto Genuine Spares",
  description:
    "Official partner brands: Bosch, Brembo, Denso, Valeo, SKF, NGK, Mann-Filter, and Bilstein. Certified Tier-1 automotive engineering.",
};

export default async function BrandsPage() {
  const brands = await brandService.getBrands();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="max-w-2xl mb-10 sm:mb-14">
        <span className="text-xs font-bold uppercase tracking-wider text-[#16834b]">
          Tier-1 OEM Suppliers
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111412] mt-1">
          Precision Engineering Brands
        </h1>
        <p className="text-sm text-[#68706b] mt-2">
          We stock exclusively certified original equipment manufacturers trusted by global automakers and championship motorsport teams.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {brands.map((b) => (
          <Link
            key={b.id}
            href={`/brands/${b.slug}`}
            className="group relative flex flex-col justify-between rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white p-6 transition-all duration-300 hover:border-[#16834b]/30 hover:shadow-[0_12px_32px_-6px_rgba(17,20,18,0.06)]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-extrabold tracking-tight text-[#111412] group-hover:text-[#16834b] transition-colors">
                  {b.name}
                </span>
                <span className="text-[11px] font-semibold text-[#68706b] bg-[#f7f8f7] px-2.5 py-1 rounded-md">
                  {b.parts_count || 20}+ Spares
                </span>
              </div>

              <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl bg-[#f7f8f7] mb-4 border border-[rgba(17,20,18,0.04)]">
                <Image
                  src={b.logo_url}
                  alt={b.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <p className="text-xs text-[#68706b] leading-relaxed line-clamp-3">
                {b.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-[rgba(17,20,18,0.06)] flex items-center justify-between text-xs font-semibold text-[#16834b]">
              <span>View {b.name} Catalog</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

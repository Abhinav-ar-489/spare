import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Layers } from "lucide-react";
import { categoryService } from "@/services";

export const metadata: Metadata = {
  title: "Automotive Systems & Categories | ApexAuto Genuine Spares",
  description:
    "Browse replacement parts across primary vehicle systems: brake systems, engine components, suspension and steering, electrical, filtration, and drivetrain.",
};

export default async function CategoriesPage() {
  const categories = await categoryService.getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="max-w-2xl mb-10 sm:mb-14">
        <span className="text-xs font-bold uppercase tracking-wider text-[#16834b]">
          Component Systems
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111412] mt-1">
          Vehicle Categories & Assemblies
        </h1>
        <p className="text-sm text-[#68706b] mt-2">
          Select a system to explore OEM components engineered to exact manufacturer tolerances.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group relative flex flex-col rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white p-5 transition-all duration-300 hover:border-[#16834b]/30 hover:shadow-[0_12px_32px_-6px_rgba(17,20,18,0.06)]"
          >
            <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-[#f7f8f7] mb-4 border border-[rgba(17,20,18,0.04)]">
              <Image
                src={cat.image_url}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-2.5 right-2.5">
                <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/90 backdrop-blur-md text-[#111412] shadow-sm">
                  {cat.parts_count || 0} Parts
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#111412] group-hover:text-[#16834b] transition-colors flex items-center justify-between">
                  <span>{cat.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#68706b]/40 group-hover:text-[#16834b] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h3>
                <p className="text-xs text-[#68706b] mt-1.5 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[rgba(17,20,18,0.06)] flex items-center text-xs font-semibold text-[#16834b]">
                <span>Browse {cat.name} Parts →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

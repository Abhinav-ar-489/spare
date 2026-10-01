import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Disc, Cpu, Activity, Zap, Filter, Cog, ThermometerSnowflake, Sun } from "lucide-react";
import { Category } from "@/types";

interface CategoryGridProps {
  categories: Category[];
}

const iconMap: Record<string, React.ReactNode> = {
  Disc: <Disc className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Filter: <Filter className="w-5 h-5" />,
  Cog: <Cog className="w-5 h-5" />,
  ThermometerSnowflake: <ThermometerSnowflake className="w-5 h-5" />,
  Sun: <Sun className="w-5 h-5" />,
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#16834b]">
              Component Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111412] mt-1">
              Explore by Major Vehicle Systems
            </h2>
            <p className="text-sm text-[#68706b] mt-1 max-w-xl">
              Precision mechanical, electrical, and thermal assemblies built to factory OEM tolerances.
            </p>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16834b] hover:text-[#0d6338] transition-colors"
          >
            <span>View All Categories</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => {
            const iconComponent = iconMap[cat.icon] || <Disc className="w-5 h-5" />;
            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white p-5 transition-all duration-300 hover:border-[#16834b]/30 hover:shadow-[0_12px_32px_-6px_rgba(17,20,18,0.06)]"
              >
                <div>
                  {/* Top Bar with Icon & Parts Count */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#f7f8f7] group-hover:bg-[#e8f5ee] text-[#111412] group-hover:text-[#16834b] flex items-center justify-center transition-colors">
                      {iconComponent}
                    </div>
                    <span className="text-[11px] font-semibold text-[#68706b] bg-[#f7f8f7] px-2.5 py-1 rounded-md">
                      {cat.parts_count || 30}+ Spares
                    </span>
                  </div>

                  {/* Thumbnail Banner */}
                  <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl bg-[#f7f8f7] mb-3.5 border border-[rgba(17,20,18,0.04)]">
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <h3 className="text-base font-semibold text-[#111412] tracking-tight group-hover:text-[#16834b] transition-colors mb-1.5 flex items-center justify-between">
                    <span>{cat.name}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#68706b]/40 group-hover:text-[#16834b] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>

                  <p className="text-xs text-[#68706b] line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

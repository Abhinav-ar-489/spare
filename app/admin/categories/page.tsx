import { categoryService } from "@/services";
import Link from "next/link";
import Image from "next/image";
import { FolderTree, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const categories = await categoryService.getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111412]">
            Major Vehicle Systems & Categories
          </h1>
          <p className="text-xs sm:text-sm text-[#68706b] mt-0.5">
            Organize catalog products into mechanical and electrical assemblies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-5 rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-[#111412]">
                  {cat.name}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#e8f5ee] text-[#0d6338]">
                  {cat.parts_count || 0} Products
                </span>
              </div>

              <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-[#f7f8f7] mb-3 border border-[rgba(17,20,18,0.04)]">
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              </div>

              <p className="text-xs text-[#68706b] leading-relaxed line-clamp-2">
                {cat.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[rgba(17,20,18,0.06)] flex items-center justify-between text-xs">
              <span className="text-[#68706b] font-mono text-[11px]">
                Slug: /{cat.slug}
              </span>
              <Link
                href={`/categories/${cat.slug}`}
                target="_blank"
                className="font-semibold text-[#16834b] hover:underline flex items-center gap-1"
              >
                <span>View Store</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

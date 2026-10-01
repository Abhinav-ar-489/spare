import { Suspense } from "react";
import type { Metadata } from "next";
import { productService } from "@/services/product-service";
import { categoryService, brandService, vehicleService } from "@/services";
import { PartsCatalogClient } from "@/components/products/parts-catalog-client";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Automotive Spare Parts Catalog | Certified OEM Spares",
  description:
    "Explore our complete inventory of genuine automotive spare parts. Precision brake pads, rotors, shock absorbers, filtration units, clutches, and electrical components.",
};

export default async function PartsPage() {
  const [productsData, categories, brands, makes, models, variants] =
    await Promise.all([
      productService.getProducts({ limit: 100 }),
      categoryService.getCategories(),
      brandService.getBrands(),
      vehicleService.getMakes(),
      vehicleService.getModels(),
      vehicleService.getVariants(),
    ]);

  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-96" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-4/3 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <PartsCatalogClient
        initialProducts={productsData.products}
        categories={categories}
        brands={brands}
        makes={makes}
        models={models}
        variants={variants}
      />
    </Suspense>
  );
}

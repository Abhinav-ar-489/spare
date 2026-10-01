import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { brandService, categoryService, vehicleService } from "@/services";
import { productService } from "@/services/product-service";
import { PartsCatalogClient } from "@/components/products/parts-catalog-client";

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await brandService.getBrandBySlug(slug);

  if (!brand) return { title: "Brand Not Found" };

  return {
    title: `${brand.name} Genuine Automotive Replacement Spares | ApexAuto`,
    description: brand.description,
  };
}

export default async function BrandDetailPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = await brandService.getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const [productsData, categories, brands, makes, models, variants] =
    await Promise.all([
      productService.getProducts({ brandId: brand.id, limit: 100 }),
      categoryService.getCategories(),
      brandService.getBrands(),
      vehicleService.getMakes(),
      vehicleService.getModels(),
      vehicleService.getVariants(),
    ]);

  return (
    <div>
      <div className="bg-[#f7f8f7] border-b border-[rgba(17,20,18,0.06)] py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/brands"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#68706b] hover:text-[#111412] mb-3 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All OEM Brands</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111412]">
            {brand.name} Genuine Spares
          </h1>
          <p className="text-sm text-[#68706b] mt-1 max-w-2xl">
            {brand.description}
          </p>
        </div>
      </div>

      <PartsCatalogClient
        initialProducts={productsData.products}
        categories={categories}
        brands={brands}
        makes={makes}
        models={models}
        variants={variants}
      />
    </div>
  );
}

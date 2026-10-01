import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productService } from "@/services/product-service";
import { ProductDetailClient } from "@/components/products/product-detail-client";
import { siteConfig } from "@/lib/config/site";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await productService.getProductBySlug(slug);

  if (!product) {
    return {
      title: "Part Not Found",
    };
  }

  const primaryImage =
    product.images?.find((img) => img.is_primary)?.url ||
    product.images?.[0]?.url;

  return {
    title: `${product.name} (Part #${product.part_number}) | ${product.brand?.name || "Genuine OEM"}`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | ${product.brand?.name || "OEM Spares"}`,
      description: product.description.slice(0, 160),
      images: primaryImage ? [{ url: primaryImage }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await productService.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await productService.getRelatedProducts(
    product.id,
    product.category_id,
    4
  );

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images?.map((img) => img.url),
    description: product.description,
    mpn: product.part_number,
    sku: product.part_number,
    brand: {
      "@type": "Brand",
      name: product.brand?.name || "OEM",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency || "INR",
      price: product.discount_price || product.price || 0,
      availability:
        product.is_available && product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
      seller: {
        "@type": "Organization",
        name: siteConfig.business_name,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
      />
    </>
  );
}

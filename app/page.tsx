import { productService } from "@/services/product-service";
import { categoryService, vehicleService } from "@/services";
import { HeroSection } from "@/components/home/hero-section";
import { SearchBarHero } from "@/components/home/search-bar-hero";
import { VehicleSelector } from "@/components/products/vehicle-selector";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { WhatsAppBanner } from "@/components/home/whatsapp-banner";
import { PaymentComingSoon } from "@/components/home/payment-coming-soon";

export const revalidate = 60; // ISR revalidation

export default async function HomePage() {
  const [featuredProducts, categories, makes, models, variants] = await Promise.all([
    productService.getFeaturedProducts(8),
    categoryService.getCategories(),
    vehicleService.getMakes(),
    vehicleService.getModels(),
    vehicleService.getVariants(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Prominent Automotive Search Bar */}
      <SearchBarHero />

      {/* Dedicated Interactive Vehicle Selector */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <VehicleSelector
            makes={makes}
            models={models}
            variants={variants}
          />
        </div>
      </section>

      {/* Categories Grid */}
      <CategoryGrid categories={categories} />

      {/* Featured Spares Showcase */}
      <FeaturedProducts products={featuredProducts} />

      {/* Trust & Engineering Pillars */}
      <WhyChooseUs />

      {/* Dedicated WhatsApp Specialist Banner */}
      <WhatsAppBanner />

      {/* Restrained Payment Roadmap Notice */}
      <PaymentComingSoon />
    </div>
  );
}

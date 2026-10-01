import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Wrench, Award, CheckCircle2, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us | Precision Automotive Parts Sourcing",
  description:
    "ApexAuto Genuine Spares is an authorized automotive parts distributor dedicated to supplying certified Tier-1 OEM replacement components with guaranteed vehicle fitment.",
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {/* Hero */}
      <div className="max-w-3xl mb-12 sm:mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-[#16834b]">
          Engineered for Reliability
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111412] mt-1.5 leading-tight">
          Delivering genuine OEM automotive components with guaranteed precision fitment.
        </h1>
        <p className="text-base sm:text-lg text-[#68706b] mt-4 leading-relaxed">
          Founded by automotive engineers and logistics specialists, ApexAuto eliminates counterfeit parts risks through direct manufacturer supply chains and assisted VIN compatibility verification.
        </p>
      </div>

      {/* Feature showcase image */}
      <div className="relative aspect-16/9 sm:aspect-21/9 w-full overflow-hidden rounded-3xl border border-[rgba(17,20,18,0.08)] bg-[#f7f8f7] mb-16 shadow-sm">
        <Image
          src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1600&auto=format&fit=crop&q=85"
          alt="Automotive precision engineering facility"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 text-white">
          <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#16834b]">
            Our Distribution Core
          </p>
          <p className="text-lg sm:text-2xl font-bold mt-1 max-w-xl">
            Clean, climate-controlled warehousing with barcode-verified inventory tracking.
          </p>
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-[rgba(17,20,18,0.08)]">
        <div className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center text-[#16834b]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#111412]">
            Zero-Counterfeit Guarantee
          </h3>
          <p className="text-xs sm:text-sm text-[#68706b] leading-relaxed">
            All inventory arrives sealed in factory packaging with intact holographic seals and serial tracking numbers directly from authorized manufacturer depots.
          </p>
        </div>

        <div className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center text-[#16834b]">
            <Wrench className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#111412]">
            Technician-Assisted Support
          </h3>
          <p className="text-xs sm:text-sm text-[#68706b] leading-relaxed">
            Avoid ordering incorrect part variants. Our WhatsApp team verifies your vehicle registration, chassis number, and model trim before dispatch.
          </p>
        </div>

        <div className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center text-[#16834b]">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#111412]">
            Comprehensive Workshop Supply
          </h3>
          <p className="text-xs sm:text-sm text-[#68706b] leading-relaxed">
            We partner with independent multi-brand workshops, fleet operators, and enthusiast car owners providing consistent wholesale rates and priority dispatch.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="mt-16 rounded-3xl bg-[#f7f8f7] p-8 sm:p-12 border border-[rgba(17,20,18,0.06)] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#111412]">
            Have an enquiry or need bulk workshop sourcing?
          </h3>
          <p className="text-sm text-[#68706b] mt-1">
            Connect with our wholesale desk for scheduled fleet shipments and technician accounts.
          </p>
        </div>

        <Link
          href={`https://wa.me/${siteConfig.whatsapp_number.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="primary" size="lg" className="font-semibold gap-2">
            <span>Talk to Parts Desk</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

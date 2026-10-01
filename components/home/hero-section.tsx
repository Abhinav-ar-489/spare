import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, CheckCircle2, MessageSquare, Wrench } from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import { Button } from "../ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-16 sm:pt-14 sm:pb-24 lg:pt-18 lg:pb-28">
      {/* Subtle ambient lighting gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#e8f5ee]/40 via-[#f7f8f7]/30 to-transparent -z-10 pointer-events-none" />
      <div className="absolute top-12 right-10 w-96 h-96 rounded-full bg-[#16834b]/5 blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Top pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f2f4f2] border border-[rgba(17,20,18,0.08)] text-xs font-semibold text-[#111412]">
              <span className="flex h-2 w-2 rounded-full bg-[#16834b]" />
              <span>Direct OEM Sourcing & Precision Fitment</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111412] leading-[1.12]">
              Parts that keep your{" "}
              <span className="text-[#16834b]">drive moving.</span>
            </h1>

            {/* Supporting description */}
            <p className="text-base sm:text-lg text-[#68706b] leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Find reliable, certified automotive spare parts for the vehicles you trust. Engineered precision from Tier-1 manufacturers—Bosch, Brembo, Denso, Valeo, and SKF.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <Link href="/parts" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto px-8 text-sm sm:text-base font-semibold">
                  <span>Browse Parts</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link
                href={`https://wa.me/${siteConfig.whatsapp_number.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 text-sm sm:text-base font-semibold">
                  <MessageSquare className="w-4 h-4 text-[#16834b]" />
                  <span>Talk to Us</span>
                </Button>
              </Link>
            </div>

            {/* Trust bullet row */}
            <div className="pt-4 border-t border-[rgba(17,20,18,0.06)] flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-[#68706b]">
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16834b]" />
                <span>100% Genuine Certified</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16834b]" />
                <span>Assisted VIN Verification</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16834b]" />
                <span>Nationwide Dispatch</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Graphic / Vehicle Component Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main vehicle & component visual frame */}
              <div className="relative aspect-4/3 sm:aspect-16/11 w-full overflow-hidden rounded-3xl border border-[rgba(17,20,18,0.1)] bg-[#f7f8f7] shadow-[0_20px_50px_-12px_rgba(17,20,18,0.12)]">
                <Image
                  src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1000&auto=format&fit=crop&q=85"
                  alt="High-performance automotive brake and rotor assembly"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover object-center"
                />

                {/* Subtle vignette layer */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl glass-card border border-white/95 shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#16834b]">
                      Featured High-Performance
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-[#111412] leading-tight">
                      Brembo UV-Coated Rotors & Ceramic Pads
                    </p>
                    <p className="text-[11px] text-[#68706b]">Toyota • Land Cruiser LC300 & Prado</p>
                  </div>
                  <div className="shrink-0 pl-3">
                    <span className="text-xs font-semibold px-2 py-1 rounded glass-pill text-[#0d6338]">
                      OEM Spec
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating micro-badge 1 */}
              <div className="hidden sm:flex absolute -top-4 -left-4 items-center gap-2 p-3 rounded-2xl glass-card border border-white/95 shadow-xl animate-in fade-in duration-500">
                <div className="w-8 h-8 rounded-xl bg-[#e8f5ee] flex items-center justify-center text-[#16834b]">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#111412]">OEM Fitment</p>
                  <p className="text-[10px] text-[#68706b]">Zero modifications required</p>
                </div>
              </div>

              {/* Floating micro-badge 2 */}
              <div className="hidden sm:flex absolute -bottom-5 -right-4 items-center gap-2 p-3 rounded-2xl glass-card border border-white/95 shadow-xl">
                <div className="w-8 h-8 rounded-xl bg-[#111412] flex items-center justify-center text-white">
                  <ShieldCheck className="w-4 h-4 text-[#16834b]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#111412]">Verified Genuine</p>
                  <p className="text-[10px] text-[#68706b]">Manufacturer QR authenticated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

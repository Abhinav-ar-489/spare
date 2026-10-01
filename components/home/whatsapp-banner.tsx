import Link from "next/link";
import { MessageSquare, PhoneCall, ArrowRight, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import { Button } from "../ui/button";

export function WhatsAppBanner() {
  return (
    <section className="py-12 sm:py-16 bg-[#111412] text-white relative overflow-hidden">
      {/* Subtle green ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#16834b]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 p-8 sm:p-10 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16834b]/20 text-[#16834b] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#16834b] animate-ping" />
              <span>Dedicated Technical Desk Active</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Need help finding the right part?
            </h2>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              Send us your vehicle photo, VIN, or part number. Our OEM certified technicians will locate the exact replacement and confirm availability within minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href={`https://wa.me/${siteConfig.whatsapp_number.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                variant="primary"
                size="lg"
                className="w-full bg-[#16834b] hover:bg-[#0d6338] text-white px-8 font-semibold shadow-lg shadow-[#16834b]/20"
              >
                <MessageSquare className="w-5 h-5 fill-current" />
                <span>Chat on WhatsApp</span>
              </Button>
            </Link>

            <Link href="/contact" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full bg-white/5 border-white/15 text-white hover:bg-white/10 hover:text-white"
              >
                <span>Direct Contact</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

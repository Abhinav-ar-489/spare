import Link from "next/link";
import {
  Layers,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
} from "lucide-react";
import { siteConfig } from "@/lib/config/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#f7f8f7] border-t border-[rgba(17,20,18,0.08)] mt-auto">
      {/* Trust Badges Bar */}
      <div className="border-b border-[rgba(17,20,18,0.06)] bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center text-[#16834b] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[#111412]">
                  100% Genuine Parts
                </p>
                <p className="text-[11px] sm:text-xs text-[#68706b]">
                  Direct Tier-1 OEM sourcing
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center text-[#16834b] shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[#111412]">
                  Express Logistics
                </p>
                <p className="text-[11px] sm:text-xs text-[#68706b]">
                  Next-day express dispatch
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center text-[#16834b] shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[#111412]">
                  Fitment Guaranteed
                </p>
                <p className="text-[11px] sm:text-xs text-[#68706b]">
                  Assisted VIN compatibility check
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center text-[#16834b] shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[#111412]">
                  Technical Desk
                </p>
                <p className="text-[11px] sm:text-xs text-[#68706b]">
                  WhatsApp engineer support
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#111412] flex items-center justify-center text-white">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[#111412]">
                ApexAuto Genuine Spares
              </span>
            </Link>
            <p className="text-sm text-[#68706b] leading-relaxed max-w-sm">
              Supplying certified OEM automotive replacement components for passenger cars, SUVs, and luxury sedans. Verified part compatibility and transparent pricing.
            </p>
            <div className="pt-2 flex flex-col space-y-2 text-xs text-[#68706b]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#16834b] shrink-0" />
                <span>{siteConfig.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#16834b] shrink-0" />
                <span>{siteConfig.business_hours}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#111412]">
              Catalog
            </p>
            <ul className="space-y-2 text-sm text-[#68706b]">
              <li>
                <Link href="/parts" className="hover:text-[#16834b] transition-colors">
                  All Replacement Parts
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-[#16834b] transition-colors">
                  Browse by Category
                </Link>
              </li>
              <li>
                <Link href="/brands" className="hover:text-[#16834b] transition-colors">
                  OEM Brands Portfolio
                </Link>
              </li>
              <li>
                <Link href="/parts?isFeatured=true" className="hover:text-[#16834b] transition-colors">
                  Featured Spares
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#111412]">
              Major Systems
            </p>
            <ul className="space-y-2 text-sm text-[#68706b]">
              <li>
                <Link href="/categories/brake-system" className="hover:text-[#16834b] transition-colors">
                  Brake Pads & Rotors
                </Link>
              </li>
              <li>
                <Link href="/categories/engine-parts" className="hover:text-[#16834b] transition-colors">
                  Engine & Powertrain
                </Link>
              </li>
              <li>
                <Link href="/categories/suspension-steering" className="hover:text-[#16834b] transition-colors">
                  Suspension & Shocks
                </Link>
              </li>
              <li>
                <Link href="/categories/electrical-ignition" className="hover:text-[#16834b] transition-colors">
                  Electrical & Spark Plugs
                </Link>
              </li>
              <li>
                <Link href="/categories/filters-fluids" className="hover:text-[#16834b] transition-colors">
                  Filters & Elements
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Support */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#111412]">
              Assistance & Helpdesk
            </p>
            <div className="space-y-2.5 text-sm text-[#68706b]">
              <a
                href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}
                className="flex items-center gap-2 hover:text-[#16834b] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#16834b]" />
                <span>{siteConfig.phone}</span>
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2 hover:text-[#16834b] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#16834b]" />
                <span>{siteConfig.email}</span>
              </a>
              <a
                href={`https://wa.me/${siteConfig.whatsapp_number.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#e8f5ee] text-[#0d6338] text-xs font-medium hover:bg-[#16834b] hover:text-white transition-all mt-2"
              >
                <span>Direct WhatsApp Enquiry</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[rgba(17,20,18,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#68706b]">
          <p>
            © {currentYear} {siteConfig.business_name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-[#111412] transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-[#111412] transition-colors">
              Contact & Location
            </Link>
            <Link href="/login" className="hover:text-[#16834b] transition-colors font-medium">
              Portal Sign In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

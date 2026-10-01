import { CreditCard, ShieldCheck, Zap } from "lucide-react";
import { paymentConfig } from "@/lib/config/site";
import { Badge } from "../ui/badge";

export function PaymentComingSoon() {
  return (
    <section className="py-10 bg-white border-t border-[rgba(17,20,18,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl glass-card border border-white/80 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-white border border-white/80 flex items-center justify-center text-[#16834b] shrink-0 shadow-2xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-sm font-bold text-[#111412]">
                  {paymentConfig.status_title}
                </span>
                <Badge variant="success" size="sm">
                  {paymentConfig.status_badge}
                </Badge>
              </div>
              <p className="text-xs text-[#68706b] mt-0.5 max-w-xl">
                Full online checkout active! Credit/Debit card, Bank Wire Transfer, Cash On Delivery (COD), and instant WhatsApp order placement available.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#68706b] shrink-0 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16834b]" />
              5% VAT Invoiced (FTA Compliant)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#16834b]" />
              Same-day Logistics
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

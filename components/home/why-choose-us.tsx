import { ShieldCheck, Truck, Headphones, BadgeCheck } from "lucide-react";

export function WhyChooseUs() {
  const points = [
    {
      icon: <BadgeCheck className="w-5 h-5 text-[#16834b]" />,
      title: "100% Genuine Certified",
      description:
        "Every component is sourced exclusively through authorized Tier-1 manufacturer channels, backed by verifiable QR authenticity seals.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#16834b]" />,
      title: "Guaranteed Vehicle Fitment",
      description:
        "Our specialized parts desk cross-references your vehicle VIN and chassis number to ensure zero returns and flawless bolt-on fitment.",
    },
    {
      icon: <Headphones className="w-5 h-5 text-[#16834b]" />,
      title: "Direct Technical Assistance",
      description:
        "Speak directly with knowledgeable automotive technicians on WhatsApp who comprehend part numbers, torque specs, and supersede codes.",
    },
    {
      icon: <Truck className="w-5 h-5 text-[#16834b]" />,
      title: "Express Dispatch & Logistics",
      description:
        "High-density inventory in our Dubai distribution hub enables same-day dispatch and express verified courier delivery.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#16834b]">
            The ApexAuto Standard
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111412] mt-1">
            Built for Mechanics, Enthusiasts, and Vehicle Owners
          </h2>
          <p className="text-sm text-[#68706b] mt-2">
            Automotive maintenance demands zero compromises on quality, safety, and operational tolerances.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {points.map((pt, i) => (
            <div
              key={i}
              className="flex flex-col p-6 rounded-3xl glass-card border border-white/80 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-white/80 flex items-center justify-center mb-4 shadow-2xs">
                {pt.icon}
              </div>
              <h3 className="text-base font-semibold text-[#111412] tracking-tight mb-2">
                {pt.title}
              </h3>
              <p className="text-xs text-[#68706b] leading-relaxed">
                {pt.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { SiteSettings } from "@/types";

export const siteConfig: SiteSettings = {
  business_name: "ApexAuto Genuine Spares",
  business_tagline: "Precision Engineering & OEM Replacement Parts",
  headline: "Parts that keep your drive moving.",
  hero_description:
    "Source genuine, certified automotive spare parts for Land Cruiser, Patrol, Prado, luxury SUVs, and fleet vehicles. Direct OEM sourcing, rapid WhatsApp technical desk, and express dispatch across the Emirates and regional hubs.",
  phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || "+971 7736523385",
  whatsapp_number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "7736523385",
  email: process.env.NEXT_PUBLIC_SITE_EMAIL || "support@apexautospares.com",
  address: "Warehouse 14, Al Quoz Industrial Area 3, Dubai, United Arab Emirates",
  business_hours: "Mon - Sat: 8:00 AM - 7:00 PM (Gulf Standard Time)",
  announcement: "Direct OEM Sourcing • 100% Genuine Certified Spares • Express Logistics & Delivery",
  default_currency: "AED",
  social_links: {
    instagram: "https://instagram.com/apexautospares",
    facebook: "https://facebook.com/apexautospares",
    twitter: "https://twitter.com/apexautospares",
    linkedin: "https://linkedin.com/company/apexautospares",
  },
};

export const paymentConfig = {
  payment_enabled: true,
  status_title: "Online Checkout & Invoicing",
  status_badge: "Active",
  status_description:
    "Direct online cart checkout with Credit Card (Visa/Mastercard), Cash on Delivery (COD), Bank Wire Transfer, or Assisted WhatsApp Invoicing.",
};

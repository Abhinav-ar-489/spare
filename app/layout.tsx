import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.business_name} | Genuine Automotive Spare Parts`,
    template: `%s | ${siteConfig.business_name}`,
  },
  description: siteConfig.hero_description,
  keywords: [
    "automotive spare parts",
    "genuine car parts",
    "OEM car parts",
    "Land Cruiser spare parts",
    "Patrol Y62 spare parts",
    "Prado spare parts",
    "Bosch brake pads",
    "Brembo rotors",
    "Denso AC compressor",
    "online auto parts",
  ],
  authors: [{ name: siteConfig.business_name }],
  creator: siteConfig.business_name,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://apexautospares.com"),
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: "/",
    title: `${siteConfig.business_name} | Genuine Automotive Spare Parts`,
    description: siteConfig.hero_description,
    siteName: siteConfig.business_name,
    images: [
      {
        url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: `${siteConfig.business_name} certified OEM spares`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.business_name} | Certified Automotive Spares`,
    description: siteConfig.hero_description,
    creator: "@apexautospares",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#fafbfa] text-[#111412] antialiased selection:bg-[#16834b]/15 selection:text-[#0d6338] relative overflow-x-hidden">
        {/* Ambient atmospheric backdrop highlights & optic light diffusers for evident glassmorphism */}
        <div className="fixed inset-0 pointer-events-none -z-20 bg-[radial-gradient(#111412_0.75px,transparent_0.75px)] [background-size:28px_28px] opacity-[0.035]" />
        <div className="fixed -top-24 left-1/4 w-[650px] h-[650px] bg-gradient-to-br from-[#16834b]/16 via-[#0d6338]/10 to-transparent rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="fixed top-1/3 -right-24 w-[600px] h-[600px] bg-gradient-to-bl from-[#0284c7]/12 via-[#16834b]/10 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="fixed top-2/3 -left-32 w-[650px] h-[650px] bg-gradient-to-tr from-[#16834b]/14 via-[#059669]/8 to-transparent rounded-full blur-[110px] pointer-events-none -z-10" />
        <div className="fixed -bottom-24 right-1/4 w-[550px] h-[550px] bg-gradient-to-t from-[#16834b]/12 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />

        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

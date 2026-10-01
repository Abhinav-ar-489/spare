# ApexAuto — Premium Automotive Spare Parts Platform

A production-ready automotive spare parts e-commerce and workshop procurement platform. Engineered with an Apple-style aesthetic: clean, technical, approachable, fast, and trustworthy.

Predominantly white with refined neutral layered surfaces, restrained translucent glassmorphism, and precision green accents (`#16834b`).

---

## Key Features

- **Automotive Fitment Search Engine**: Live querying across part numbers, OEM cross-reference codes, manufacturer brands, and vehicle models.
- **Interactive Vehicle Selector**: 4-tier fitment verification (*Make → Model → Year → Engine/Trim*) with instant part filtering.
- **Assisted WhatsApp Quotation Desk**: Seamless pre-formatted click-to-chat links containing part title, SKU, OEM code, and customer vehicle specification.
- **Lead Capture & Inquiries**: Database-backed enquiry logging with quick WhatsApp redirection and real-time status telemetry (*New Lead → Contacted → Resolved*).
- **Mobile-First Workshop Admin Portal**: Fully optimized for workshop technicians and managers operating directly on iOS or Android smartphones. Includes mobile camera uploads, stock toggles, and live configuration.
- **Architected Payment Roadmap**: Non-intrusive "Online ordering coming soon" integration, decoupling product management from payment providers (Razorpay / Stripe ready).
- **Zero-Dependency Fallback Store**: Works seamlessly out of the box with embedded high-resolution seed data and switches automatically to Supabase PostgreSQL when credentials are supplied.
- **Comprehensive SEO**: Dynamic sitemaps, semantic tags, OpenGraph previews, and Google Product JSON-LD schema.

---

## Technology Stack

- **Framework**: Next.js App Router (Turbopack, TypeScript)
- **Styling**: Tailwind CSS + CSS Variables (`#FFFFFF`, `#F7F8F7`, `#16834b`, `#0d6338`, `#e8f5ee`)
- **Icons**: Lucide React
- **Validation**: Zod + React Hook Form
- **Database / Auth**: Supabase PostgreSQL, Row Level Security, Auth
- **Deployment**: Vercel ready

---

## Project Structure

```
├── app/
│   ├── (public)/
│   │   ├── page.tsx               # Homepage (Hero, Search, Vehicle Selector, Categories, Featured)
│   │   ├── parts/                 # Parts Catalog (Filtering, search, sorting)
│   │   │   └── [slug]/            # Product detail with gallery, specs & compatibility
│   │   ├── categories/            # System categories
│   │   ├── brands/                # OEM brands portfolio
│   │   ├── about/                 # Company mission & authenticity guarantee
│   │   └── contact/               # Contact details & enquiry form
│   ├── admin/
│   │   ├── login/                 # Supabase / admin authentication
│   │   ├── page.tsx               # Operational metrics & recent leads
│   │   ├── products/              # Inventory management (table & mobile cards)
│   │   │   ├── new/               # Mobile photo upload, specs & vehicle matrix
│   │   │   └── [id]/              # SKU editor
│   │   ├── enquiries/             # Customer quote requests & 1-tap WhatsApp reply
│   │   ├── categories/            # System categories directory
│   │   ├── brands/                # OEM partner brands
│   │   ├── vehicles/              # Makes, models, and variants directory
│   │   └── settings/              # Business info & WhatsApp desk settings
│   ├── api/                       # REST endpoints (products, enquiries, settings, vehicles)
│   ├── sitemap.ts                 # Dynamic XML sitemap
│   └── robots.ts                  # Search engine robots.txt
├── components/
│   ├── ui/                        # Button, Badge, Input, Card, Modal, Skeleton
│   ├── layout/                    # Translucent Navbar, Footer, Mobile Drawer
│   ├── products/                  # ProductCard, VehicleSelector, ImageGallery, WhatsAppButton, EnquiryModal
│   ├── home/                      # HeroSection, SearchBarHero, CategoryGrid, FeaturedProducts, WhyChooseUs
│   └── admin/                     # AdminNav, AdminBottomBar, DashboardView, ProductForm, EnquiriesView
├── lib/
│   ├── supabase/                  # Browser & Server Supabase SSR clients
│   ├── config/                    # Centralized site & WhatsApp configuration
│   ├── data/                      # Initial seed dataset & in-memory/localStorage store
│   ├── validations/               # Zod validation schemas
│   └── utils/                     # Formatters, cn helper, WhatsApp message generator
├── supabase/
│   └── migrations/                # PostgreSQL schema (RLS, indexes) & seed SQL
└── types/                         # TypeScript interfaces
```

---

## Getting Started Locally

### 1. Prerequisites
- Node.js 18.17+ or Node.js 20+
- npm or pnpm

### 2. Installation
```bash
git clone <repository-url>
cd spare
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your parameters:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
NEXT_PUBLIC_PHONE_NUMBER="+91 98765 43210"
NEXT_PUBLIC_SITE_EMAIL=support@apexautospares.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
*(Note: If Supabase credentials are not provided initially, the platform runs seamlessly on its built-in in-memory fallback dataset so you can immediately preview and test all features!)*

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Supabase PostgreSQL Setup

1. Create a new project in [Supabase](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Run the schema migration from `supabase/migrations/0001_initial_schema.sql`.
4. Run the seed data script from `supabase/migrations/0002_seed_data.sql`.
5. Copy your **Project URL** and **anon public key** from *Settings → API* into `.env.local`.

---

## Admin Workshop Portal

- **URL**: `/admin`
- **Login URL**: `/admin/login`
- **Evaluation Credentials**:
  - Email: `admin@apexautospares.com`
  - Password: `Admin@12345`

### Mobile Experience
Open `/admin` on an iPhone or Android phone. The interface features a dedicated bottom navigation bar with one-thumb access to:
- Quick photo captures via device camera
- Immediate part number and OEM code entry
- One-tap vehicle compatibility assignment
- Real-time stock status toggle

---

## Vercel Deployment

1. Push your repository to GitHub / GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Set the environment variables from your `.env.local`.
4. Deploy. The platform will build cleanly using Turbopack with zero warnings or errors.

---

## Production Verification Checklist

- [x] Responsive on iPhone (390px), Android (360px), iPad (768px), and Desktop (1440px)
- [x] Zero console warnings and full TypeScript type compliance
- [x] Tested WhatsApp click-to-chat parameter generation
- [x] SEO metadata, JSON-LD Product schema, and dynamic sitemaps verified
- [x] Production build passes via `npm run build`

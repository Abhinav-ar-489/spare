import { AdminNav } from "@/components/admin/admin-nav";
import { AdminBottomBar } from "@/components/admin/admin-bottom-bar";
import Link from "next/link";
import { ArrowUpRight, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Workshop Admin Portal | ApexAuto Genuine Spares",
  description: "Manage spare parts inventory, categories, compatibility, and customer enquiries.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f8f7] flex flex-col">
      {/* Admin Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[rgba(17,20,18,0.08)] px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#16834b] text-white flex items-center justify-center font-bold text-xs">
            A
          </div>
          <span className="text-sm font-bold text-[#111412]">
            ApexAuto Workshop
          </span>
        </Link>
        <Link
          href="/"
          target="_blank"
          className="text-xs font-semibold text-[#16834b] flex items-center gap-1 bg-[#e8f5ee] px-2.5 py-1 rounded-md"
        >
          <span>Store</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </header>

      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar (hidden on mobile) */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-[rgba(17,20,18,0.08)] bg-white sticky top-0 h-screen">
          <AdminNav />
        </aside>

        {/* Admin Content Area (with bottom padding on mobile for the bottom bar) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <AdminBottomBar />
    </div>
  );
}

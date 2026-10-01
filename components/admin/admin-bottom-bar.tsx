"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Plus,
  Package,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function AdminBottomBar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Add", href: "/admin/products/new", icon: Plus, isAdd: true },
    { label: "Parts", href: "/admin/products", icon: Package },
    { label: "Leads", href: "/admin/enquiries", icon: MessageSquare },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[rgba(17,20,18,0.1)] px-3 py-2 safe-area-pb shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          if (item.isAdd) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-6 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#16834b] text-white flex items-center justify-center shadow-lg shadow-[#16834b]/30 group-active:scale-95 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-[#111412] mt-1">
                  Add Part
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors min-w-[54px]",
                isActive
                  ? "text-[#16834b] font-bold"
                  : "text-[#68706b] hover:text-[#111412]"
              )}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

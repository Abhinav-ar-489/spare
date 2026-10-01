"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  Award,
  Car,
  MessageSquare,
  ShoppingBag,
  Settings,
  ArrowUpRight,
  LogOut,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/context/auth-context";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  const links = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Orders & Dispatch", href: "/admin/orders", icon: ShoppingBag, isHighlight: true },
    { label: "Spare Inventory", href: "/admin/products", icon: Package },
    { label: "Add Product", href: "/admin/products/new", icon: PlusCircle },
    { label: "Customer Enquiries", href: "/admin/enquiries", icon: MessageSquare },
    { label: "System Categories", href: "/admin/categories", icon: FolderTree },
    { label: "OEM Brands", href: "/admin/brands", icon: Award },
    { label: "Vehicle Directory", href: "/admin/vehicles", icon: Car },
    { label: "Site Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full justify-between p-4">
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center justify-between px-2">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#16834b] flex items-center justify-center text-white shadow-sm">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#111412] leading-tight block">
                ApexAuto
              </span>
              <span className="text-[10px] text-[#68706b] font-medium leading-none block">
                Workshop Operations
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation items */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150",
                  isActive
                    ? "bg-[#e8f5ee] text-[#0d6338] shadow-2xs font-bold"
                    : "text-[#68706b] hover:text-[#111412] hover:bg-[#f7f8f7]",
                  link.isHighlight && !isActive && "text-[#16834b] bg-[#e8f5ee]/40"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-[#16834b]" : "text-[#68706b]")} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-4 border-t border-[rgba(17,20,18,0.08)] space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#68706b] hover:text-[#111412] hover:bg-[#f7f8f7] transition-colors"
        >
          <span>View Public Store</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

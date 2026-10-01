"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Layers,
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  PhoneCall,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  LogOut,
  Settings,
  Package,
} from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils/cn";
import { Button } from "../ui/button";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, openDrawer } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    router.push("/");
    router.refresh();
  };

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  // Handle sticky translucent header on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { label: "All Parts", href: "/parts" },
    { label: "Categories", href: "/categories" },
    { label: "Brands", href: "/brands" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const cleanPhone = siteConfig.whatsapp_number.replace(/[^0-9]/g, "");
  const waTarget = cleanPhone.length === 10 && !cleanPhone.startsWith("971") ? `971${cleanPhone}` : cleanPhone;

  return (
    <>
      {/* Top micro-announcement bar */}
      <div className="bg-[#111412] text-white py-1.5 px-4 text-xs font-medium tracking-tight">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#16834b] animate-pulse shrink-0" />
            <span className="truncate text-white/90">{siteConfig.announcement}</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-white/70 text-xs shrink-0">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16834b]" />
              5% VAT Invoiced (FTA Compliant)
            </span>
            <span className="text-white/30">•</span>
            <Link
              href={`https://wa.me/${waTarget}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1 text-[#16834b]"
            >
              <PhoneCall className="w-3 h-3" />
              WhatsApp: {siteConfig.whatsapp_number}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Prominent Glass Navigation */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          isScrolled
            ? "glass-nav py-0.5"
            : "bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-2xs"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-none"
              aria-label="ApexAuto Home"
            >
              <div className="w-9 h-9 rounded-xl bg-[#111412] flex items-center justify-center text-white shadow-sm group-hover:bg-[#16834b] transition-colors border border-white/20">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold tracking-tight text-[#111412] leading-tight">
                  ApexAuto
                </span>
                <span className="text-[10px] font-medium tracking-tight text-[#68706b] leading-none">
                  Precision OEM Spares
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150",
                      isActive
                        ? "text-[#16834b] bg-[#e8f5ee]/80 font-semibold border border-[#16834b]/15 shadow-2xs"
                        : "text-[#68706b] hover:text-[#111412] hover:bg-white/80"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions: Search, Cart Icon, User Login / Account, Mobile menu */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/parts"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/80 bg-white/70 backdrop-blur-md hover:bg-white text-xs font-medium text-[#68706b] transition-all hover:border-[rgba(17,20,18,0.16)] shadow-2xs"
              >
                <Search className="w-3.5 h-3.5 text-[#16834b]" />
                <span className="text-[#111412]/80">Part # or Model</span>
              </Link>

              {/* Shopping Cart Drawer Trigger */}
              <button
                type="button"
                onClick={openDrawer}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl border border-white/80 bg-white/80 backdrop-blur-md hover:bg-white text-[#111412] transition-colors shadow-2xs"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 text-[#111412]" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-[#16834b] text-white text-[11px] font-bold shadow-sm animate-in zoom-in-50">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Dynamic User Authentication State / Account Button */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/90 bg-white/80 backdrop-blur-md hover:bg-white text-xs font-bold text-[#111412] transition-all shadow-sm cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-lg bg-[#16834b] text-white flex items-center justify-center text-[11px] font-extrabold uppercase shadow-2xs shrink-0">
                      {user.full_name?.charAt(0) || "U"}
                    </div>
                    <span className="inline-block max-w-[100px] sm:max-w-[130px] truncate text-left text-xs font-bold text-[#111412]">
                      {user.full_name}
                    </span>
                    <ChevronDown className={cn("w-3.5 h-3.5 text-[#68706b] transition-transform duration-200", userDropdownOpen && "rotate-180")} />
                  </button>

                  {/* Glassmorphic User Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white/96 backdrop-blur-2xl border border-white/95 p-2 shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-150 ring-1 ring-black/5">
                      <div className="px-3 py-2 border-b border-[rgba(17,20,18,0.06)] mb-1">
                        <p className="text-xs font-bold text-[#111412] truncate">
                          {user.full_name}
                        </p>
                        <p className="text-[11px] text-[#68706b] truncate">
                          {user.email}
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#e8f5ee] text-[#0d6338]">
                          {user.role === "admin" ? "Workshop Admin" : "Customer"}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        {user.role === "admin" ? (
                          <>
                            <Link
                              href="/admin"
                              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#111412] hover:bg-[#e8f5ee] hover:text-[#0d6338] transition-colors"
                            >
                              <Settings className="w-3.5 h-3.5 text-[#16834b]" />
                              <span>Admin Dashboard</span>
                            </Link>
                            <Link
                              href="/admin/orders"
                              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#111412] hover:bg-[#e8f5ee] hover:text-[#0d6338] transition-colors"
                            >
                              <Package className="w-3.5 h-3.5 text-[#16834b]" />
                              <span>Manage Orders</span>
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              href="/account"
                              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#111412] hover:bg-[#e8f5ee] hover:text-[#0d6338] transition-colors"
                            >
                              <User className="w-3.5 h-3.5 text-[#16834b]" />
                              <span>My Account</span>
                            </Link>
                            <Link
                              href="/cart"
                              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#111412] hover:bg-[#e8f5ee] hover:text-[#0d6338] transition-colors"
                            >
                              <ShoppingBag className="w-3.5 h-3.5 text-[#16834b]" />
                              <span>Shopping Cart</span>
                            </Link>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-600" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-white/80 bg-white/80 backdrop-blur-md text-xs font-semibold text-[#111412] hover:bg-white transition-colors shadow-2xs"
                  title="Sign In"
                >
                  <User className="w-3.5 h-3.5 text-[#16834b]" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {/* Mobile menu trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-[#111412] hover:bg-white/80 focus:outline-none transition-colors border border-white/60"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown sheet */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/80 bg-white/95 backdrop-blur-2xl px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200">
            <div className="mb-4">
              <Link
                href="/parts"
                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl bg-white border border-[rgba(17,20,18,0.08)] text-sm text-[#68706b]"
              >
                <Search className="w-4 h-4 text-[#16834b]" />
                <span>Search by Part #, OEM, or Car...</span>
              </Link>
            </div>

            {user && (
              <div className="mb-3 p-3 rounded-2xl bg-[#e8f5ee]/70 border border-[#16834b]/20 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#111412]">{user.full_name}</p>
                  <p className="text-[11px] text-[#68706b]">{user.email}</p>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            )}

            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-[#e8f5ee] text-[#0d6338] font-semibold"
                      : "text-[#111412] hover:bg-[#f7f8f7]"
                  )}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#68706b]/40" />
                </Link>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-[rgba(17,20,18,0.08)] flex flex-col gap-2.5">
              <Link href="/cart">
                <Button variant="outline" className="w-full justify-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span>View Cart ({totalItems})</span>
                </Button>
              </Link>

              {!user && (
                <Link href="/login">
                  <Button variant="outline" className="w-full justify-center">
                    Sign In
                  </Button>
                </Link>
              )}

              <Link
                href={`https://wa.me/${waTarget}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" className="w-full justify-center">
                  Chat on WhatsApp ({siteConfig.whatsapp_number})
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

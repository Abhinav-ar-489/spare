"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Package,
  LogOut,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
  MessageSquare,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Order, UserProfile } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { siteConfig } from "@/lib/config/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";

export default function AccountPage() {
  const router = useRouter();
  const { user: authUser, logout, isLoading: authLoading } = useAuth();
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [authRes, ordersRes] = await Promise.all([
          fetch("/api/auth"),
          fetch("/api/orders"),
        ]);

        const authData = await authRes.json();
        const ordersData = await ordersRes.json();

        if (authData.success && authData.data) {
          setUser(authData.data);
        } else {
          // If not logged in, redirect to home
          router.push("/");
          return;
        }

        if (ordersData.success && ordersData.data) {
          setOrders(ordersData.data);
        }
      } catch {
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  // If user signs out from navbar while on this page, redirect immediately to home
  React.useEffect(() => {
    if (!authLoading && !authUser && !loading) {
      router.push("/");
    }
  }, [authUser, authLoading, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-[#68706b]">
        Loading your account profile...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Top Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#e8f5ee] flex items-center justify-center text-[#16834b] font-bold text-xl">
            {user?.full_name?.charAt(0) || "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111412]">
                {user?.full_name}
              </h1>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#f2f4f2] text-[#111412]">
                {user?.role === "admin" ? "Workshop Administrator" : "Customer"}
              </span>
            </div>
            <p className="text-xs text-[#68706b] mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {user?.role === "admin" && (
            <Link href="/admin">
              <Button variant="primary" size="md" className="font-semibold gap-1.5">
                <span>Enter Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}

          <Button
            variant="outline"
            size="md"
            onClick={handleLogout}
            className="text-xs font-semibold gap-1 text-rose-600 hover:bg-rose-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#111412] tracking-tight">
              Order History & Dispatches
            </h2>
            <p className="text-xs text-[#68706b]">
              Track your OEM component shipments and download tax invoices.
            </p>
          </div>

          <Link href="/parts">
            <Button variant="outline" size="sm" className="font-semibold text-xs">
              Order More Parts
            </Button>
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 rounded-3xl border border-[rgba(17,20,18,0.08)] bg-white text-center space-y-3">
            <Package className="w-10 h-10 text-[#68706b] mx-auto" />
            <h3 className="text-sm font-bold text-[#111412]">No orders placed yet</h3>
            <p className="text-xs text-[#68706b] max-w-sm mx-auto">
              You haven&apos;t placed any orders yet. Browse our verified parts catalog to find genuine spares.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 sm:p-6 rounded-3xl border border-[rgba(17,20,18,0.08)] bg-white shadow-2xs space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[rgba(17,20,18,0.06)]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#111412]">
                        Order #{ord.order_number}
                      </span>
                      <Badge variant="success" size="sm">
                        {ord.status.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-[#68706b] flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      Placed on {formatDate(ord.created_at)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-base sm:text-lg font-extrabold text-[#111412]">
                      {formatCurrency(ord.total, ord.currency)}
                    </span>
                    <span className="text-[11px] text-[#68706b] block">
                      Incl. 5% VAT ({formatCurrency(ord.vat_amount, ord.currency)})
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="space-y-2.5">
                  {ord.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#f7f8f7] flex items-center justify-center font-bold text-[10px] text-[#68706b]">
                          {item.quantity}x
                        </div>
                        <div>
                          <p className="font-semibold text-[#111412] line-clamp-1">
                            {item.product_name}
                          </p>
                          <p className="text-[11px] font-mono text-[#68706b]">
                            {item.brand_name} • #{item.part_number}
                          </p>
                        </div>
                      </div>

                      <span className="font-bold text-[#111412]">
                        {formatCurrency(item.total_price, ord.currency)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-[rgba(17,20,18,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="text-[#68706b] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#16834b]" />
                    <span>
                      Shipping to: {ord.shipping_address.emirate_city},{" "}
                      {ord.shipping_address.country}
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/${siteConfig.whatsapp_number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Hello ApexAuto, I am checking the status of my order #${ord.order_number}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-[#16834b] hover:underline"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Courier Update</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

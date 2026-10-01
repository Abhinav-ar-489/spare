"use client";

import * as React from "react";
import Link from "next/link";
import {
  Package,
  Calendar,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
} from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { siteConfig } from "@/lib/config/site";
import { Badge } from "../ui/badge";

interface OrdersViewProps {
  initialOrders: Order[];
}

export function OrdersView({ initialOrders }: OrdersViewProps) {
  const [orders, setOrders] = React.useState(initialOrders);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [query, setQuery] = React.useState("");

  const handleUpdateStatus = async (id: string, status: OrderStatus) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    } catch {
      alert("Failed to update status");
    }
  };

  const filtered = React.useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      const q = query.toLowerCase().trim();
      const matchesQuery =
        !q ||
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.includes(q) ||
        o.shipping_address.emirate_city.toLowerCase().includes(q);

      return matchesStatus && matchesQuery;
    });
  }, [orders, statusFilter, query]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111412]">
          Customer Orders & Dispatch Desk
        </h1>
        <p className="text-xs sm:text-sm text-[#68706b] mt-0.5">
          Manage fulfillment, update tracking statuses, and confirm courier dispatches.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="p-3 rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white shadow-2xs flex items-center gap-3 flex-1">
          <Search className="w-4 h-4 text-[#16834b] ml-1 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by order #, customer name, phone, or emirate..."
            className="w-full text-xs sm:text-sm text-[#111412] placeholder:text-[#68706b]/60 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["all", "confirmed", "processing", "dispatched", "delivered"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider capitalize whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? "bg-[#16834b] text-white"
                  : "bg-white border border-[rgba(17,20,18,0.08)] text-[#68706b] hover:text-[#111412]"
              }`}
            >
              {st} ({st === "all" ? orders.length : orders.filter((o) => o.status === st).length})
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-3xl border border-[rgba(17,20,18,0.08)] bg-white text-center text-xs text-[#68706b]">
          No customer orders found matching your criteria.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((ord) => {
            let cleanPhone = ord.customer_phone.replace(/[^0-9]/g, "");
            if (cleanPhone.length === 10 && !cleanPhone.startsWith("971")) {
              cleanPhone = `971${cleanPhone}`;
            }
            const waUpdateUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              `Hello ${ord.customer_name}, this is ApexAuto Warehouse confirming your Order #${ord.order_number} for ${formatCurrency(
                ord.total,
                ord.currency
              )}. Status: ${ord.status.toUpperCase()}.`
            )}`;

            return (
              <div
                key={ord.id}
                className="p-5 sm:p-6 rounded-3xl border border-[rgba(17,20,18,0.08)] bg-white shadow-2xs space-y-4 hover:border-[#16834b]/20 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(17,20,18,0.06)]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-[#111412]">
                        Order #{ord.order_number}
                      </span>
                      <select
                        value={ord.status}
                        onChange={(e) =>
                          handleUpdateStatus(ord.id, e.target.value as OrderStatus)
                        }
                        className={`text-xs font-semibold rounded-lg px-2.5 py-1 border-0 cursor-pointer ${
                          ord.status === "confirmed"
                            ? "bg-[#e8f5ee] text-[#0d6338]"
                            : ord.status === "dispatched"
                            ? "bg-blue-100 text-blue-800"
                            : ord.status === "delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-[#f2f4f2] text-[#68706b]"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#68706b] mt-1 font-medium">
                      <span>{ord.customer_name}</span>
                      <span>•</span>
                      <span>{ord.customer_phone}</span>
                      <span>•</span>
                      <span>{formatDate(ord.created_at)}</span>
                    </div>
                  </div>

                  <div className="text-right sm:self-center">
                    <span className="text-base sm:text-lg font-extrabold text-[#111412] block">
                      {formatCurrency(ord.total, ord.currency)}
                    </span>
                    <span className="text-[11px] text-[#68706b] capitalize">
                      Payment: {ord.payment_method.replace("_", " ")}
                    </span>
                  </div>
                </div>

                {/* Items & Shipping row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5 bg-[#f7f8f7]/50 p-3 rounded-2xl border border-[rgba(17,20,18,0.04)]">
                    <span className="font-bold text-[#111412] block mb-1">
                      Ordered Spare Parts ({ord.items.length})
                    </span>
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-0.5">
                        <span className="truncate pr-2">
                          {item.quantity}x {item.product_name} (#{item.part_number})
                        </span>
                        <span className="font-semibold text-[#111412] shrink-0">
                          {formatCurrency(item.total_price, ord.currency)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1 bg-[#f7f8f7]/50 p-3 rounded-2xl border border-[rgba(17,20,18,0.04)]">
                    <span className="font-bold text-[#111412] block mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#16834b]" />
                      Shipping Address
                    </span>
                    <p className="text-[#111412] font-semibold">{ord.shipping_address.full_name}</p>
                    <p className="text-[#68706b]">
                      {ord.shipping_address.street_address}, {ord.shipping_address.emirate_city}, {ord.shipping_address.country}
                    </p>
                    {ord.shipping_address.notes && (
                      <p className="text-[11px] text-[#16834b] italic mt-1">
                        Note: {ord.shipping_address.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-between border-t border-[rgba(17,20,18,0.04)] text-xs">
                  <span className="text-[#68706b]">
                    VAT: {formatCurrency(ord.vat_amount, ord.currency)}
                  </span>

                  <a
                    href={waUpdateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16834b] hover:underline"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    <span>Send WhatsApp Courier Update</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

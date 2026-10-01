import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  MessageSquare,
  Truck,
  MapPin,
  Calendar,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { orderService } from "@/services";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { siteConfig } from "@/lib/config/site";
import { Button } from "@/components/ui/button";

interface OrderConfirmationPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { orderId } = await params;
  const order = await orderService.getOrderById(orderId);

  if (!order) {
    notFound();
  }

  let cleanPhone = siteConfig.whatsapp_number.replace(/[^0-9]/g, "");
  if (cleanPhone.length === 10 && !cleanPhone.startsWith("971")) {
    cleanPhone = `971${cleanPhone}`;
  }
  const waOrderText = `Hello ApexAuto, I have placed Order *#${order.order_number}* for *${formatCurrency(
    order.total,
    order.currency
  )}*.\n\n*Customer:* ${order.customer_name} (${order.customer_phone})\n*Delivery:* ${
    order.shipping_address.emirate_city
  }, ${order.shipping_address.country}\n\nPlease confirm warehouse dispatch and tracking number.`;

  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waOrderText)}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8">
      {/* Top Success Banner */}
      <div className="p-8 sm:p-10 rounded-3xl border border-[rgba(17,20,18,0.08)] bg-white text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#e8f5ee] flex items-center justify-center text-[#16834b] mx-auto animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#16834b]">
            Order Successfully Placed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111412] mt-1">
            Thank you, {order.customer_name}!
          </h1>
          <p className="text-xs sm:text-sm text-[#68706b] mt-1">
            Order Reference: <strong className="text-[#111412] font-mono text-sm">{order.order_number}</strong>
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto font-bold gap-2 shadow-md shadow-[#16834b]/20">
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Verify Order via WhatsApp</span>
            </Button>
          </a>
          <Link href="/account" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold">
              View Order in Account
            </Button>
          </Link>
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-[rgba(17,20,18,0.08)] bg-white shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[rgba(17,20,18,0.06)] text-xs text-[#68706b]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#16834b]" />
            <span>Order Date: {formatDate(order.created_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#111412] capitalize">
              Payment: {order.payment_method.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Shipping Address Summary */}
        <div className="p-4 rounded-2xl glass-card border border-white/80 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#111412]">
            <MapPin className="w-4 h-4 text-[#16834b]" />
            <span>Shipping Destination</span>
          </div>
          <p className="text-[#111412] font-semibold">{order.shipping_address.full_name}</p>
          <p className="text-[#68706b]">
            {order.shipping_address.street_address}
            {order.shipping_address.building_villa && `, ${order.shipping_address.building_villa}`}
            {order.shipping_address.area_district && `, ${order.shipping_address.area_district}`}
          </p>
          <p className="text-[#68706b]">
            {order.shipping_address.emirate_city}, {order.shipping_address.country} • Phone: {order.shipping_address.phone}
          </p>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#111412]">Ordered Spares ({order.items.length})</h3>
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs py-2 border-b border-[rgba(17,20,18,0.04)] last:border-0"
              >
                <div>
                  <span className="font-bold text-[#111412] block">
                    {item.product_name}
                  </span>
                  <span className="text-[#68706b] font-mono text-[11px]">
                    Qty: {item.quantity} • #{item.part_number} • {item.brand_name}
                  </span>
                </div>
                <span className="font-extrabold text-[#111412]">
                  {formatCurrency(item.total_price, order.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Cost Breakdown */}
        <div className="pt-4 border-t border-[rgba(17,20,18,0.06)] space-y-2 text-xs text-[#68706b]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-[#111412]">
              {formatCurrency(order.subtotal, order.currency)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>5% VAT (Tax Invoice)</span>
            <span className="font-semibold text-[#111412]">
              {formatCurrency(order.vat_amount, order.currency)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Courier Dispatch</span>
            <span className="font-semibold text-[#111412]">
              {order.shipping_fee === 0 ? "FREE" : formatCurrency(order.shipping_fee, order.currency)}
            </span>
          </div>
          <div className="pt-2 border-t border-[rgba(17,20,18,0.06)] flex justify-between text-base font-extrabold text-[#111412]">
            <span>Total Paid / Due</span>
            <span className="text-[#16834b]">
              {formatCurrency(order.total, order.currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

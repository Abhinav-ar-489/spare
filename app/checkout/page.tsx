"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  Banknote,
  Building,
  MessageSquare,
  ShieldCheck,
  Truck,
  ArrowRight,
  CheckCircle2,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatCurrency } from "@/lib/utils/formatters";
import { PaymentMethod, ShippingAddress } from "@/types";
import { siteConfig } from "@/lib/config/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, vatAmount, shippingFee, total, clearCart } = useCart();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form State
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [country, setCountry] = React.useState("United Arab Emirates");
  const [emirateCity, setEmirateCity] = React.useState("Dubai");
  const [streetAddress, setStreetAddress] = React.useState("");
  const [buildingVilla, setBuildingVilla] = React.useState("");
  const [areaDistrict, setAreaDistrict] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("card");

  // Pre-fill user details if logged in
  React.useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setEmail(user.email || "");
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  const emiratesList = [
    "Dubai",
    "Abu Dhabi",
    "Sharjah",
    "Ajman",
    "Ras Al Khaimah",
    "Fujairah",
    "Umm Al Quwain",
    "Riyadh (KSA)",
    "Jeddah (KSA)",
    "Dammam (KSA)",
    "Doha (Qatar)",
    "Kuwait City (Kuwait)",
    "Manama (Bahrain)",
    "Muscat (Oman)",
  ];

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setIsSubmitting(true);

    const shippingAddress: ShippingAddress = {
      full_name: fullName,
      phone,
      country,
      emirate_city: emirateCity,
      street_address: streetAddress,
      building_villa: buildingVilla || undefined,
      area_district: areaDistrict || undefined,
      notes: notes || undefined,
    };

    const orderItems = items.map(({ product, quantity }) => {
      const unit = product.discount_price || product.price || 0;
      return {
        product_id: product.id,
        product_name: product.name,
        part_number: product.part_number,
        brand_name: product.brand?.name || "OEM",
        unit_price: unit,
        quantity,
        total_price: unit * quantity,
        image_url: product.images?.[0]?.url,
      };
    });

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: fullName,
          customer_email: email,
          customer_phone: phone,
          shipping_address: shippingAddress,
          items: orderItems,
          subtotal,
          vat_amount: vatAmount,
          shipping_fee: shippingFee,
          total,
          payment_method: paymentMethod,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error || "Failed to submit order");
        setIsSubmitting(false);
        return;
      }

      const createdOrder = data.data;
      clearCart();
      router.push(`/order-confirmation/${createdOrder.id}`);
    } catch {
      alert("An error occurred while placing your order.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-extrabold text-[#111412]">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-sm text-[#68706b]">
          Please add parts to your cart before proceeding to checkout.
        </p>
        <Link href="/parts">
          <Button variant="primary">Browse Parts</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#68706b] hover:text-[#111412] mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111412]">
          Secure Checkout
        </h1>
        <p className="text-xs sm:text-sm text-[#68706b] mt-0.5">
          Fast express dispatch directly to your verified delivery address.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Delivery & Payment Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer Info */}
            <div className="p-6 rounded-3xl glass-card border border-white/80 shadow-md space-y-4">
              <h2 className="text-sm font-bold text-[#111412] uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#16834b] text-white flex items-center justify-center text-xs">
                  1
                </span>
                <span>Contact & Communication</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111412] mb-1">
                    Full Name *
                  </label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Khalid Al-Nuaimi"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111412] mb-1">
                    Mobile / WhatsApp Number *
                  </label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+971 50 123 4567"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111412] mb-1">
                  Email Address (For Invoicing)
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="khalid@example.ae"
                />
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="p-6 rounded-3xl glass-card border border-white/80 shadow-md space-y-4">
              <h2 className="text-sm font-bold text-[#111412] uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#16834b] text-white flex items-center justify-center text-xs">
                  2
                </span>
                <span>Shipping Destination</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111412] mb-1">
                    Country *
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full h-11 rounded-xl border border-[rgba(17,20,18,0.12)] bg-white px-3 text-sm text-[#111412] focus:border-[#16834b] focus:outline-none"
                  >
                    <option value="United Arab Emirates">United Arab Emirates (UAE)</option>
                    <option value="Saudi Arabia">Saudi Arabia (KSA)</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Bahrain">Bahrain</option>
                    <option value="Oman">Oman</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111412] mb-1">
                    Emirate / City *
                  </label>
                  <select
                    value={emirateCity}
                    onChange={(e) => setEmirateCity(e.target.value)}
                    className="w-full h-11 rounded-xl border border-[rgba(17,20,18,0.12)] bg-white px-3 text-sm text-[#111412] focus:border-[#16834b] focus:outline-none"
                  >
                    {emiratesList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111412] mb-1">
                    Area / District *
                  </label>
                  <Input
                    value={areaDistrict}
                    onChange={(e) => setAreaDistrict(e.target.value)}
                    placeholder="e.g. Al Quoz / Jumeirah / Olaya"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111412] mb-1">
                    Building, Villa or Workshop #
                  </label>
                  <Input
                    value={buildingVilla}
                    onChange={(e) => setBuildingVilla(e.target.value)}
                    placeholder="e.g. Villa 42B / Bay Square 07"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111412] mb-1">
                  Street Address & Landmarks *
                </label>
                <Input
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="Street name, landmark, or gate number"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111412] mb-1">
                  Delivery Notes / VIN Confirmation
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional delivery instructions or vehicle chassis number for pre-dispatch inspection..."
                  className="w-full rounded-xl border border-[rgba(17,20,18,0.12)] p-3 text-xs text-[#111412] focus:border-[#16834b] focus:outline-none"
                />
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="p-6 rounded-3xl border border-[rgba(17,20,18,0.08)] bg-white shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-[#111412] uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#16834b] text-white flex items-center justify-center text-xs">
                  3
                </span>
                <span>Payment & Invoicing Method</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option 1: Card */}
                <label
                  className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-[#16834b] bg-[#e8f5ee]/40"
                      : "border-[rgba(17,20,18,0.08)] hover:border-[rgba(17,20,18,0.16)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="mt-1 text-[#16834b] focus:ring-[#16834b]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#16834b]" />
                      <span className="text-xs font-bold text-[#111412]">
                        Credit / Debit Card
                      </span>
                    </div>
                    <p className="text-[11px] text-[#68706b] mt-1">
                      Visa, MasterCard, Apple Pay (Gateway integration)
                    </p>
                  </div>
                </label>

                {/* Option 2: Cash on Delivery (COD) */}
                <label
                  className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-[#16834b] bg-[#e8f5ee]/40"
                      : "border-[rgba(17,20,18,0.08)] hover:border-[rgba(17,20,18,0.16)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mt-1 text-[#16834b] focus:ring-[#16834b]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-[#16834b]" />
                      <span className="text-xs font-bold text-[#111412]">
                        Cash on Delivery (COD)
                      </span>
                    </div>
                    <p className="text-[11px] text-[#68706b] mt-1">
                      Pay courier upon part delivery to your doorstep
                    </p>
                  </div>
                </label>

                {/* Option 3: Bank Transfer */}
                <label
                  className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === "bank_wire"
                      ? "border-[#16834b] bg-[#e8f5ee]/40"
                      : "border-[rgba(17,20,18,0.08)] hover:border-[rgba(17,20,18,0.16)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="bank_wire"
                    checked={paymentMethod === "bank_wire"}
                    onChange={() => setPaymentMethod("bank_wire")}
                    className="mt-1 text-[#16834b] focus:ring-[#16834b]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-[#16834b]" />
                      <span className="text-xs font-bold text-[#111412]">
                        Corporate Bank Wire
                      </span>
                    </div>
                    <p className="text-[11px] text-[#68706b] mt-1">
                      Emirates NBD / FAB official corporate wire
                    </p>
                  </div>
                </label>

                {/* Option 4: WhatsApp Invoicing */}
                <label
                  className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === "whatsapp"
                      ? "border-[#16834b] bg-[#e8f5ee]/40"
                      : "border-[rgba(17,20,18,0.08)] hover:border-[rgba(17,20,18,0.16)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="whatsapp"
                    checked={paymentMethod === "whatsapp"}
                    onChange={() => setPaymentMethod("whatsapp")}
                    className="mt-1 text-[#16834b] focus:ring-[#16834b]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#16834b]" />
                      <span className="text-xs font-bold text-[#111412]">
                        WhatsApp Payment Desk
                      </span>
                    </div>
                    <p className="text-[11px] text-[#68706b] mt-1">
                      Direct WhatsApp payment link via {siteConfig.whatsapp_number}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review & Confirmation (5 cols) */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl glass-card border border-white/80 shadow-lg space-y-5 sticky top-24">
              <h2 className="text-base font-bold text-[#111412] pb-3 border-b border-[rgba(17,20,18,0.06)]">
                Items in Order ({items.length})
              </h2>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map(({ product, quantity }) => {
                  const unit = product.discount_price || product.price || 0;
                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between text-xs py-1"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-bold text-[#111412] truncate">
                          {product.name}
                        </p>
                        <span className="text-[#68706b] font-mono text-[11px]">
                          {quantity}x @ {formatCurrency(unit)} • #{product.part_number}
                        </span>
                      </div>
                      <span className="font-extrabold text-[#111412] shrink-0">
                        {formatCurrency(unit * quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-[rgba(17,20,18,0.06)] space-y-2 text-xs text-[#68706b]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#111412]">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>5% VAT (Tax Invoice)</span>
                  <span className="font-semibold text-[#111412]">
                    {formatCurrency(vatAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Express Courier Dispatch</span>
                  <span className="font-semibold text-[#111412]">
                    {shippingFee === 0 ? "FREE" : formatCurrency(shippingFee)}
                  </span>
                </div>
                <div className="pt-3 border-t border-[rgba(17,20,18,0.06)] flex justify-between text-base font-extrabold text-[#111412]">
                  <span>Total Amount</span>
                  <span className="text-[#16834b]">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full font-bold gap-2 text-sm sm:text-base shadow-md shadow-[#16834b]/20"
              >
                <Lock className="w-4 h-4" />
                <span>Place Order ({formatCurrency(total)})</span>
              </Button>

              <div className="pt-2 text-[11px] text-[#68706b] space-y-1">
                <div className="flex items-center gap-1.5 text-[#16834b] font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified OEM Genuine Parts Guarantee</span>
                </div>
                <p>
                  You will receive an automated order confirmation and instant WhatsApp fulfillment alert.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

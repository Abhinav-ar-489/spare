"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  CheckCircle2,
  Car,
  Send,
} from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import { enquirySchema, EnquiryFormValues } from "@/lib/validations/enquiry";
import { generateWhatsAppLink } from "@/lib/utils/whatsapp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      vehicle_details: "",
      message: "",
    },
  });

  const onSubmit = async (data: EnquiryFormValues) => {
    setIsSubmitting(true);
    try {
      await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const waUrl = generateWhatsAppLink({
        vehicleDetails: data.vehicle_details,
        customMessage: `Hello ApexAuto, this is ${data.name} (Ph: ${data.phone}).\n\n${data.message}`,
      });

      setIsSuccess(true);
      reset();

      setTimeout(() => {
        window.open(waUrl, "_blank", "noopener,noreferrer");
      }, 700);
    } catch {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="max-w-2xl mb-10 sm:mb-14">
        <span className="text-xs font-bold uppercase tracking-wider text-[#16834b]">
          Customer & Workshop Desk
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111412] mt-1">
          Contact Our Technical Team
        </h1>
        <p className="text-sm text-[#68706b] mt-2">
          Have questions regarding vehicle fitment, part availability, or bulk fleet orders? Send us a message or chat on WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Direct contact details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-[rgba(17,20,18,0.08)] bg-[#f7f8f7]/70 p-6 space-y-5">
            <h3 className="text-base font-bold text-[#111412]">
              Direct Contact Channels
            </h3>

            <div className="space-y-4 text-sm text-[#68706b]">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white border border-[rgba(17,20,18,0.08)] flex items-center justify-center text-[#16834b] shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#111412]">Phone Helpdesk</p>
                  <a
                    href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}
                    className="hover:text-[#16834b] font-medium transition-colors"
                  >
                    {siteConfig.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#e8f5ee] flex items-center justify-center text-[#16834b] shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#111412]">Instant WhatsApp Desk</p>
                  <a
                    href={`https://wa.me/971${siteConfig.whatsapp_number.replace(/[^0-9]/g, "").slice(-10)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#16834b] hover:underline font-semibold"
                  >
                    +971 {siteConfig.whatsapp_number} (Live Chat)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white border border-[rgba(17,20,18,0.08)] flex items-center justify-center text-[#16834b] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#111412]">Email Inquiries</p>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="hover:text-[#16834b] transition-colors"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white border border-[rgba(17,20,18,0.08)] flex items-center justify-center text-[#16834b] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#111412]">Logistics Center</p>
                  <p className="text-xs leading-relaxed">{siteConfig.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white border border-[rgba(17,20,18,0.08)] flex items-center justify-center text-[#16834b] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#111412]">Operating Hours</p>
                  <p className="text-xs">{siteConfig.business_hours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Enquiry Form */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-[rgba(17,20,18,0.08)] bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-[#111412] mb-1">
              Send a Parts Inquiry
            </h3>
            <p className="text-xs text-[#68706b] mb-6">
              Fill in your requirement below. We will immediately route your query to our technical team on WhatsApp.
            </p>

            {isSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#e8f5ee] flex items-center justify-center text-[#16834b] mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-[#111412]">
                  Enquiry Submitted Successfully
                </h4>
                <p className="text-xs text-[#68706b] max-w-sm mx-auto">
                  We have forwarded your request to WhatsApp support. Our technicians will confirm pricing and compatibility with you shortly.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSuccess(false)}
                  className="mt-2"
                >
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#111412] mb-1">
                      Your Full Name *
                    </label>
                    <Input
                      placeholder="e.g. Tariq Al-Mansoor"
                      {...register("name")}
                      error={errors.name?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#111412] mb-1">
                      Phone / WhatsApp Number *
                    </label>
                    <Input
                      placeholder="e.g. +971 50 123 4567"
                      {...register("phone")}
                      error={errors.phone?.message}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#111412] mb-1">
                      Email Address (Optional)
                    </label>
                    <Input
                      type="email"
                      placeholder="e.g. tariq@example.ae"
                      {...register("email")}
                      error={errors.email?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#111412] mb-1">
                      Car Make, Model & Year
                    </label>
                    <Input
                      icon={<Car className="w-4 h-4" />}
                      placeholder="e.g. Toyota Land Cruiser LC300 2022 V6"
                      {...register("vehicle_details")}
                      error={errors.vehicle_details?.message}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111412] mb-1">
                    Required Part Details or VIN Number *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe the required components, part numbers or upload your vehicle chassis code..."
                    className="w-full rounded-xl border border-[rgba(17,20,18,0.12)] p-3 text-sm text-[#111412] placeholder:text-[#68706b]/60 focus:border-[#16834b] focus:outline-none focus:ring-2 focus:ring-[#16834b]/15"
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="text-xs text-rose-600 mt-1">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full font-semibold gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Inquiry & Open WhatsApp</span>
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

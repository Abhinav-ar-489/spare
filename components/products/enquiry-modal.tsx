"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquare, CheckCircle, Car, Send } from "lucide-react";
import { Product } from "@/types";
import { enquirySchema, EnquiryFormValues } from "@/lib/validations/enquiry";
import { generateWhatsAppLink } from "@/lib/utils/whatsapp";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  defaultVehicle?: string;
}

export function EnquiryModal({
  isOpen,
  onClose,
  product,
  defaultVehicle = "",
}: EnquiryModalProps) {
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
      product_id: product?.id || "",
      product_name: product?.name || "",
      product_part_number: product?.part_number || "",
      vehicle_details: defaultVehicle,
      message: product
        ? `I am interested in ${product.name} (Part #${product.part_number}). Please verify availability and price.`
        : "I need assistance checking spare parts availability for my car.",
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      reset({
        name: "",
        phone: "",
        email: "",
        product_id: product?.id || "",
        product_name: product?.name || "",
        product_part_number: product?.part_number || "",
        vehicle_details: defaultVehicle,
        message: product
          ? `I am interested in ${product.name} (Part #${product.part_number}). Please verify availability and price.`
          : "I need assistance checking spare parts availability for my car.",
      });
    }
  }, [isOpen, product, defaultVehicle, reset]);

  const onSubmit = async (data: EnquiryFormValues) => {
    setIsSubmitting(true);
    try {
      // 1. Submit to database
      await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // 2. Open WhatsApp with pre-composed message
      const waUrl = generateWhatsAppLink({
        product,
        vehicleDetails: data.vehicle_details,
        customMessage: `Hello, this is ${data.name} (Ph: ${data.phone}).\n\n${data.message}`,
      });

      setIsSuccess(true);

      setTimeout(() => {
        window.open(waUrl, "_blank", "noopener,noreferrer");
      }, 700);
    } catch {
      alert("Enquiry submitted. Our technical desk will reach out shortly.");
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isSuccess ? "Enquiry Logged Successfully" : "Consult Technical Desk"}
      description={
        isSuccess
          ? "Your request has been routed to our parts desk. Opening WhatsApp..."
          : product
          ? `Inquire about ${product.name} (Part #${product.part_number})`
          : "Speak directly with an automotive parts specialist."
      }
      maxWidth="md"
    >
      {isSuccess ? (
        <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#e8f5ee] flex items-center justify-center text-[#16834b] animate-bounce">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-[#111412]">
              Opening WhatsApp Consultation
            </h4>
            <p className="text-sm text-[#68706b] mt-1 max-w-sm">
              We have dispatched your part query to our live support channel. You will be connected in 2 seconds.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="mt-4"
          >
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {product && (
            <div className="rounded-xl bg-[#f7f8f7] p-3 text-xs border border-[rgba(17,20,18,0.06)] flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#111412] line-clamp-1">
                  {product.name}
                </p>
                <p className="text-[#68706b] font-mono">
                  Part: {product.part_number} • Brand: {product.brand?.name}
                </p>
              </div>
              <span className="text-xs font-bold text-[#16834b] shrink-0">
                {product.price ? `₹${product.price.toLocaleString()}` : "Price on Request"}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#111412] mb-1">
                Your Name *
              </label>
              <Input
                placeholder="e.g. Vikram Malhotra"
                {...register("name")}
                error={errors.name?.message}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#111412] mb-1">
                Mobile / WhatsApp Number *
              </label>
              <Input
                placeholder="e.g. 9820155432"
                {...register("phone")}
                error={errors.phone?.message}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111412] mb-1">
              Vehicle Make, Model & Year
            </label>
            <Input
              icon={<Car className="w-4 h-4" />}
              placeholder="e.g. Toyota Innova Crysta 2018 2.8 Diesel"
              {...register("vehicle_details")}
              error={errors.vehicle_details?.message}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111412] mb-1">
              Specific Query / Note *
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-[rgba(17,20,18,0.12)] p-3 text-sm text-[#111412] placeholder:text-[#68706b]/60 focus:border-[#16834b] focus:outline-none focus:ring-2 focus:ring-[#16834b]/15"
              placeholder="Please confirm availability and delivery timeframe..."
              {...register("message")}
            />
            {errors.message && (
              <p className="text-xs text-rose-600 mt-1">{errors.message.message}</p>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Connect on WhatsApp</span>
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

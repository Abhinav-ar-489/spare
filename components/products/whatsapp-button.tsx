"use client";

import * as React from "react";
import { MessageSquare, PhoneCall } from "lucide-react";
import { Product } from "@/types";
import { generateWhatsAppLink } from "@/lib/utils/whatsapp";
import { Button } from "../ui/button";

interface WhatsAppButtonProps {
  product?: Partial<Product>;
  vehicleDetails?: string;
  variant?: "primary" | "secondary" | "outline" | "glass";
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
  onEnquiryLogged?: () => void;
}

export function WhatsAppButton({
  product,
  vehicleDetails,
  variant = "primary",
  size = "md",
  className = "",
  label = "Enquire on WhatsApp",
  onEnquiryLogged,
}: WhatsAppButtonProps) {
  const handleClick = async () => {
    // Optionally log enquiry in database
    if (product) {
      try {
        await fetch("/api/enquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "WhatsApp Visitor",
            phone: "+91 99999 99999", // Placeholder until entered or direct chat
            product_id: product.id,
            product_name: product.name,
            product_part_number: product.part_number,
            vehicle_details: vehicleDetails || "Direct WhatsApp enquiry",
            message: `Customer initiated WhatsApp enquiry for ${product.name} (Part: ${product.part_number})`,
          }),
        });
        if (onEnquiryLogged) onEnquiryLogged();
      } catch {
        // Continue to WhatsApp anyway even if logging fails
      }
    }

    const url = generateWhatsAppLink({
      product,
      vehicleDetails,
    });

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`bg-[#16834b] text-white hover:bg-[#0d6338] shadow-sm flex items-center justify-center gap-2 ${className}`}
    >
      <MessageSquare className="w-4 h-4 fill-current" />
      <span>{label}</span>
    </Button>
  );
}

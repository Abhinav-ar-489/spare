import { siteConfig } from "@/lib/config/site";
import { Product } from "@/types";

interface WhatsAppProductParams {
  product?: Partial<Product>;
  vehicleDetails?: string;
  phoneNumber?: string;
  customMessage?: string;
}

export function generateWhatsAppLink({
  product,
  vehicleDetails,
  phoneNumber = siteConfig.whatsapp_number,
  customMessage,
}: WhatsAppProductParams): string {
  // Clean phone number (strip spaces, dashes, + signs for the wa.me format)
  let cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
  if (cleanPhone.length === 10 && !cleanPhone.startsWith("971")) {
    cleanPhone = `971${cleanPhone}`;
  }

  let text = "";

  if (product && product.name) {
    text = `Hello ApexAuto Team, I am interested in ordering:

*Product:* ${product.name}
*Brand:* ${product.brand?.name || "Genuine OEM"}
*Part Number:* ${product.part_number || "N/A"}${
      product.oem_number ? `\n*OEM Code:* ${product.oem_number}` : ""
    }${
      product.price ? `\n*Price:* AED ${product.price.toLocaleString()}` : ""
    }

${
  vehicleDetails
    ? `*Vehicle:* \n${vehicleDetails}\n`
    : "*Vehicle:* (Please advise on vehicle model compatibility)\n"
}
Could you please confirm warehouse stock and delivery timeline?`;
  } else if (vehicleDetails) {
    text = `Hello ApexAuto Team, I need assistance finding compatible spare parts for my vehicle:

*Vehicle Details:*
${vehicleDetails}

${customMessage ? `*Requirement:*\n${customMessage}\n` : ""}
Could your technical desk check availability?`;
  } else {
    text =
      customMessage ||
      `Hello ApexAuto Team, I need assistance identifying genuine spare parts for my vehicle. Could you please guide me?`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text.trim())}`;
}

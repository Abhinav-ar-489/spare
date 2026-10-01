import { z } from "zod";

export const siteSettingsSchema = z.object({
  business_name: z.string().min(2, "Business name is required"),
  business_tagline: z.string().min(2, "Tagline is required"),
  headline: z.string().min(5, "Headline is required"),
  hero_description: z.string().min(10, "Hero description is required"),
  phone: z.string().min(8, "Phone number is required"),
  whatsapp_number: z.string().min(8, "WhatsApp number is required"),
  email: z.string().email("Valid email is required"),
  address: z.string().min(5, "Address is required"),
  business_hours: z.string().min(3, "Business hours required"),
  announcement: z.string().optional().default(""),
  default_currency: z.string().default("INR"),
  social_links: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
  }),
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;

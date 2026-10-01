import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(10, "Please enter a valid 10-digit mobile number")
    .regex(/^[0-9+\s-]{10,15}$/, "Invalid phone number format"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  product_id: z.string().optional(),
  product_name: z.string().optional(),
  product_part_number: z.string().optional(),
  vehicle_details: z.string().optional(),
  message: z.string().min(5, "Please share some details about your requirement"),
});

export type EnquiryFormValues = z.infer<typeof enquirySchema>;

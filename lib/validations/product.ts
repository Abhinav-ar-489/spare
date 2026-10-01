import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  brand_id: z.string().min(1, "Please select a brand"),
  category_id: z.string().min(1, "Please select a category"),
  part_number: z.string().min(2, "Part number is required (e.g., BP-4821)"),
  oem_number: z.string().optional().default(""),
  description: z.string().min(10, "Please provide a descriptive explanation of the part"),
  price: z.coerce.number().min(0, "Price must be positive").nullable().optional(),
  discount_price: z.coerce.number().min(0).nullable().optional(),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative").default(10),
  is_available: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  payment_enabled: z.boolean().default(false),
  specifications: z.record(z.string(), z.string()).default({}),
  tags: z.array(z.string()).default([]),
  compatibilities: z.array(
    z.object({
      variantId: z.string().optional(),
      variant_id: z.string().optional(),
      notes: z.string().optional(),
    })
  ).optional().default([]),
  images: z.array(
    z.object({
      id: z.string().optional(),
      url: z.string().min(1, "Image URL is required"),
      alt: z.string().default("Product image"),
      display_order: z.number().default(0),
      is_primary: z.boolean().default(false),
    })
  ).default([]),
});

export type ProductFormValues = z.infer<typeof productSchema>;

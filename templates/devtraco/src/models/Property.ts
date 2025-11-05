import { z } from "zod";

export const propertyImageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().optional(),
  isMain: z.boolean().optional(),
});

const coordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const propertySchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  price: z.number().min(0),
  currency: z.enum(["GHS", "USD", "EUR", "GBP", "CAD", "AUD"]).default("USD"),
  propertyType: z.string().min(1), // Should be ObjectId string
  status: z
    .enum(["for-sale", "for-rent", "sold", "rented"])
    .default("for-sale"),
  beds: z.number().min(0),
  baths: z.number().min(0),
  area: z.number().min(0),
  images: z.array(propertyImageSchema).default([]),
  amenities: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  coordinates: coordinatesSchema.optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  // User/Website association fields
  userId: z.string().min(1, "User ID is required"),
  websiteId: z.string().optional(), // For future multi-website support
  domain: z.string().min(1, "Domain is required"),
  // Timestamps
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Property = z.infer<typeof propertySchema>;

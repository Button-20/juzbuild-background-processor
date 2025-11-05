import { ObjectId } from "mongodb";
import { z } from "zod";

// FAQ Schema
export const FaqSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  question: z.string().min(1, "Question is required").trim(),
  answer: z.string().min(1, "Answer is required").trim(),
  category: z.string().trim().optional(),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// FAQ input schemas
export const CreateFaqSchema = FaqSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateFaqSchema = FaqSchema.omit({
  _id: true,
  createdAt: true,
}).partial();

export const FaqFiltersSchema = z.object({
  isActive: z.boolean().optional(),
  category: z.string().optional(),
  limit: z.number().min(1).max(100).default(10),
  skip: z.number().min(0).default(0),
});

// Type exports
export type Faq = z.infer<typeof FaqSchema>;
export type CreateFaqInput = z.infer<typeof CreateFaqSchema>;
export type UpdateFaqInput = z.infer<typeof UpdateFaqSchema>;
export type FaqFilters = z.infer<typeof FaqFiltersSchema>;

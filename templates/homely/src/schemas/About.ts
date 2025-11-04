import { z } from "zod";

// About Page Schema
export const AboutPageSchema = z.object({
  storyHeading: z.string().min(1, "Story heading is required"),
  storyImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  missionText: z
    .string()
    .min(10, "Mission text must be at least 10 characters"),
  visionText: z.string().min(10, "Vision text must be at least 10 characters"),

  // Values
  values: z
    .array(
      z.object({
        title: z.string().min(1, "Value title is required"),
        description: z
          .string()
          .min(10, "Value description must be at least 10 characters"),
        icon: z.string().min(1, "Icon is required"),
        image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
      })
    )
    .length(4, "Must have exactly 4 values"),

  // Statistics
  statistics: z
    .array(
      z.object({
        value: z.string().min(1, "Statistic value is required"),
        label: z.string().min(1, "Statistic label is required"),
        icon: z.string().min(1, "Icon is required"),
      })
    )
    .length(4, "Must have exactly 4 statistics"),

  // CTA Section
  ctaHeading: z.string().min(1, "CTA heading is required"),
  ctaDescription: z.string().min(1, "CTA description is required"),
  ctaImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type AboutPage = z.infer<typeof AboutPageSchema>;

export const UpdateAboutPageSchema = AboutPageSchema.partial();
export type UpdateAboutPageInput = z.infer<typeof UpdateAboutPageSchema>;

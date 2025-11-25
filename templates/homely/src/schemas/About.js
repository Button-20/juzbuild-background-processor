"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAboutPageSchema = exports.AboutPageSchema = void 0;
const zod_1 = require("zod");
// About Page Schema
exports.AboutPageSchema = zod_1.z.object({
    storyHeading: zod_1.z.string().min(1, "Story heading is required"),
    storyImage: zod_1.z
        .string()
        .url("Must be a valid URL")
        .optional()
        .or(zod_1.z.literal("")),
    missionText: zod_1.z
        .string()
        .min(10, "Mission text must be at least 10 characters"),
    visionText: zod_1.z.string().min(10, "Vision text must be at least 10 characters"),
    // Values
    values: zod_1.z
        .array(zod_1.z.object({
        title: zod_1.z.string().min(1, "Value title is required"),
        description: zod_1.z
            .string()
            .min(10, "Value description must be at least 10 characters"),
        icon: zod_1.z.string().min(1, "Icon is required"),
        image: zod_1.z
            .string()
            .url("Must be a valid URL")
            .optional()
            .or(zod_1.z.literal("")),
    }))
        .length(4, "Must have exactly 4 values"),
    // Statistics
    statistics: zod_1.z
        .array(zod_1.z.object({
        value: zod_1.z.string().min(1, "Statistic value is required"),
        label: zod_1.z.string().min(1, "Statistic label is required"),
        icon: zod_1.z.string().min(1, "Icon is required"),
    }))
        .length(4, "Must have exactly 4 statistics"),
    // CTA Section
    ctaHeading: zod_1.z.string().min(1, "CTA heading is required"),
    ctaDescription: zod_1.z.string().min(1, "CTA description is required"),
    ctaImage: zod_1.z.string().url("Must be a valid URL").optional().or(zod_1.z.literal("")),
    createdAt: zod_1.z.union([zod_1.z.date(), zod_1.z.string()]).optional(),
    updatedAt: zod_1.z.union([zod_1.z.date(), zod_1.z.string()]).optional(),
});
exports.UpdateAboutPageSchema = exports.AboutPageSchema.partial();
//# sourceMappingURL=About.js.map
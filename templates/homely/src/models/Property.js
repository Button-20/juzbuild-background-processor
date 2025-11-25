"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertySchema = exports.propertyImageSchema = void 0;
const zod_1 = require("zod");
exports.propertyImageSchema = zod_1.z.object({
    src: zod_1.z.string().min(1),
    alt: zod_1.z.string().optional(),
    isMain: zod_1.z.boolean().optional(),
});
const coordinatesSchema = zod_1.z.object({
    lat: zod_1.z.number().min(-90).max(90),
    lng: zod_1.z.number().min(-180).max(180),
});
exports.propertySchema = zod_1.z.object({
    _id: zod_1.z.string().optional(),
    name: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    location: zod_1.z.string().min(1),
    price: zod_1.z.number().min(0),
    currency: zod_1.z.enum(["GHS", "USD", "EUR", "GBP", "CAD", "AUD"]).default("USD"),
    propertyType: zod_1.z.string().min(1), // Should be ObjectId string
    status: zod_1.z
        .enum(["for-sale", "for-rent", "sold", "rented"])
        .default("for-sale"),
    beds: zod_1.z.number().min(0),
    baths: zod_1.z.number().min(0),
    area: zod_1.z.number().min(0),
    images: zod_1.z.array(exports.propertyImageSchema).default([]),
    amenities: zod_1.z.array(zod_1.z.string()).default([]),
    features: zod_1.z.array(zod_1.z.string()).default([]),
    coordinates: coordinatesSchema.optional(),
    isActive: zod_1.z.boolean().default(true),
    isFeatured: zod_1.z.boolean().default(false),
    // User/Website association fields
    userId: zod_1.z.string().min(1, "User ID is required"),
    websiteId: zod_1.z.string().optional(), // For future multi-website support
    domain: zod_1.z.string().min(1, "Domain is required"),
    // Timestamps
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
//# sourceMappingURL=Property.js.map
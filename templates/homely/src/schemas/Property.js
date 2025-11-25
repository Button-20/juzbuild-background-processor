"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyFiltersSchema = exports.UpdatePropertySchema = exports.CreatePropertySchema = exports.PropertySchema = void 0;
const mongodb_1 = require("mongodb");
const zod_1 = require("zod");
// Property Image Schema
const PropertyImageSchema = zod_1.z.object({
    src: zod_1.z.string(),
    alt: zod_1.z.string().default(""),
    isMain: zod_1.z.boolean().default(false),
});
// Property Coordinates Schema
const PropertyCoordinatesSchema = zod_1.z.object({
    lat: zod_1.z.number().min(-90).max(90),
    lng: zod_1.z.number().min(-180).max(180),
});
// Property Schema
exports.PropertySchema = zod_1.z.object({
    _id: zod_1.z.instanceof(mongodb_1.ObjectId).optional(),
    name: zod_1.z.string().min(1, "Name is required").trim(),
    slug: zod_1.z.string().min(1, "Slug is required").toLowerCase().trim(),
    description: zod_1.z.string().min(1, "Description is required"),
    location: zod_1.z.string().min(1, "Location is required").trim(),
    price: zod_1.z.number().min(0, "Price must be positive"),
    currency: zod_1.z.enum(["GHS", "USD", "EUR", "GBP", "CAD", "AUD"]).default("GHS"),
    propertyType: zod_1.z.string(), // String reference to ObjectId
    status: zod_1.z
        .enum(["for-sale", "for-rent", "sold", "rented"])
        .default("for-sale"),
    beds: zod_1.z.number().min(0, "Beds must be non-negative"),
    baths: zod_1.z.number().min(0, "Baths must be non-negative"),
    area: zod_1.z.number().min(0, "Area must be positive"),
    images: zod_1.z.array(PropertyImageSchema).default([]),
    amenities: zod_1.z.array(zod_1.z.string().trim()).default([]),
    features: zod_1.z.array(zod_1.z.string().trim()).default([]),
    coordinates: PropertyCoordinatesSchema.optional(),
    isActive: zod_1.z.boolean().default(true),
    isFeatured: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.date().default(() => new Date()),
    updatedAt: zod_1.z.date().default(() => new Date()),
});
// Property input schemas
exports.CreatePropertySchema = exports.PropertySchema.omit({
    _id: true,
    createdAt: true,
    updatedAt: true,
});
exports.UpdatePropertySchema = exports.PropertySchema.omit({
    _id: true,
    createdAt: true,
}).partial();
exports.PropertyFiltersSchema = zod_1.z.object({
    propertyType: zod_1.z.string().optional(),
    status: zod_1.z.enum(["for-sale", "for-rent", "sold", "rented"]).optional(),
    minPrice: zod_1.z.number().min(0).optional(),
    maxPrice: zod_1.z.number().min(0).optional(),
    beds: zod_1.z.number().min(0).optional(),
    baths: zod_1.z.number().min(0).optional(),
    location: zod_1.z.string().optional(),
    isFeatured: zod_1.z.boolean().optional(),
    isActive: zod_1.z.boolean().optional(),
    limit: zod_1.z.number().min(1).max(100).default(10),
    skip: zod_1.z.number().min(0).default(0),
});
//# sourceMappingURL=Property.js.map
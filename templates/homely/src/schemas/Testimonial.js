"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestimonialFiltersSchema = exports.UpdateTestimonialSchema = exports.CreateTestimonialSchema = exports.TestimonialSchema = void 0;
const mongodb_1 = require("mongodb");
const zod_1 = require("zod");
// Testimonial Schema
exports.TestimonialSchema = zod_1.z.object({
    _id: zod_1.z.instanceof(mongodb_1.ObjectId).optional(),
    name: zod_1.z.string().min(1, "Name is required").trim(),
    role: zod_1.z.string().min(1, "Role is required").trim(),
    company: zod_1.z.string().trim().optional(),
    message: zod_1.z.string().min(1, "Message is required").trim(),
    image: zod_1.z.string().min(1, "Image is required"),
    rating: zod_1.z.number().min(1).max(5).default(5),
    isActive: zod_1.z.boolean().default(true),
    order: zod_1.z.number().default(0),
    createdAt: zod_1.z.date().default(() => new Date()),
    updatedAt: zod_1.z.date().default(() => new Date()),
});
// Testimonial input schemas
exports.CreateTestimonialSchema = exports.TestimonialSchema.omit({
    _id: true,
    createdAt: true,
    updatedAt: true,
});
exports.UpdateTestimonialSchema = exports.TestimonialSchema.omit({
    _id: true,
    createdAt: true,
}).partial();
exports.TestimonialFiltersSchema = zod_1.z.object({
    isActive: zod_1.z.boolean().optional(),
    rating: zod_1.z.number().min(1).max(5).optional(),
    limit: zod_1.z.number().min(1).max(100).default(10),
    skip: zod_1.z.number().min(0).default(0),
});
//# sourceMappingURL=Testimonial.js.map
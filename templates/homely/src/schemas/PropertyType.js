"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePropertyTypeSchema = exports.CreatePropertyTypeSchema = exports.PropertyTypeSchema = void 0;
const mongodb_1 = require("mongodb");
const zod_1 = require("zod");
// PropertyType Schema
exports.PropertyTypeSchema = zod_1.z.object({
    _id: zod_1.z.instanceof(mongodb_1.ObjectId).optional(),
    name: zod_1.z.string().min(1, "Name is required").trim(),
    slug: zod_1.z.string().min(1, "Slug is required").toLowerCase().trim(),
    description: zod_1.z.string().min(1, "Description is required").trim(),
    image: zod_1.z.string().min(1, "Image is required"),
    icon: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().default(true),
    createdAt: zod_1.z.date().default(() => new Date()),
    updatedAt: zod_1.z.date().default(() => new Date()),
});
// PropertyType input schemas
exports.CreatePropertyTypeSchema = exports.PropertyTypeSchema.omit({
    _id: true,
    createdAt: true,
    updatedAt: true,
});
exports.UpdatePropertyTypeSchema = exports.PropertyTypeSchema.omit({
    _id: true,
    createdAt: true,
}).partial();
//# sourceMappingURL=PropertyType.js.map
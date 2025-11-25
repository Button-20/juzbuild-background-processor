"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogFiltersSchema = exports.UpdateBlogSchema = exports.CreateBlogSchema = exports.BlogSchema = void 0;
const mongodb_1 = require("mongodb");
const zod_1 = require("zod");
// Blog Schema
exports.BlogSchema = zod_1.z.object({
    _id: zod_1.z.instanceof(mongodb_1.ObjectId).optional(),
    title: zod_1.z
        .string()
        .min(1, "Title is required")
        .max(200, "Title cannot exceed 200 characters")
        .trim(),
    slug: zod_1.z
        .string()
        .min(1, "Slug is required")
        .toLowerCase()
        .trim()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly"),
    excerpt: zod_1.z
        .string()
        .min(1, "Excerpt is required")
        .max(500, "Excerpt cannot exceed 500 characters"),
    content: zod_1.z.string().min(1, "Content is required"),
    coverImage: zod_1.z.string().min(1, "Cover image is required"),
    authorId: zod_1.z.string().min(1, "Author ID is required").trim(),
    tags: zod_1.z.array(zod_1.z.string().trim().toLowerCase()).default([]),
    isPublished: zod_1.z.boolean().default(false),
    publishedAt: zod_1.z.date().nullable().default(null),
    readTime: zod_1.z.number().default(0),
    views: zod_1.z.number().default(0),
    createdAt: zod_1.z.date().default(() => new Date()),
    updatedAt: zod_1.z.date().default(() => new Date()),
});
// Blog input schemas
exports.CreateBlogSchema = exports.BlogSchema.omit({
    _id: true,
    createdAt: true,
    updatedAt: true,
    readTime: true,
    publishedAt: true,
});
exports.UpdateBlogSchema = exports.BlogSchema.omit({
    _id: true,
    createdAt: true,
}).partial();
exports.BlogFiltersSchema = zod_1.z.object({
    isPublished: zod_1.z.boolean().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    limit: zod_1.z.number().min(1).max(100).default(10),
    skip: zod_1.z.number().min(0).default(0),
});
//# sourceMappingURL=Blog.js.map
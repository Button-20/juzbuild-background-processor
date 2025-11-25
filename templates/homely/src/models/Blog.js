"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogSchema = void 0;
const zod_1 = require("zod");
exports.blogSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200),
    slug: zod_1.z
        .string()
        .min(1)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly"),
    excerpt: zod_1.z.string().min(1).max(500),
    content: zod_1.z.string().min(1),
    coverImage: zod_1.z.string().min(1),
    authorId: zod_1.z.string().min(1),
    tags: zod_1.z.array(zod_1.z.string().min(1)),
    isPublished: zod_1.z.boolean().default(false),
    publishedAt: zod_1.z.date().optional().nullable(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
    readTime: zod_1.z.number().int().min(0).optional(),
    views: zod_1.z.number().int().min(0).default(0),
});
//# sourceMappingURL=Blog.js.map
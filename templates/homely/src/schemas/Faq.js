"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqFiltersSchema = exports.UpdateFaqSchema = exports.CreateFaqSchema = exports.FaqSchema = void 0;
const mongodb_1 = require("mongodb");
const zod_1 = require("zod");
// FAQ Schema
exports.FaqSchema = zod_1.z.object({
    _id: zod_1.z.instanceof(mongodb_1.ObjectId).optional(),
    question: zod_1.z.string().min(1, "Question is required").trim(),
    answer: zod_1.z.string().min(1, "Answer is required").trim(),
    category: zod_1.z.string().trim().optional(),
    isActive: zod_1.z.boolean().default(true),
    order: zod_1.z.number().default(0),
    createdAt: zod_1.z.date().default(() => new Date()),
    updatedAt: zod_1.z.date().default(() => new Date()),
});
// FAQ input schemas
exports.CreateFaqSchema = exports.FaqSchema.omit({
    _id: true,
    createdAt: true,
    updatedAt: true,
});
exports.UpdateFaqSchema = exports.FaqSchema.omit({
    _id: true,
    createdAt: true,
}).partial();
exports.FaqFiltersSchema = zod_1.z.object({
    isActive: zod_1.z.boolean().optional(),
    category: zod_1.z.string().optional(),
    limit: zod_1.z.number().min(1).max(100).default(10),
    skip: zod_1.z.number().min(0).default(0),
});
//# sourceMappingURL=Faq.js.map
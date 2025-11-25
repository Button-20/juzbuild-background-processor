"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faqSchema = void 0;
const zod_1 = require("zod");
exports.faqSchema = zod_1.z.object({
    question: zod_1.z.string().min(1),
    answer: zod_1.z.string().min(1),
    category: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().default(true),
    order: zod_1.z.number().default(0),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
//# sourceMappingURL=Faq.js.map
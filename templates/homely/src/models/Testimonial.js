"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testimonialSchema = void 0;
const zod_1 = require("zod");
exports.testimonialSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    role: zod_1.z.string().min(1),
    company: zod_1.z.string().optional(),
    message: zod_1.z.string().min(1),
    image: zod_1.z.string().min(1),
    rating: zod_1.z.number().min(1).max(5).default(5),
    isActive: zod_1.z.boolean().default(true),
    order: zod_1.z.number().default(0),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
//# sourceMappingURL=Testimonial.js.map
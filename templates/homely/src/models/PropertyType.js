"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyTypeSchema = void 0;
const zod_1 = require("zod");
exports.propertyTypeSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    image: zod_1.z.string().min(1),
    icon: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().default(true),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
//# sourceMappingURL=PropertyType.js.map
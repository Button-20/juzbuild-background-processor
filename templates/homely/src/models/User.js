"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).optional(),
    role: zod_1.z.enum(["user"]).default("user"),
    avatar: zod_1.z.string().optional(),
    provider: zod_1.z.enum(["credentials", "google"]).default("credentials"),
    providerId: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().default(true),
    lastLogin: zod_1.z.date().optional(),
    resetPasswordToken: zod_1.z.string().optional(),
    resetPasswordExpires: zod_1.z.date().optional(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
//# sourceMappingURL=User.js.map
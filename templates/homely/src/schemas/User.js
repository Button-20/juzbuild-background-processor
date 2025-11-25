"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordSchema = exports.ForgotPasswordSchema = exports.LoginSchema = exports.UpdateUserSchema = exports.CreateUserSchema = exports.UserSchema = void 0;
const mongodb_1 = require("mongodb");
const zod_1 = require("zod");
// User Schema
exports.UserSchema = zod_1.z.object({
    _id: zod_1.z.instanceof(mongodb_1.ObjectId).optional(),
    name: zod_1.z.string().min(1, "Name is required").trim(),
    email: zod_1.z.string().email("Invalid email").toLowerCase().trim(),
    password: zod_1.z.string().optional(),
    role: zod_1.z.enum(["user"]).default("user"),
    avatar: zod_1.z.string().default(""),
    provider: zod_1.z.enum(["credentials", "google"]).default("credentials"),
    providerId: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().default(true),
    lastLogin: zod_1.z.date().optional(),
    resetPasswordToken: zod_1.z.string().optional(),
    resetPasswordExpires: zod_1.z.date().optional(),
    createdAt: zod_1.z.date().default(() => new Date()),
    updatedAt: zod_1.z.date().default(() => new Date()),
});
// User input schemas
exports.CreateUserSchema = exports.UserSchema.omit({
    _id: true,
    createdAt: true,
    updatedAt: true,
}).extend({
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
exports.UpdateUserSchema = exports.UserSchema.omit({
    _id: true,
    createdAt: true,
}).partial();
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email"),
    password: zod_1.z.string().min(1, "Password is required"),
});
exports.ForgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email"),
});
exports.ResetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, "Token is required"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
//# sourceMappingURL=User.js.map
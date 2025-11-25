import { ObjectId } from "mongodb";
import { z } from "zod";
export declare const UserSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodType<ObjectId, z.ZodTypeDef, ObjectId>>;
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodOptional<z.ZodString>;
    role: z.ZodDefault<z.ZodEnum<["user"]>>;
    avatar: z.ZodDefault<z.ZodString>;
    provider: z.ZodDefault<z.ZodEnum<["credentials", "google"]>>;
    providerId: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    lastLogin: z.ZodOptional<z.ZodDate>;
    resetPasswordToken: z.ZodOptional<z.ZodString>;
    resetPasswordExpires: z.ZodOptional<z.ZodDate>;
    createdAt: z.ZodDefault<z.ZodDate>;
    updatedAt: z.ZodDefault<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    role: "user";
    name: string;
    email: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    avatar: string;
    provider: "credentials" | "google";
    _id?: ObjectId | undefined;
    password?: string | undefined;
    providerId?: string | undefined;
    lastLogin?: Date | undefined;
    resetPasswordToken?: string | undefined;
    resetPasswordExpires?: Date | undefined;
}, {
    name: string;
    email: string;
    role?: "user" | undefined;
    _id?: ObjectId | undefined;
    isActive?: boolean | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    password?: string | undefined;
    avatar?: string | undefined;
    provider?: "credentials" | "google" | undefined;
    providerId?: string | undefined;
    lastLogin?: Date | undefined;
    resetPasswordToken?: string | undefined;
    resetPasswordExpires?: Date | undefined;
}>;
export declare const CreateUserSchema: z.ZodObject<{
    role: z.ZodDefault<z.ZodEnum<["user"]>>;
    name: z.ZodString;
    email: z.ZodString;
    isActive: z.ZodDefault<z.ZodBoolean>;
    avatar: z.ZodDefault<z.ZodString>;
    provider: z.ZodDefault<z.ZodEnum<["credentials", "google"]>>;
    providerId: z.ZodOptional<z.ZodString>;
    lastLogin: z.ZodOptional<z.ZodDate>;
    resetPasswordToken: z.ZodOptional<z.ZodString>;
    resetPasswordExpires: z.ZodOptional<z.ZodDate>;
} & {
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    role: "user";
    name: string;
    email: string;
    isActive: boolean;
    password: string;
    avatar: string;
    provider: "credentials" | "google";
    providerId?: string | undefined;
    lastLogin?: Date | undefined;
    resetPasswordToken?: string | undefined;
    resetPasswordExpires?: Date | undefined;
}, {
    name: string;
    email: string;
    password: string;
    role?: "user" | undefined;
    isActive?: boolean | undefined;
    avatar?: string | undefined;
    provider?: "credentials" | "google" | undefined;
    providerId?: string | undefined;
    lastLogin?: Date | undefined;
    resetPasswordToken?: string | undefined;
    resetPasswordExpires?: Date | undefined;
}>;
export declare const UpdateUserSchema: z.ZodObject<{
    role: z.ZodOptional<z.ZodDefault<z.ZodEnum<["user"]>>>;
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    updatedAt: z.ZodOptional<z.ZodDefault<z.ZodDate>>;
    password: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    avatar: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    provider: z.ZodOptional<z.ZodDefault<z.ZodEnum<["credentials", "google"]>>>;
    providerId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    lastLogin: z.ZodOptional<z.ZodOptional<z.ZodDate>>;
    resetPasswordToken: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    resetPasswordExpires: z.ZodOptional<z.ZodOptional<z.ZodDate>>;
}, "strip", z.ZodTypeAny, {
    role?: "user" | undefined;
    name?: string | undefined;
    email?: string | undefined;
    isActive?: boolean | undefined;
    updatedAt?: Date | undefined;
    password?: string | undefined;
    avatar?: string | undefined;
    provider?: "credentials" | "google" | undefined;
    providerId?: string | undefined;
    lastLogin?: Date | undefined;
    resetPasswordToken?: string | undefined;
    resetPasswordExpires?: Date | undefined;
}, {
    role?: "user" | undefined;
    name?: string | undefined;
    email?: string | undefined;
    isActive?: boolean | undefined;
    updatedAt?: Date | undefined;
    password?: string | undefined;
    avatar?: string | undefined;
    provider?: "credentials" | "google" | undefined;
    providerId?: string | undefined;
    lastLogin?: Date | undefined;
    resetPasswordToken?: string | undefined;
    resetPasswordExpires?: Date | undefined;
}>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const ForgotPasswordSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export declare const ResetPasswordSchema: z.ZodObject<{
    token: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
    password: string;
}, {
    token: string;
    password: string;
}>;
export type User = z.infer<typeof UserSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
//# sourceMappingURL=User.d.ts.map
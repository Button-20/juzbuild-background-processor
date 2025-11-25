import { z } from "zod";
export declare const userSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodOptional<z.ZodString>;
    role: z.ZodDefault<z.ZodEnum<["user"]>>;
    avatar: z.ZodOptional<z.ZodString>;
    provider: z.ZodDefault<z.ZodEnum<["credentials", "google"]>>;
    providerId: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    lastLogin: z.ZodOptional<z.ZodDate>;
    resetPasswordToken: z.ZodOptional<z.ZodString>;
    resetPasswordExpires: z.ZodOptional<z.ZodDate>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    role: "user";
    name: string;
    email: string;
    isActive: boolean;
    provider: "credentials" | "google";
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    password?: string | undefined;
    avatar?: string | undefined;
    providerId?: string | undefined;
    lastLogin?: Date | undefined;
    resetPasswordToken?: string | undefined;
    resetPasswordExpires?: Date | undefined;
}, {
    name: string;
    email: string;
    role?: "user" | undefined;
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
export type User = z.infer<typeof userSchema>;
//# sourceMappingURL=User.d.ts.map
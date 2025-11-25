import { ObjectId } from "mongodb";
import { z } from "zod";
export declare const PropertyTypeSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodType<ObjectId, z.ZodTypeDef, ObjectId>>;
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodString;
    image: z.ZodString;
    icon: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodDefault<z.ZodDate>;
    updatedAt: z.ZodDefault<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    slug: string;
    image: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _id?: ObjectId | undefined;
    icon?: string | undefined;
}, {
    name: string;
    description: string;
    slug: string;
    image: string;
    _id?: ObjectId | undefined;
    icon?: string | undefined;
    isActive?: boolean | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}>;
export declare const CreatePropertyTypeSchema: z.ZodObject<Omit<{
    _id: z.ZodOptional<z.ZodType<ObjectId, z.ZodTypeDef, ObjectId>>;
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodString;
    image: z.ZodString;
    icon: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodDefault<z.ZodDate>;
    updatedAt: z.ZodDefault<z.ZodDate>;
}, "_id" | "createdAt" | "updatedAt">, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    slug: string;
    image: string;
    isActive: boolean;
    icon?: string | undefined;
}, {
    name: string;
    description: string;
    slug: string;
    image: string;
    icon?: string | undefined;
    isActive?: boolean | undefined;
}>;
export declare const UpdatePropertyTypeSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    image: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    updatedAt: z.ZodOptional<z.ZodDefault<z.ZodDate>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    icon?: string | undefined;
    image?: string | undefined;
    isActive?: boolean | undefined;
    updatedAt?: Date | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    icon?: string | undefined;
    image?: string | undefined;
    isActive?: boolean | undefined;
    updatedAt?: Date | undefined;
}>;
export type PropertyType = z.infer<typeof PropertyTypeSchema>;
export type CreatePropertyTypeInput = z.infer<typeof CreatePropertyTypeSchema>;
export type UpdatePropertyTypeInput = z.infer<typeof UpdatePropertyTypeSchema>;
//# sourceMappingURL=PropertyType.d.ts.map
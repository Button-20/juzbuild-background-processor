import { z } from "zod";
export declare const propertyTypeSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodString;
    image: z.ZodString;
    icon: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    slug: string;
    image: string;
    isActive: boolean;
    icon?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}, {
    name: string;
    description: string;
    slug: string;
    image: string;
    icon?: string | undefined;
    isActive?: boolean | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}>;
export type PropertyType = z.infer<typeof propertyTypeSchema>;
//# sourceMappingURL=PropertyType.d.ts.map
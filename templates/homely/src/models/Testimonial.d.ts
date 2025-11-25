import { z } from "zod";
export declare const testimonialSchema: z.ZodObject<{
    name: z.ZodString;
    role: z.ZodString;
    company: z.ZodOptional<z.ZodString>;
    message: z.ZodString;
    image: z.ZodString;
    rating: z.ZodDefault<z.ZodNumber>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    order: z.ZodDefault<z.ZodNumber>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    role: string;
    name: string;
    message: string;
    image: string;
    isActive: boolean;
    order: number;
    rating: number;
    company?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}, {
    role: string;
    name: string;
    message: string;
    image: string;
    company?: string | undefined;
    isActive?: boolean | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    order?: number | undefined;
    rating?: number | undefined;
}>;
export type Testimonial = z.infer<typeof testimonialSchema>;
//# sourceMappingURL=Testimonial.d.ts.map
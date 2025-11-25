import { ObjectId } from "mongodb";
import { z } from "zod";
export declare const TestimonialSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodType<ObjectId, z.ZodTypeDef, ObjectId>>;
    name: z.ZodString;
    role: z.ZodString;
    company: z.ZodOptional<z.ZodString>;
    message: z.ZodString;
    image: z.ZodString;
    rating: z.ZodDefault<z.ZodNumber>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    order: z.ZodDefault<z.ZodNumber>;
    createdAt: z.ZodDefault<z.ZodDate>;
    updatedAt: z.ZodDefault<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    role: string;
    name: string;
    message: string;
    image: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    order: number;
    rating: number;
    _id?: ObjectId | undefined;
    company?: string | undefined;
}, {
    role: string;
    name: string;
    message: string;
    image: string;
    _id?: ObjectId | undefined;
    company?: string | undefined;
    isActive?: boolean | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    order?: number | undefined;
    rating?: number | undefined;
}>;
export declare const CreateTestimonialSchema: z.ZodObject<Omit<{
    _id: z.ZodOptional<z.ZodType<ObjectId, z.ZodTypeDef, ObjectId>>;
    name: z.ZodString;
    role: z.ZodString;
    company: z.ZodOptional<z.ZodString>;
    message: z.ZodString;
    image: z.ZodString;
    rating: z.ZodDefault<z.ZodNumber>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    order: z.ZodDefault<z.ZodNumber>;
    createdAt: z.ZodDefault<z.ZodDate>;
    updatedAt: z.ZodDefault<z.ZodDate>;
}, "_id" | "createdAt" | "updatedAt">, "strip", z.ZodTypeAny, {
    role: string;
    name: string;
    message: string;
    image: string;
    isActive: boolean;
    order: number;
    rating: number;
    company?: string | undefined;
}, {
    role: string;
    name: string;
    message: string;
    image: string;
    company?: string | undefined;
    isActive?: boolean | undefined;
    order?: number | undefined;
    rating?: number | undefined;
}>;
export declare const UpdateTestimonialSchema: z.ZodObject<{
    role: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
    company: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    image: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    updatedAt: z.ZodOptional<z.ZodDefault<z.ZodDate>>;
    order: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    rating: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    role?: string | undefined;
    name?: string | undefined;
    message?: string | undefined;
    company?: string | undefined;
    image?: string | undefined;
    isActive?: boolean | undefined;
    updatedAt?: Date | undefined;
    order?: number | undefined;
    rating?: number | undefined;
}, {
    role?: string | undefined;
    name?: string | undefined;
    message?: string | undefined;
    company?: string | undefined;
    image?: string | undefined;
    isActive?: boolean | undefined;
    updatedAt?: Date | undefined;
    order?: number | undefined;
    rating?: number | undefined;
}>;
export declare const TestimonialFiltersSchema: z.ZodObject<{
    isActive: z.ZodOptional<z.ZodBoolean>;
    rating: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    skip: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    skip: number;
    isActive?: boolean | undefined;
    rating?: number | undefined;
}, {
    limit?: number | undefined;
    isActive?: boolean | undefined;
    rating?: number | undefined;
    skip?: number | undefined;
}>;
export type Testimonial = z.infer<typeof TestimonialSchema>;
export type CreateTestimonialInput = z.infer<typeof CreateTestimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof UpdateTestimonialSchema>;
export type TestimonialFilters = z.infer<typeof TestimonialFiltersSchema>;
//# sourceMappingURL=Testimonial.d.ts.map
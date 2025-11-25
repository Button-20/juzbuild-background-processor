import { ObjectId } from "mongodb";
import { z } from "zod";
export declare const FaqSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodType<ObjectId, z.ZodTypeDef, ObjectId>>;
    question: z.ZodString;
    answer: z.ZodString;
    category: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    order: z.ZodDefault<z.ZodNumber>;
    createdAt: z.ZodDefault<z.ZodDate>;
    updatedAt: z.ZodDefault<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    question: string;
    answer: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    order: number;
    _id?: ObjectId | undefined;
    category?: string | undefined;
}, {
    question: string;
    answer: string;
    _id?: ObjectId | undefined;
    isActive?: boolean | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    category?: string | undefined;
    order?: number | undefined;
}>;
export declare const CreateFaqSchema: z.ZodObject<Omit<{
    _id: z.ZodOptional<z.ZodType<ObjectId, z.ZodTypeDef, ObjectId>>;
    question: z.ZodString;
    answer: z.ZodString;
    category: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    order: z.ZodDefault<z.ZodNumber>;
    createdAt: z.ZodDefault<z.ZodDate>;
    updatedAt: z.ZodDefault<z.ZodDate>;
}, "_id" | "createdAt" | "updatedAt">, "strip", z.ZodTypeAny, {
    question: string;
    answer: string;
    isActive: boolean;
    order: number;
    category?: string | undefined;
}, {
    question: string;
    answer: string;
    isActive?: boolean | undefined;
    category?: string | undefined;
    order?: number | undefined;
}>;
export declare const UpdateFaqSchema: z.ZodObject<{
    question: z.ZodOptional<z.ZodString>;
    answer: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    updatedAt: z.ZodOptional<z.ZodDefault<z.ZodDate>>;
    category: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    order: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    question?: string | undefined;
    answer?: string | undefined;
    isActive?: boolean | undefined;
    updatedAt?: Date | undefined;
    category?: string | undefined;
    order?: number | undefined;
}, {
    question?: string | undefined;
    answer?: string | undefined;
    isActive?: boolean | undefined;
    updatedAt?: Date | undefined;
    category?: string | undefined;
    order?: number | undefined;
}>;
export declare const FaqFiltersSchema: z.ZodObject<{
    isActive: z.ZodOptional<z.ZodBoolean>;
    category: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    skip: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    skip: number;
    isActive?: boolean | undefined;
    category?: string | undefined;
}, {
    limit?: number | undefined;
    isActive?: boolean | undefined;
    category?: string | undefined;
    skip?: number | undefined;
}>;
export type Faq = z.infer<typeof FaqSchema>;
export type CreateFaqInput = z.infer<typeof CreateFaqSchema>;
export type UpdateFaqInput = z.infer<typeof UpdateFaqSchema>;
export type FaqFilters = z.infer<typeof FaqFiltersSchema>;
//# sourceMappingURL=Faq.d.ts.map
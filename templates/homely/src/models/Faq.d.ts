import { z } from "zod";
export declare const faqSchema: z.ZodObject<{
    question: z.ZodString;
    answer: z.ZodString;
    category: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    order: z.ZodDefault<z.ZodNumber>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    question: string;
    answer: string;
    isActive: boolean;
    order: number;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    category?: string | undefined;
}, {
    question: string;
    answer: string;
    isActive?: boolean | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    category?: string | undefined;
    order?: number | undefined;
}>;
export type Faq = z.infer<typeof faqSchema>;
//# sourceMappingURL=Faq.d.ts.map
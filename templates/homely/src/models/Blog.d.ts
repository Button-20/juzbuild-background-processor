import { z } from "zod";
export declare const blogSchema: z.ZodObject<{
    title: z.ZodString;
    slug: z.ZodString;
    excerpt: z.ZodString;
    content: z.ZodString;
    coverImage: z.ZodString;
    authorId: z.ZodString;
    tags: z.ZodArray<z.ZodString, "many">;
    isPublished: z.ZodDefault<z.ZodBoolean>;
    publishedAt: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
    readTime: z.ZodOptional<z.ZodNumber>;
    views: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    tags: string[];
    title: string;
    content: string;
    slug: string;
    coverImage: string;
    excerpt: string;
    authorId: string;
    isPublished: boolean;
    views: number;
    createdAt?: Date | undefined;
    readTime?: number | undefined;
    updatedAt?: Date | undefined;
    publishedAt?: Date | null | undefined;
}, {
    tags: string[];
    title: string;
    content: string;
    slug: string;
    coverImage: string;
    excerpt: string;
    authorId: string;
    createdAt?: Date | undefined;
    readTime?: number | undefined;
    updatedAt?: Date | undefined;
    isPublished?: boolean | undefined;
    publishedAt?: Date | null | undefined;
    views?: number | undefined;
}>;
export type Blog = z.infer<typeof blogSchema>;
//# sourceMappingURL=Blog.d.ts.map
import { z } from "zod";
export declare const AboutPageSchema: z.ZodObject<{
    storyHeading: z.ZodString;
    storyImage: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    missionText: z.ZodString;
    visionText: z.ZodString;
    values: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        icon: z.ZodString;
        image: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        description: string;
        icon: string;
        image?: string | undefined;
    }, {
        title: string;
        description: string;
        icon: string;
        image?: string | undefined;
    }>, "many">;
    statistics: z.ZodArray<z.ZodObject<{
        value: z.ZodString;
        label: z.ZodString;
        icon: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        icon: string;
        label: string;
    }, {
        value: string;
        icon: string;
        label: string;
    }>, "many">;
    ctaHeading: z.ZodString;
    ctaDescription: z.ZodString;
    ctaImage: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    createdAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    updatedAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
}, "strip", z.ZodTypeAny, {
    values: {
        title: string;
        description: string;
        icon: string;
        image?: string | undefined;
    }[];
    storyHeading: string;
    missionText: string;
    visionText: string;
    statistics: {
        value: string;
        icon: string;
        label: string;
    }[];
    ctaHeading: string;
    ctaDescription: string;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
    storyImage?: string | undefined;
    ctaImage?: string | undefined;
}, {
    values: {
        title: string;
        description: string;
        icon: string;
        image?: string | undefined;
    }[];
    storyHeading: string;
    missionText: string;
    visionText: string;
    statistics: {
        value: string;
        icon: string;
        label: string;
    }[];
    ctaHeading: string;
    ctaDescription: string;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
    storyImage?: string | undefined;
    ctaImage?: string | undefined;
}>;
export type AboutPage = z.infer<typeof AboutPageSchema>;
export declare const UpdateAboutPageSchema: z.ZodObject<{
    storyHeading: z.ZodOptional<z.ZodString>;
    storyImage: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    missionText: z.ZodOptional<z.ZodString>;
    visionText: z.ZodOptional<z.ZodString>;
    values: z.ZodOptional<z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        icon: z.ZodString;
        image: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        description: string;
        icon: string;
        image?: string | undefined;
    }, {
        title: string;
        description: string;
        icon: string;
        image?: string | undefined;
    }>, "many">>;
    statistics: z.ZodOptional<z.ZodArray<z.ZodObject<{
        value: z.ZodString;
        label: z.ZodString;
        icon: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        icon: string;
        label: string;
    }, {
        value: string;
        icon: string;
        label: string;
    }>, "many">>;
    ctaHeading: z.ZodOptional<z.ZodString>;
    ctaDescription: z.ZodOptional<z.ZodString>;
    ctaImage: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    createdAt: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>>;
    updatedAt: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>>;
}, "strip", z.ZodTypeAny, {
    values?: {
        title: string;
        description: string;
        icon: string;
        image?: string | undefined;
    }[] | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
    storyHeading?: string | undefined;
    storyImage?: string | undefined;
    missionText?: string | undefined;
    visionText?: string | undefined;
    statistics?: {
        value: string;
        icon: string;
        label: string;
    }[] | undefined;
    ctaHeading?: string | undefined;
    ctaDescription?: string | undefined;
    ctaImage?: string | undefined;
}, {
    values?: {
        title: string;
        description: string;
        icon: string;
        image?: string | undefined;
    }[] | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
    storyHeading?: string | undefined;
    storyImage?: string | undefined;
    missionText?: string | undefined;
    visionText?: string | undefined;
    statistics?: {
        value: string;
        icon: string;
        label: string;
    }[] | undefined;
    ctaHeading?: string | undefined;
    ctaDescription?: string | undefined;
    ctaImage?: string | undefined;
}>;
export type UpdateAboutPageInput = z.infer<typeof UpdateAboutPageSchema>;
//# sourceMappingURL=About.d.ts.map
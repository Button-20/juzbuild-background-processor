import { z } from "zod";
export declare const propertyImageSchema: z.ZodObject<{
    src: z.ZodString;
    alt: z.ZodOptional<z.ZodString>;
    isMain: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    src: string;
    alt?: string | undefined;
    isMain?: boolean | undefined;
}, {
    src: string;
    alt?: string | undefined;
    isMain?: boolean | undefined;
}>;
export declare const propertySchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodString;
    location: z.ZodString;
    price: z.ZodNumber;
    currency: z.ZodDefault<z.ZodEnum<["GHS", "USD", "EUR", "GBP", "CAD", "AUD"]>>;
    propertyType: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["for-sale", "for-rent", "sold", "rented"]>>;
    beds: z.ZodNumber;
    baths: z.ZodNumber;
    area: z.ZodNumber;
    images: z.ZodDefault<z.ZodArray<z.ZodObject<{
        src: z.ZodString;
        alt: z.ZodOptional<z.ZodString>;
        isMain: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        src: string;
        alt?: string | undefined;
        isMain?: boolean | undefined;
    }, {
        src: string;
        alt?: string | undefined;
        isMain?: boolean | undefined;
    }>, "many">>;
    amenities: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    features: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    coordinates: z.ZodOptional<z.ZodObject<{
        lat: z.ZodNumber;
        lng: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        lat: number;
        lng: number;
    }, {
        lat: number;
        lng: number;
    }>>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    isFeatured: z.ZodDefault<z.ZodBoolean>;
    userId: z.ZodString;
    websiteId: z.ZodOptional<z.ZodString>;
    domain: z.ZodString;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    name: string;
    status: "for-sale" | "for-rent" | "sold" | "rented";
    domain: string;
    userId: string;
    description: string;
    slug: string;
    currency: "USD" | "GHS" | "EUR" | "GBP" | "CAD" | "AUD";
    isActive: boolean;
    propertyType: string;
    location: string;
    price: number;
    beds: number;
    baths: number;
    area: number;
    images: {
        src: string;
        alt?: string | undefined;
        isMain?: boolean | undefined;
    }[];
    amenities: string[];
    features: string[];
    isFeatured: boolean;
    _id?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    coordinates?: {
        lat: number;
        lng: number;
    } | undefined;
    websiteId?: string | undefined;
}, {
    name: string;
    domain: string;
    userId: string;
    description: string;
    slug: string;
    propertyType: string;
    location: string;
    price: number;
    beds: number;
    baths: number;
    area: number;
    status?: "for-sale" | "for-rent" | "sold" | "rented" | undefined;
    _id?: string | undefined;
    currency?: "USD" | "GHS" | "EUR" | "GBP" | "CAD" | "AUD" | undefined;
    isActive?: boolean | undefined;
    images?: {
        src: string;
        alt?: string | undefined;
        isMain?: boolean | undefined;
    }[] | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    amenities?: string[] | undefined;
    features?: string[] | undefined;
    coordinates?: {
        lat: number;
        lng: number;
    } | undefined;
    isFeatured?: boolean | undefined;
    websiteId?: string | undefined;
}>;
export type Property = z.infer<typeof propertySchema>;
//# sourceMappingURL=Property.d.ts.map
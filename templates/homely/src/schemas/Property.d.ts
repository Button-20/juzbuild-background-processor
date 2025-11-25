import { ObjectId } from "mongodb";
import { z } from "zod";
declare const PropertyImageSchema: z.ZodObject<{
    src: z.ZodString;
    alt: z.ZodDefault<z.ZodString>;
    isMain: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    src: string;
    alt: string;
    isMain: boolean;
}, {
    src: string;
    alt?: string | undefined;
    isMain?: boolean | undefined;
}>;
declare const PropertyCoordinatesSchema: z.ZodObject<{
    lat: z.ZodNumber;
    lng: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    lat: number;
    lng: number;
}, {
    lat: number;
    lng: number;
}>;
export declare const PropertySchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodType<ObjectId, z.ZodTypeDef, ObjectId>>;
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
        alt: z.ZodDefault<z.ZodString>;
        isMain: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        src: string;
        alt: string;
        isMain: boolean;
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
    createdAt: z.ZodDefault<z.ZodDate>;
    updatedAt: z.ZodDefault<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    name: string;
    status: "for-sale" | "for-rent" | "sold" | "rented";
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
        alt: string;
        isMain: boolean;
    }[];
    createdAt: Date;
    updatedAt: Date;
    amenities: string[];
    features: string[];
    isFeatured: boolean;
    _id?: ObjectId | undefined;
    coordinates?: {
        lat: number;
        lng: number;
    } | undefined;
}, {
    name: string;
    description: string;
    slug: string;
    propertyType: string;
    location: string;
    price: number;
    beds: number;
    baths: number;
    area: number;
    status?: "for-sale" | "for-rent" | "sold" | "rented" | undefined;
    _id?: ObjectId | undefined;
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
}>;
export declare const CreatePropertySchema: z.ZodObject<Omit<{
    _id: z.ZodOptional<z.ZodType<ObjectId, z.ZodTypeDef, ObjectId>>;
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
        alt: z.ZodDefault<z.ZodString>;
        isMain: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        src: string;
        alt: string;
        isMain: boolean;
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
    createdAt: z.ZodDefault<z.ZodDate>;
    updatedAt: z.ZodDefault<z.ZodDate>;
}, "_id" | "createdAt" | "updatedAt">, "strip", z.ZodTypeAny, {
    name: string;
    status: "for-sale" | "for-rent" | "sold" | "rented";
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
        alt: string;
        isMain: boolean;
    }[];
    amenities: string[];
    features: string[];
    isFeatured: boolean;
    coordinates?: {
        lat: number;
        lng: number;
    } | undefined;
}, {
    name: string;
    description: string;
    slug: string;
    propertyType: string;
    location: string;
    price: number;
    beds: number;
    baths: number;
    area: number;
    status?: "for-sale" | "for-rent" | "sold" | "rented" | undefined;
    currency?: "USD" | "GHS" | "EUR" | "GBP" | "CAD" | "AUD" | undefined;
    isActive?: boolean | undefined;
    images?: {
        src: string;
        alt?: string | undefined;
        isMain?: boolean | undefined;
    }[] | undefined;
    amenities?: string[] | undefined;
    features?: string[] | undefined;
    coordinates?: {
        lat: number;
        lng: number;
    } | undefined;
    isFeatured?: boolean | undefined;
}>;
export declare const UpdatePropertySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["for-sale", "for-rent", "sold", "rented"]>>>;
    description: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    currency: z.ZodOptional<z.ZodDefault<z.ZodEnum<["GHS", "USD", "EUR", "GBP", "CAD", "AUD"]>>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    propertyType: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    beds: z.ZodOptional<z.ZodNumber>;
    baths: z.ZodOptional<z.ZodNumber>;
    area: z.ZodOptional<z.ZodNumber>;
    images: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodObject<{
        src: z.ZodString;
        alt: z.ZodDefault<z.ZodString>;
        isMain: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        src: string;
        alt: string;
        isMain: boolean;
    }, {
        src: string;
        alt?: string | undefined;
        isMain?: boolean | undefined;
    }>, "many">>>;
    updatedAt: z.ZodOptional<z.ZodDefault<z.ZodDate>>;
    amenities: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    features: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    coordinates: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        lat: z.ZodNumber;
        lng: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        lat: number;
        lng: number;
    }, {
        lat: number;
        lng: number;
    }>>>;
    isFeatured: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    status?: "for-sale" | "for-rent" | "sold" | "rented" | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    currency?: "USD" | "GHS" | "EUR" | "GBP" | "CAD" | "AUD" | undefined;
    isActive?: boolean | undefined;
    propertyType?: string | undefined;
    location?: string | undefined;
    price?: number | undefined;
    beds?: number | undefined;
    baths?: number | undefined;
    area?: number | undefined;
    images?: {
        src: string;
        alt: string;
        isMain: boolean;
    }[] | undefined;
    updatedAt?: Date | undefined;
    amenities?: string[] | undefined;
    features?: string[] | undefined;
    coordinates?: {
        lat: number;
        lng: number;
    } | undefined;
    isFeatured?: boolean | undefined;
}, {
    name?: string | undefined;
    status?: "for-sale" | "for-rent" | "sold" | "rented" | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    currency?: "USD" | "GHS" | "EUR" | "GBP" | "CAD" | "AUD" | undefined;
    isActive?: boolean | undefined;
    propertyType?: string | undefined;
    location?: string | undefined;
    price?: number | undefined;
    beds?: number | undefined;
    baths?: number | undefined;
    area?: number | undefined;
    images?: {
        src: string;
        alt?: string | undefined;
        isMain?: boolean | undefined;
    }[] | undefined;
    updatedAt?: Date | undefined;
    amenities?: string[] | undefined;
    features?: string[] | undefined;
    coordinates?: {
        lat: number;
        lng: number;
    } | undefined;
    isFeatured?: boolean | undefined;
}>;
export declare const PropertyFiltersSchema: z.ZodObject<{
    propertyType: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["for-sale", "for-rent", "sold", "rented"]>>;
    minPrice: z.ZodOptional<z.ZodNumber>;
    maxPrice: z.ZodOptional<z.ZodNumber>;
    beds: z.ZodOptional<z.ZodNumber>;
    baths: z.ZodOptional<z.ZodNumber>;
    location: z.ZodOptional<z.ZodString>;
    isFeatured: z.ZodOptional<z.ZodBoolean>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    limit: z.ZodDefault<z.ZodNumber>;
    skip: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    skip: number;
    status?: "for-sale" | "for-rent" | "sold" | "rented" | undefined;
    isActive?: boolean | undefined;
    propertyType?: string | undefined;
    location?: string | undefined;
    beds?: number | undefined;
    baths?: number | undefined;
    isFeatured?: boolean | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
}, {
    status?: "for-sale" | "for-rent" | "sold" | "rented" | undefined;
    limit?: number | undefined;
    isActive?: boolean | undefined;
    propertyType?: string | undefined;
    location?: string | undefined;
    beds?: number | undefined;
    baths?: number | undefined;
    isFeatured?: boolean | undefined;
    skip?: number | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
}>;
export type Property = z.infer<typeof PropertySchema>;
export type CreatePropertyInput = z.infer<typeof CreatePropertySchema>;
export type UpdatePropertyInput = z.infer<typeof UpdatePropertySchema>;
export type PropertyFilters = z.infer<typeof PropertyFiltersSchema>;
export type PropertyImage = z.infer<typeof PropertyImageSchema>;
export type PropertyCoordinates = z.infer<typeof PropertyCoordinatesSchema>;
export {};
//# sourceMappingURL=Property.d.ts.map
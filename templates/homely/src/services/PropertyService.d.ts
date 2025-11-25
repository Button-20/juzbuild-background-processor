import { CreatePropertyInput, Property, PropertyFilters, UpdatePropertyInput } from "@/schemas/Property";
export declare class PropertyService {
    private static getCollection;
    static create(data: CreatePropertyInput): Promise<Property>;
    static findById(id: string): Promise<Property | null>;
    static findBySlug(slug: string): Promise<Property | null>;
    static update(id: string, data: UpdatePropertyInput): Promise<Property | null>;
    static delete(id: string): Promise<boolean>;
    static findAll(filters?: Partial<PropertyFilters>): Promise<{
        properties: Property[];
        total: number;
    }>;
    static findFeatured(limit?: number): Promise<Property[]>;
    static findByPropertyType(propertyTypeId: string, limit?: number): Promise<Property[]>;
    static getStats(): Promise<{
        total: number;
        forSale: number;
        forRent: number;
        sold: number;
        rented: number;
        featured: number;
    }>;
    static toggleFeatured(id: string): Promise<Property | null>;
    static toggleActive(id: string): Promise<Property | null>;
}
//# sourceMappingURL=PropertyService.d.ts.map
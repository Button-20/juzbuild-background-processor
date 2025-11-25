import { CreatePropertyTypeInput, PropertyType, UpdatePropertyTypeInput } from "@/schemas/PropertyType";
export declare class PropertyTypeService {
    private static getCollection;
    static create(data: CreatePropertyTypeInput): Promise<PropertyType>;
    static findById(id: string): Promise<PropertyType | null>;
    static findBySlug(slug: string): Promise<PropertyType | null>;
    static update(id: string, data: UpdatePropertyTypeInput): Promise<PropertyType | null>;
    static delete(id: string): Promise<boolean>;
    static findAll(options?: {
        limit?: number;
        skip?: number;
        filter?: Record<string, any>;
    }): Promise<{
        propertyTypes: PropertyType[];
        total: number;
    }>;
    static findActive(): Promise<PropertyType[]>;
    static toggleActive(id: string): Promise<PropertyType | null>;
    static getStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
    }>;
}
//# sourceMappingURL=PropertyTypeService.d.ts.map
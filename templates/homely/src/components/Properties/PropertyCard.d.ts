import { PropertyType } from "@/types/propertyType";
interface PropertyCardProps {
    property: {
        _id?: string;
        name: string;
        slug: string;
        location: string;
        price?: number;
        currency?: string;
        propertyType?: PropertyType | string;
        status?: string;
        beds: number;
        baths: number;
        area: number;
        images: Array<{
            src: string;
            alt?: string;
            isMain?: boolean;
        }>;
        isFeatured?: boolean;
    };
}
export default function PropertyCard({ property }: PropertyCardProps): any;
export {};
//# sourceMappingURL=PropertyCard.d.ts.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const services_1 = require("@/services");
const server_1 = require("next/server");
async function GET() {
    try {
        // Fetch featured properties
        const featuredProperties = await services_1.PropertyService.findFeatured(1);
        if (!featuredProperties || featuredProperties.length === 0) {
            return server_1.NextResponse.json({
                property: null,
                message: "No featured property found",
            });
        }
        const featuredProperty = featuredProperties[0];
        // Get property type data for URL-friendly slug
        const propertyTypeData = await services_1.PropertyTypeService.findById(String(featuredProperty.propertyType));
        // Transform the data
        const transformedProperty = {
            ...featuredProperty,
            _id: featuredProperty._id?.toString(),
            propertyType: propertyTypeData?.slug || String(featuredProperty.propertyType),
        };
        return server_1.NextResponse.json({
            property: transformedProperty,
        });
    }
    catch (error) {
        console.error("Featured property GET error:", error);
        return server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map
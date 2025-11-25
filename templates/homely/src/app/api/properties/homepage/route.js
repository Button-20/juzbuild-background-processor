"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const services_1 = require("@/services");
const server_1 = require("next/server");
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "6");
        const featured = searchParams.get("featured");
        let properties;
        // If featured parameter is specified, get featured properties
        if (featured === "true") {
            properties = await services_1.PropertyService.findFeatured(limit);
        }
        else {
            // Get all properties with limit
            const result = await services_1.PropertyService.findAll({
                limit,
                skip: 0,
            });
            properties = result.properties;
        }
        // Get property types for URL-friendly slugs
        const propertyTypeIds = Array.from(new Set(properties.map((p) => String(p.propertyType))));
        const propertyTypes = await Promise.all(propertyTypeIds.map((id) => services_1.PropertyTypeService.findById(id)));
        const propertyTypeMap = new Map(propertyTypes.filter(Boolean).map((pt) => [pt._id.toString(), pt]));
        // Transform the data
        const transformedProperties = properties.map((property) => {
            const propertyTypeData = propertyTypeMap.get(String(property.propertyType));
            return {
                ...property,
                _id: property._id?.toString(),
                propertyType: propertyTypeData?.slug || String(property.propertyType),
            };
        });
        return server_1.NextResponse.json({
            properties: transformedProperties,
            total: transformedProperties.length,
        });
    }
    catch (error) {
        console.error("Homepage properties GET error:", error);
        return server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map
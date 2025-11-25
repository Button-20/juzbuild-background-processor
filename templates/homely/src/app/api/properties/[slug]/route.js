"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const services_1 = require("@/services");
const server_1 = require("next/server");
async function GET(request, { params }) {
    try {
        const { slug } = await params;
        if (!slug) {
            return server_1.NextResponse.json({ error: "Property slug is required" }, { status: 400 });
        }
        // Find the property by slug
        const property = await services_1.PropertyService.findBySlug(slug);
        if (!property) {
            return server_1.NextResponse.json({ error: "Property not found" }, { status: 404 });
        }
        // Get property type data for URL-friendly slug
        const propertyTypeData = await services_1.PropertyTypeService.findById(String(property.propertyType));
        // Transform the data to match the expected format
        const transformedProperty = {
            ...property,
            _id: property._id?.toString(),
            propertyType: propertyTypeData?.slug || String(property.propertyType),
        };
        return server_1.NextResponse.json(transformedProperty);
    }
    catch (error) {
        console.error("Error fetching property:", error);
        return server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map
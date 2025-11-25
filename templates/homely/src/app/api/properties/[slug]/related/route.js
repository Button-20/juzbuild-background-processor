"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const mongodb_1 = __importDefault(require("@/lib/mongodb"));
const services_1 = require("@/services");
const mongodb_2 = require("mongodb");
const server_1 = require("next/server");
async function GET(request, { params }) {
    try {
        const { slug } = await params;
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "4");
        if (!slug) {
            return server_1.NextResponse.json({ error: "Property slug is required" }, { status: 400 });
        }
        // First, get the current property to find its type
        const currentProperty = await services_1.PropertyService.findBySlug(slug);
        if (!currentProperty) {
            return server_1.NextResponse.json({ error: "Property not found" }, { status: 404 });
        }
        // Find related properties with same property type, excluding current property
        const { db } = await (0, mongodb_1.default)();
        const collection = db.collection("properties");
        const relatedProperties = await collection
            .find({
            propertyType: currentProperty.propertyType,
            isActive: true,
            _id: { $ne: new mongodb_2.ObjectId(currentProperty._id?.toString()) }, // Exclude current property
        })
            .sort({ isFeatured: -1, createdAt: -1 })
            .limit(limit)
            .toArray();
        // Get property types for URL-friendly slugs
        const propertyTypeIds = Array.from(new Set(relatedProperties.map((p) => String(p.propertyType))));
        const propertyTypes = await Promise.all(propertyTypeIds.map((id) => services_1.PropertyTypeService.findById(id)));
        const propertyTypeMap = new Map(propertyTypes.filter(Boolean).map((pt) => [pt._id.toString(), pt]));
        // Transform the data
        const transformedProperties = relatedProperties.map((property) => {
            const propertyTypeData = propertyTypeMap.get(String(property.propertyType));
            return {
                ...property,
                _id: property._id.toString(),
                propertyType: propertyTypeData?.slug || String(property.propertyType),
            };
        });
        return server_1.NextResponse.json(transformedProperties);
    }
    catch (error) {
        console.error("Error fetching related properties:", error);
        return server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map
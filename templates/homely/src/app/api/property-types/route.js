"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const services_1 = require("@/services");
const server_1 = require("next/server");
async function GET() {
    try {
        // Get all property types
        const { propertyTypes } = await services_1.PropertyTypeService.findAll({
            limit: 1000, // Get all property types
        });
        // Get property counts for each type
        const propertyTypesWithCounts = await Promise.all(propertyTypes.map(async (type) => {
            const { total } = await services_1.PropertyService.findAll({
                propertyType: type._id.toString(),
                isActive: true,
                limit: 1,
            });
            return {
                ...type,
                _id: type._id.toString(),
                propertyCount: total,
            };
        }));
        return server_1.NextResponse.json({
            success: true,
            propertyTypes: propertyTypesWithCounts,
        });
    }
    catch (error) {
        console.error("Error fetching property types:", error);
        return server_1.NextResponse.json({ success: false, error: "Failed to fetch property types" }, { status: 500 });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { name, description, icon, image, isActive = true } = body;
        // Validate required fields
        if (!name || !description || !image) {
            return server_1.NextResponse.json({ error: "Name, description, and image are required" }, { status: 400 });
        }
        // Generate slug from name
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        // Check if property type with this slug already exists
        const existingPropertyType = await services_1.PropertyTypeService.findBySlug(slug);
        if (existingPropertyType) {
            return server_1.NextResponse.json({ error: "A property type with this name already exists" }, { status: 400 });
        }
        // Create new property type
        const newPropertyType = await services_1.PropertyTypeService.create({
            name,
            slug,
            description,
            icon,
            image,
            isActive,
        });
        return server_1.NextResponse.json({
            message: "Property type created successfully",
            propertyType: {
                ...newPropertyType,
                _id: newPropertyType._id.toString(),
            },
        });
    }
    catch (error) {
        console.error("Error creating property type:", error);
        return server_1.NextResponse.json({ error: "Failed to create property type" }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map
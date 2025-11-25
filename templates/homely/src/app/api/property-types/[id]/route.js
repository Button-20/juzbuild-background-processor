"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUT = PUT;
exports.DELETE = DELETE;
const services_1 = require("@/services");
const server_1 = require("next/server");
async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, description, icon, image, isActive } = body;
        // Validate required fields
        if (!name || !description || !image) {
            return server_1.NextResponse.json({ error: "Name, description, and image are required" }, { status: 400 });
        }
        // Generate slug from name
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        // Check if another property type with the same slug exists (excluding current)
        const existingWithSlug = await services_1.PropertyTypeService.findBySlug(slug);
        if (existingWithSlug && existingWithSlug._id.toString() !== id) {
            return server_1.NextResponse.json({ error: "A property type with this name already exists" }, { status: 400 });
        }
        const updatedPropertyType = await services_1.PropertyTypeService.update(id, {
            name,
            slug,
            description,
            icon,
            image,
            isActive,
        });
        if (!updatedPropertyType) {
            return server_1.NextResponse.json({ error: "Property type not found" }, { status: 404 });
        }
        return server_1.NextResponse.json({
            message: "Property type updated successfully",
            propertyType: {
                ...updatedPropertyType,
                _id: updatedPropertyType._id.toString(),
            },
        });
    }
    catch (error) {
        console.error("Error updating property type:", error);
        return server_1.NextResponse.json({ error: "Failed to update property type" }, { status: 500 });
    }
}
async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        // Check if property type exists
        const propertyType = await services_1.PropertyTypeService.findById(id);
        if (!propertyType) {
            return server_1.NextResponse.json({ error: "Property type not found" }, { status: 404 });
        }
        // Check if any properties are using this property type
        const { total } = await services_1.PropertyService.findAll({
            propertyType: id,
            limit: 1,
        });
        if (total > 0) {
            return server_1.NextResponse.json({
                error: `Cannot delete property type. ${total} properties are using this type.`,
            }, { status: 400 });
        }
        const deleted = await services_1.PropertyTypeService.delete(id);
        if (!deleted) {
            return server_1.NextResponse.json({ error: "Failed to delete property type" }, { status: 500 });
        }
        return server_1.NextResponse.json({
            message: "Property type deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting property type:", error);
        return server_1.NextResponse.json({ error: "Failed to delete property type" }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map
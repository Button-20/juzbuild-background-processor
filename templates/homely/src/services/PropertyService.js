"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyService = void 0;
const mongodb_1 = __importDefault(require("@/lib/mongodb"));
const Property_1 = require("@/schemas/Property");
const mongodb_2 = require("mongodb");
class PropertyService {
    static async getCollection() {
        const { db } = await (0, mongodb_1.default)();
        return db.collection("properties");
    }
    // Create a new property
    static async create(data) {
        const validatedData = Property_1.CreatePropertySchema.parse(data);
        const collection = await this.getCollection();
        // Generate slug if not provided
        if (!validatedData.slug) {
            validatedData.slug = validatedData.name
                .toLowerCase()
                .replace(/[^a-zA-Z0-9 ]/g, "")
                .replace(/\s+/g, "-")
                .trim();
        }
        const propertyData = {
            ...validatedData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const result = await collection.insertOne(propertyData);
        return {
            ...propertyData,
            _id: result.insertedId,
        };
    }
    // Find property by ID
    static async findById(id) {
        const collection = await this.getCollection();
        const property = await collection.findOne({ _id: new mongodb_2.ObjectId(id) });
        return property || null;
    }
    // Find property by slug
    static async findBySlug(slug) {
        const collection = await this.getCollection();
        const property = await collection.findOne({ slug, isActive: true });
        return property || null;
    }
    // Update property
    static async update(id, data) {
        const validatedData = Property_1.UpdatePropertySchema.parse(data);
        const collection = await this.getCollection();
        const result = await collection.findOneAndUpdate({ _id: new mongodb_2.ObjectId(id) }, {
            $set: {
                ...validatedData,
                updatedAt: new Date(),
            },
        }, { returnDocument: "after" });
        return result || null;
    }
    // Delete property
    static async delete(id) {
        const collection = await this.getCollection();
        const result = await collection.deleteOne({ _id: new mongodb_2.ObjectId(id) });
        return result.deletedCount > 0;
    }
    // Find all properties with filters and pagination
    static async findAll(filters = {}) {
        const validatedFilters = Property_1.PropertyFiltersSchema.parse({
            limit: 10,
            skip: 0,
            ...filters,
        });
        const collection = await this.getCollection();
        const query = {};
        // Apply filters
        if (validatedFilters.propertyType) {
            // Check if propertyType is stored as string or ObjectId in the database
            // For now, assume it's stored as string (based on the sample data provided)
            query.propertyType = validatedFilters.propertyType;
        }
        if (validatedFilters.status) {
            query.status = validatedFilters.status;
        }
        if (validatedFilters.minPrice !== undefined ||
            validatedFilters.maxPrice !== undefined) {
            query.price = {};
            if (validatedFilters.minPrice !== undefined) {
                query.price.$gte = validatedFilters.minPrice;
            }
            if (validatedFilters.maxPrice !== undefined) {
                query.price.$lte = validatedFilters.maxPrice;
            }
        }
        if (validatedFilters.beds !== undefined) {
            query.beds = { $gte: validatedFilters.beds };
        }
        if (validatedFilters.baths !== undefined) {
            query.baths = { $gte: validatedFilters.baths };
        }
        if (validatedFilters.location) {
            query.location = { $regex: validatedFilters.location, $options: "i" };
        }
        if (validatedFilters.isFeatured !== undefined) {
            query.isFeatured = validatedFilters.isFeatured;
        }
        if (validatedFilters.isActive !== undefined) {
            query.isActive = validatedFilters.isActive;
        }
        // Handle search parameter (not in schema, added for API compatibility)
        if (filters.search) {
            const searchTerm = filters.search;
            query.$or = [
                { name: { $regex: searchTerm, $options: "i" } },
                { location: { $regex: searchTerm, $options: "i" } },
                { description: { $regex: searchTerm, $options: "i" } },
            ];
        }
        const [properties, total] = await Promise.all([
            collection
                .find(query)
                .sort({ isFeatured: -1, createdAt: -1 })
                .skip(validatedFilters.skip)
                .limit(validatedFilters.limit)
                .toArray(),
            collection.countDocuments(query),
        ]);
        return {
            properties,
            total,
        };
    }
    // Find featured properties
    static async findFeatured(limit = 10) {
        const collection = await this.getCollection();
        const properties = await collection
            .find({ isFeatured: true, isActive: true })
            .sort({ createdAt: -1 })
            .limit(limit)
            .toArray();
        return properties;
    }
    // Find properties by property type
    static async findByPropertyType(propertyTypeId, limit = 10) {
        const collection = await this.getCollection();
        const properties = await collection
            .find({
            propertyType: propertyTypeId, // Use string instead of ObjectId
            isActive: true,
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .toArray();
        return properties;
    }
    // Get property statistics
    static async getStats() {
        const collection = await this.getCollection();
        const [total, forSale, forRent, sold, rented, featured] = await Promise.all([
            collection.countDocuments({}),
            collection.countDocuments({ status: "for-sale", isActive: true }),
            collection.countDocuments({ status: "for-rent", isActive: true }),
            collection.countDocuments({ status: "sold" }),
            collection.countDocuments({ status: "rented" }),
            collection.countDocuments({ isFeatured: true, isActive: true }),
        ]);
        return {
            total,
            forSale,
            forRent,
            sold,
            rented,
            featured,
        };
    }
    // Toggle featured status
    static async toggleFeatured(id) {
        const collection = await this.getCollection();
        const property = await collection.findOne({ _id: new mongodb_2.ObjectId(id) });
        if (!property)
            return null;
        const result = await collection.findOneAndUpdate({ _id: new mongodb_2.ObjectId(id) }, {
            $set: {
                isFeatured: !property.isFeatured,
                updatedAt: new Date(),
            },
        }, { returnDocument: "after" });
        return result || null;
    }
    // Toggle active status
    static async toggleActive(id) {
        const collection = await this.getCollection();
        const property = await collection.findOne({ _id: new mongodb_2.ObjectId(id) });
        if (!property)
            return null;
        const result = await collection.findOneAndUpdate({ _id: new mongodb_2.ObjectId(id) }, {
            $set: {
                isActive: !property.isActive,
                updatedAt: new Date(),
            },
        }, { returnDocument: "after" });
        return result || null;
    }
}
exports.PropertyService = PropertyService;
//# sourceMappingURL=PropertyService.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyTypeService = void 0;
const mongodb_1 = __importDefault(require("@/lib/mongodb"));
const PropertyType_1 = require("@/schemas/PropertyType");
const mongodb_2 = require("mongodb");
class PropertyTypeService {
    static async getCollection() {
        const { db } = await (0, mongodb_1.default)();
        return db.collection("property-types");
    }
    // Create a new property type
    static async create(data) {
        const validatedData = PropertyType_1.CreatePropertyTypeSchema.parse(data);
        const collection = await this.getCollection();
        // Generate slug if not provided
        if (!validatedData.slug) {
            validatedData.slug = validatedData.name
                .toLowerCase()
                .replace(/[^a-zA-Z0-9 ]/g, "")
                .replace(/\s+/g, "-")
                .trim();
        }
        const propertyTypeData = {
            ...validatedData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const result = await collection.insertOne(propertyTypeData);
        return {
            ...propertyTypeData,
            _id: result.insertedId,
        };
    }
    // Find property type by ID
    static async findById(id) {
        const collection = await this.getCollection();
        const propertyType = await collection.findOne({
            _id: new mongodb_2.ObjectId(id),
        });
        return propertyType || null;
    }
    // Find property type by slug
    static async findBySlug(slug) {
        const collection = await this.getCollection();
        const propertyType = await collection.findOne({ slug, isActive: true });
        return propertyType || null;
    }
    // Update property type
    static async update(id, data) {
        const validatedData = PropertyType_1.UpdatePropertyTypeSchema.parse(data);
        const collection = await this.getCollection();
        const result = await collection.findOneAndUpdate({ _id: new mongodb_2.ObjectId(id) }, {
            $set: {
                ...validatedData,
                updatedAt: new Date(),
            },
        }, { returnDocument: "after" });
        return result || null;
    }
    // Delete property type
    static async delete(id) {
        const collection = await this.getCollection();
        const result = await collection.deleteOne({ _id: new mongodb_2.ObjectId(id) });
        return result.deletedCount > 0;
    }
    // Find all property types
    static async findAll(options = {}) {
        const { limit = 10, skip = 0, filter = {} } = options;
        const collection = await this.getCollection();
        const [propertyTypes, total] = await Promise.all([
            collection
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .toArray(),
            collection.countDocuments(filter),
        ]);
        return {
            propertyTypes,
            total,
        };
    }
    // Find active property types
    static async findActive() {
        const collection = await this.getCollection();
        const propertyTypes = await collection
            .find({ isActive: true })
            .sort({ createdAt: -1 })
            .toArray();
        return propertyTypes;
    }
    // Toggle active status
    static async toggleActive(id) {
        const collection = await this.getCollection();
        const propertyType = await collection.findOne({
            _id: new mongodb_2.ObjectId(id),
        });
        if (!propertyType)
            return null;
        const result = await collection.findOneAndUpdate({ _id: new mongodb_2.ObjectId(id) }, {
            $set: {
                isActive: !propertyType.isActive,
                updatedAt: new Date(),
            },
        }, { returnDocument: "after" });
        return result || null;
    }
    // Get property type statistics
    static async getStats() {
        const collection = await this.getCollection();
        const [total, active, inactive] = await Promise.all([
            collection.countDocuments({}),
            collection.countDocuments({ isActive: true }),
            collection.countDocuments({ isActive: false }),
        ]);
        return {
            total,
            active,
            inactive,
        };
    }
}
exports.PropertyTypeService = PropertyTypeService;
//# sourceMappingURL=PropertyTypeService.js.map
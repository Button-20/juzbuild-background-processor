"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestimonialService = void 0;
const mongodb_1 = __importDefault(require("@/lib/mongodb"));
const Testimonial_1 = require("@/schemas/Testimonial");
const mongodb_2 = require("mongodb");
class TestimonialService {
    static async getCollection() {
        const { db } = await (0, mongodb_1.default)();
        return db.collection("testimonials");
    }
    // Create a new testimonial
    static async create(data) {
        const validatedData = Testimonial_1.CreateTestimonialSchema.parse(data);
        const collection = await this.getCollection();
        const testimonialData = {
            ...validatedData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const result = await collection.insertOne(testimonialData);
        return {
            ...testimonialData,
            _id: result.insertedId,
        };
    }
    // Find testimonial by ID
    static async findById(id) {
        const collection = await this.getCollection();
        const testimonial = await collection.findOne({
            _id: new mongodb_2.ObjectId(id),
        });
        return testimonial || null;
    }
    // Update testimonial
    static async update(id, data) {
        const validatedData = Testimonial_1.UpdateTestimonialSchema.parse(data);
        const collection = await this.getCollection();
        const result = await collection.findOneAndUpdate({ _id: new mongodb_2.ObjectId(id) }, {
            $set: {
                ...validatedData,
                updatedAt: new Date(),
            },
        }, { returnDocument: "after" });
        return result || null;
    }
    // Delete testimonial
    static async delete(id) {
        const collection = await this.getCollection();
        const result = await collection.deleteOne({ _id: new mongodb_2.ObjectId(id) });
        return result.deletedCount > 0;
    }
    // Find all testimonials with filters and pagination
    static async findAll(filters = {}) {
        const validatedFilters = Testimonial_1.TestimonialFiltersSchema.parse({
            limit: 10,
            skip: 0,
            ...filters,
        });
        const collection = await this.getCollection();
        const query = {};
        // Apply filters
        if (validatedFilters.isActive !== undefined) {
            query.isActive = validatedFilters.isActive;
        }
        if (validatedFilters.rating !== undefined) {
            query.rating = validatedFilters.rating;
        }
        const [testimonials, total] = await Promise.all([
            collection
                .find(query)
                .sort({ order: 1, createdAt: -1 })
                .skip(validatedFilters.skip)
                .limit(validatedFilters.limit)
                .toArray(),
            collection.countDocuments(query),
        ]);
        return {
            testimonials,
            total,
        };
    }
    // Find active testimonials
    static async findActive(limit = 10) {
        const collection = await this.getCollection();
        const testimonials = await collection
            .find({ isActive: true })
            .sort({ order: 1, createdAt: -1 })
            .limit(limit)
            .toArray();
        return testimonials;
    }
    // Toggle active status
    static async toggleActive(id) {
        const collection = await this.getCollection();
        const testimonial = await collection.findOne({
            _id: new mongodb_2.ObjectId(id),
        });
        if (!testimonial)
            return null;
        const result = await collection.findOneAndUpdate({ _id: new mongodb_2.ObjectId(id) }, {
            $set: {
                isActive: !testimonial.isActive,
                updatedAt: new Date(),
            },
        }, { returnDocument: "after" });
        return result || null;
    }
    // Update order
    static async updateOrder(id, order) {
        const collection = await this.getCollection();
        const result = await collection.findOneAndUpdate({ _id: new mongodb_2.ObjectId(id) }, {
            $set: {
                order,
                updatedAt: new Date(),
            },
        }, { returnDocument: "after" });
        return result || null;
    }
    // Get testimonial statistics
    static async getStats() {
        const collection = await this.getCollection();
        const [total, active, inactive, avgRatingResult] = await Promise.all([
            collection.countDocuments({}),
            collection.countDocuments({ isActive: true }),
            collection.countDocuments({ isActive: false }),
            collection
                .aggregate([
                { $group: { _id: null, averageRating: { $avg: "$rating" } } },
            ])
                .toArray(),
        ]);
        const averageRating = avgRatingResult.length > 0 ? avgRatingResult[0].averageRating : 0;
        return {
            total,
            active,
            inactive,
            averageRating,
        };
    }
}
exports.TestimonialService = TestimonialService;
//# sourceMappingURL=TestimonialService.js.map
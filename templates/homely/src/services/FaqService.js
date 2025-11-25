"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqService = void 0;
const mongodb_1 = __importDefault(require("@/lib/mongodb"));
const Faq_1 = require("@/schemas/Faq");
const mongodb_2 = require("mongodb");
class FaqService {
    static async getCollection() {
        const { db } = await (0, mongodb_1.default)();
        return db.collection("faqs");
    }
    // Create a new FAQ
    static async create(data) {
        const validatedData = Faq_1.CreateFaqSchema.parse(data);
        const collection = await this.getCollection();
        const faqData = {
            ...validatedData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const result = await collection.insertOne(faqData);
        return {
            ...faqData,
            _id: result.insertedId,
        };
    }
    // Find FAQ by ID
    static async findById(id) {
        const collection = await this.getCollection();
        const faq = await collection.findOne({
            _id: new mongodb_2.ObjectId(id),
        });
        return faq || null;
    }
    // Update FAQ
    static async update(id, data) {
        const validatedData = Faq_1.UpdateFaqSchema.parse(data);
        const collection = await this.getCollection();
        const result = await collection.findOneAndUpdate({ _id: new mongodb_2.ObjectId(id) }, {
            $set: {
                ...validatedData,
                updatedAt: new Date(),
            },
        }, { returnDocument: "after" });
        return result || null;
    }
    // Delete FAQ
    static async delete(id) {
        const collection = await this.getCollection();
        const result = await collection.deleteOne({ _id: new mongodb_2.ObjectId(id) });
        return result.deletedCount > 0;
    }
    // Find all FAQs with filters and pagination
    static async findAll(filters = {}) {
        const validatedFilters = Faq_1.FaqFiltersSchema.parse({
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
        if (validatedFilters.category) {
            query.category = validatedFilters.category;
        }
        const [faqs, total] = await Promise.all([
            collection
                .find(query)
                .sort({ order: 1, createdAt: -1 })
                .skip(validatedFilters.skip)
                .limit(validatedFilters.limit)
                .toArray(),
            collection.countDocuments(query),
        ]);
        return {
            faqs,
            total,
        };
    }
    // Find active FAQs
    static async findActive(limit = 10) {
        const collection = await this.getCollection();
        const faqs = await collection
            .find({ isActive: true })
            .sort({ order: 1, createdAt: -1 })
            .limit(limit)
            .toArray();
        return faqs;
    }
    // Toggle active status
    static async toggleActive(id) {
        const collection = await this.getCollection();
        const faq = await collection.findOne({
            _id: new mongodb_2.ObjectId(id),
        });
        if (!faq)
            return null;
        const result = await collection.findOneAndUpdate({ _id: new mongodb_2.ObjectId(id) }, {
            $set: {
                isActive: !faq.isActive,
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
    // Bulk update orders
    static async bulkUpdateOrders(updates) {
        const collection = await this.getCollection();
        const bulkOps = updates.map((update) => ({
            updateOne: {
                filter: { _id: new mongodb_2.ObjectId(update.id) },
                update: {
                    $set: {
                        order: update.order,
                        updatedAt: new Date(),
                    },
                },
            },
        }));
        const result = await collection.bulkWrite(bulkOps);
        return result.modifiedCount > 0;
    }
}
exports.FaqService = FaqService;
//# sourceMappingURL=FaqService.js.map
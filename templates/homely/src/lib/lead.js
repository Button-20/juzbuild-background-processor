"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadService = void 0;
const mongodb_1 = __importDefault(require("@/lib/mongodb"));
const mongodb_2 = require("mongodb");
class LeadService {
    static collectionName = "leads";
    /**
     * Format source type for user-friendly display
     */
    static formatSourceType(source) {
        const sourceMap = {
            property_inquiry: "Property Inquiry",
            contact_form: "Contact Form Submission",
        };
        return sourceMap[source];
    }
    /**
     * Create a new lead from form data
     */
    static async createLead(data) {
        try {
            const { db } = await (0, mongodb_1.default)();
            const collection = db.collection(this.collectionName);
            // Determine priority based on available information
            const priority = this.calculatePriority(data);
            const lead = {
                ...data,
                priority,
                status: "new",
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const result = await collection.insertOne(lead);
            return {
                _id: result.insertedId.toString(),
                ...lead,
            };
        }
        catch (error) {
            console.error("Failed to create lead:", error);
            throw new Error("Lead creation failed");
        }
    }
    /**
     * Get all leads with pagination
     */
    static async getLeads(page = 1, limit = 20, filter = {}) {
        try {
            const { db } = await (0, mongodb_1.default)();
            const collection = db.collection(this.collectionName);
            const skip = (page - 1) * limit;
            const query = Object.entries(filter).reduce((acc, [key, value]) => {
                if (value)
                    acc[key] = value;
                return acc;
            }, {});
            const [leads, total] = await Promise.all([
                collection
                    .find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .toArray(),
                collection.countDocuments(query),
            ]);
            return {
                leads: leads.map((lead) => ({
                    ...lead,
                    _id: lead._id.toString(),
                })),
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };
        }
        catch (error) {
            console.error("Failed to get leads:", error);
            throw new Error("Failed to retrieve leads");
        }
    }
    /**
     * Get a single lead by ID
     */
    static async getLeadById(id) {
        try {
            const { db } = await (0, mongodb_1.default)();
            const collection = db.collection(this.collectionName);
            const lead = await collection.findOne({ _id: new mongodb_2.ObjectId(id) });
            if (!lead)
                return null;
            return {
                ...lead,
                _id: lead._id.toString(),
            };
        }
        catch (error) {
            console.error("Failed to get lead:", error);
            return null;
        }
    }
    /**
     * Update lead status
     */
    static async updateLeadStatus(id, status, notes) {
        try {
            const { db } = await (0, mongodb_1.default)();
            const collection = db.collection(this.collectionName);
            const updateData = {
                status,
                updatedAt: new Date(),
            };
            if (notes) {
                updateData.notes = notes;
            }
            const result = await collection.updateOne({ _id: new mongodb_2.ObjectId(id) }, { $set: updateData });
            return result.modifiedCount > 0;
        }
        catch (error) {
            console.error("Failed to update lead status:", error);
            return false;
        }
    }
    /**
     * Get lead statistics
     */
    static async getLeadStats() {
        try {
            const { db } = await (0, mongodb_1.default)();
            const collection = db.collection(this.collectionName);
            const [total, statusStats, priorityStats, sourceStats, recentCount] = await Promise.all([
                collection.countDocuments(),
                collection
                    .aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }])
                    .toArray(),
                collection
                    .aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }])
                    .toArray(),
                collection
                    .aggregate([{ $group: { _id: "$source", count: { $sum: 1 } } }])
                    .toArray(),
                collection.countDocuments({
                    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
                }),
            ]);
            return {
                total,
                byStatus: this.aggregateToRecord(statusStats, ["new", "contacted", "qualified", "converted", "closed"]),
                byPriority: this.aggregateToRecord(priorityStats, ["high", "medium", "low"]),
                bySource: this.aggregateToRecord(sourceStats, ["contact_form", "property_inquiry"]),
                recentCount,
            };
        }
        catch (error) {
            console.error("Failed to get lead stats:", error);
            throw new Error("Failed to retrieve lead statistics");
        }
    }
    /**
     * Calculate lead priority based on available information
     */
    static calculatePriority(data) {
        let score = 0;
        // Property inquiry gets higher priority
        if (data.source === "property_inquiry")
            score += 2;
        // Company name suggests business inquiry
        if (data.company)
            score += 1;
        // Phone number shows higher engagement
        if (data.phone)
            score += 1;
        // Budget information shows serious intent
        if (data.budget)
            score += 2;
        // Timeline shows urgency
        if (data.timeline) {
            const timeline = data.timeline.toLowerCase();
            if (timeline.includes("urgent") ||
                timeline.includes("asap") ||
                timeline.includes("immediate")) {
                score += 3;
            }
            else if (timeline.includes("week") || timeline.includes("month")) {
                score += 2;
            }
            else {
                score += 1;
            }
        }
        // Message length and keywords can indicate seriousness
        if (data.message.length > 100)
            score += 1;
        if (data.message.toLowerCase().includes("buy") ||
            data.message.toLowerCase().includes("purchase")) {
            score += 2;
        }
        // Determine priority based on score
        if (score >= 6)
            return "high";
        if (score >= 3)
            return "medium";
        return "low";
    }
    /**
     * Helper method to convert aggregation results to record
     */
    static aggregateToRecord(aggregateResult, keys) {
        const record = keys.reduce((acc, key) => {
            acc[key] = 0;
            return acc;
        }, {});
        aggregateResult.forEach(({ _id, count }) => {
            if (_id && keys.includes(_id)) {
                record[_id] = count;
            }
        });
        return record;
    }
}
exports.LeadService = LeadService;
//# sourceMappingURL=lead.js.map
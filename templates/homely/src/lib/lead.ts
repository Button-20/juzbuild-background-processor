import connectDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export interface LeadData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  budget?: string;
  timeline?: string;
  propertyName?: string;
  propertyUrl?: string;
  source: "contact_form" | "property_inquiry";
}

export interface Lead {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  budget?: string;
  timeline?: string;
  propertyName?: string;
  propertyUrl?: string;
  source: "contact_form" | "property_inquiry";
  priority: "high" | "medium" | "low";
  status: "new" | "contacted" | "qualified" | "converted" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

export class LeadService {
  private static collectionName = "leads";

  /**
   * Format source type for user-friendly display
   */
  static formatSourceType(source: Lead["source"]): string {
    const sourceMap: Record<Lead["source"], string> = {
      property_inquiry: "Property Inquiry",
      contact_form: "Contact Form Submission",
    };
    return sourceMap[source];
  }

  /**
   * Create a new lead from form data
   */
  static async createLead(data: LeadData): Promise<Lead> {
    try {
      const { db } = await connectDB();
      const collection = db.collection(this.collectionName);

      // Determine priority based on available information
      const priority = this.calculatePriority(data);

      const lead: Omit<Lead, "_id"> = {
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
    } catch (error) {
      console.error("Failed to create lead:", error);
      throw new Error("Lead creation failed");
    }
  }

  /**
   * Get all leads with pagination
   */
  static async getLeads(
    page: number = 1,
    limit: number = 20,
    filter: Partial<Pick<Lead, "status" | "priority" | "source">> = {}
  ): Promise<{
    leads: Lead[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const { db } = await connectDB();
      const collection = db.collection(this.collectionName);

      const skip = (page - 1) * limit;

      const query = Object.entries(filter).reduce((acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      }, {} as any);

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
        })) as Lead[],
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error("Failed to get leads:", error);
      throw new Error("Failed to retrieve leads");
    }
  }

  /**
   * Get a single lead by ID
   */
  static async getLeadById(id: string): Promise<Lead | null> {
    try {
      const { db } = await connectDB();
      const collection = db.collection(this.collectionName);

      const lead = await collection.findOne({ _id: new ObjectId(id) });

      if (!lead) return null;

      return {
        ...lead,
        _id: lead._id.toString(),
      } as Lead;
    } catch (error) {
      console.error("Failed to get lead:", error);
      return null;
    }
  }

  /**
   * Update lead status
   */
  static async updateLeadStatus(
    id: string,
    status: Lead["status"],
    notes?: string
  ): Promise<boolean> {
    try {
      const { db } = await connectDB();
      const collection = db.collection(this.collectionName);

      const updateData: any = {
        status,
        updatedAt: new Date(),
      };

      if (notes) {
        updateData.notes = notes;
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      console.error("Failed to update lead status:", error);
      return false;
    }
  }

  /**
   * Get lead statistics
   */
  static async getLeadStats(): Promise<{
    total: number;
    byStatus: Record<Lead["status"], number>;
    byPriority: Record<Lead["priority"], number>;
    bySource: Record<Lead["source"], number>;
    recentCount: number;
  }> {
    try {
      const { db } = await connectDB();
      const collection = db.collection(this.collectionName);

      const [total, statusStats, priorityStats, sourceStats, recentCount] =
        await Promise.all([
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
        byStatus: this.aggregateToRecord(
          statusStats as Array<{ _id: Lead["status"]; count: number }>,
          ["new", "contacted", "qualified", "converted", "closed"]
        ),
        byPriority: this.aggregateToRecord(
          priorityStats as Array<{ _id: Lead["priority"]; count: number }>,
          ["high", "medium", "low"]
        ),
        bySource: this.aggregateToRecord(
          sourceStats as Array<{ _id: Lead["source"]; count: number }>,
          ["contact_form", "property_inquiry"]
        ),
        recentCount,
      };
    } catch (error) {
      console.error("Failed to get lead stats:", error);
      throw new Error("Failed to retrieve lead statistics");
    }
  }

  /**
   * Calculate lead priority based on available information
   */
  private static calculatePriority(data: LeadData): Lead["priority"] {
    let score = 0;

    // Property inquiry gets higher priority
    if (data.source === "property_inquiry") score += 2;

    // Company name suggests business inquiry
    if (data.company) score += 1;

    // Phone number shows higher engagement
    if (data.phone) score += 1;

    // Budget information shows serious intent
    if (data.budget) score += 2;

    // Timeline shows urgency
    if (data.timeline) {
      const timeline = data.timeline.toLowerCase();
      if (
        timeline.includes("urgent") ||
        timeline.includes("asap") ||
        timeline.includes("immediate")
      ) {
        score += 3;
      } else if (timeline.includes("week") || timeline.includes("month")) {
        score += 2;
      } else {
        score += 1;
      }
    }

    // Message length and keywords can indicate seriousness
    if (data.message.length > 100) score += 1;
    if (
      data.message.toLowerCase().includes("buy") ||
      data.message.toLowerCase().includes("purchase")
    ) {
      score += 2;
    }

    // Determine priority based on score
    if (score >= 6) return "high";
    if (score >= 3) return "medium";
    return "low";
  }

  /**
   * Helper method to convert aggregation results to record
   */
  private static aggregateToRecord<T extends string>(
    aggregateResult: Array<{ _id: T; count: number }>,
    keys: T[]
  ): Record<T, number> {
    const record = keys.reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {} as Record<T, number>);

    aggregateResult.forEach(({ _id, count }) => {
      if (_id && keys.includes(_id)) {
        record[_id] = count;
      }
    });

    return record;
  }
}

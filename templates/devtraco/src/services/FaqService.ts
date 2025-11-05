import connectDB from "@/lib/mongodb";
import {
  CreateFaqInput,
  CreateFaqSchema,
  Faq,
  FaqFilters,
  FaqFiltersSchema,
  UpdateFaqInput,
  UpdateFaqSchema,
} from "@/schemas/Faq";
import { ObjectId } from "mongodb";

export class FaqService {
  private static async getCollection() {
    const { db } = await connectDB();
    return db.collection<Faq>("faqs");
  }

  // Create a new FAQ
  static async create(data: CreateFaqInput): Promise<Faq> {
    const validatedData = CreateFaqSchema.parse(data);
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
  static async findById(id: string): Promise<Faq | null> {
    const collection = await this.getCollection();
    const faq = await collection.findOne({
      _id: new ObjectId(id),
    } as any);
    return faq || null;
  }

  // Update FAQ
  static async update(id: string, data: UpdateFaqInput): Promise<Faq | null> {
    const validatedData = UpdateFaqSchema.parse(data);
    const collection = await this.getCollection();

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) } as any,
      {
        $set: {
          ...validatedData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    return result || null;
  }

  // Delete FAQ
  static async delete(id: string): Promise<boolean> {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) } as any);
    return result.deletedCount > 0;
  }

  // Find all FAQs with filters and pagination
  static async findAll(
    filters: Partial<FaqFilters> = {}
  ): Promise<{ faqs: Faq[]; total: number }> {
    const validatedFilters = FaqFiltersSchema.parse({
      limit: 10,
      skip: 0,
      ...filters,
    });
    const collection = await this.getCollection();

    const query: any = {};

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
  static async findActive(limit: number = 10): Promise<Faq[]> {
    const collection = await this.getCollection();
    const faqs = await collection
      .find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)
      .toArray();
    return faqs;
  }

  // Toggle active status
  static async toggleActive(id: string): Promise<Faq | null> {
    const collection = await this.getCollection();
    const faq = await collection.findOne({
      _id: new ObjectId(id),
    } as any);

    if (!faq) return null;

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) } as any,
      {
        $set: {
          isActive: !faq.isActive,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    return result || null;
  }

  // Update order
  static async updateOrder(id: string, order: number): Promise<Faq | null> {
    const collection = await this.getCollection();

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) } as any,
      {
        $set: {
          order,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    return result || null;
  }

  // Bulk update orders
  static async bulkUpdateOrders(
    updates: Array<{ id: string; order: number }>
  ): Promise<boolean> {
    const collection = await this.getCollection();

    const bulkOps = updates.map((update) => ({
      updateOne: {
        filter: { _id: new ObjectId(update.id) } as any,
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

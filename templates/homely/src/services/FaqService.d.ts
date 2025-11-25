import { CreateFaqInput, Faq, FaqFilters, UpdateFaqInput } from "@/schemas/Faq";
export declare class FaqService {
    private static getCollection;
    static create(data: CreateFaqInput): Promise<Faq>;
    static findById(id: string): Promise<Faq | null>;
    static update(id: string, data: UpdateFaqInput): Promise<Faq | null>;
    static delete(id: string): Promise<boolean>;
    static findAll(filters?: Partial<FaqFilters>): Promise<{
        faqs: Faq[];
        total: number;
    }>;
    static findActive(limit?: number): Promise<Faq[]>;
    static toggleActive(id: string): Promise<Faq | null>;
    static updateOrder(id: string, order: number): Promise<Faq | null>;
    static bulkUpdateOrders(updates: Array<{
        id: string;
        order: number;
    }>): Promise<boolean>;
}
//# sourceMappingURL=FaqService.d.ts.map
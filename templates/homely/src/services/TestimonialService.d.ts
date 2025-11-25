import { CreateTestimonialInput, Testimonial, TestimonialFilters, UpdateTestimonialInput } from "@/schemas/Testimonial";
export declare class TestimonialService {
    private static getCollection;
    static create(data: CreateTestimonialInput): Promise<Testimonial>;
    static findById(id: string): Promise<Testimonial | null>;
    static update(id: string, data: UpdateTestimonialInput): Promise<Testimonial | null>;
    static delete(id: string): Promise<boolean>;
    static findAll(filters?: Partial<TestimonialFilters>): Promise<{
        testimonials: Testimonial[];
        total: number;
    }>;
    static findActive(limit?: number): Promise<Testimonial[]>;
    static toggleActive(id: string): Promise<Testimonial | null>;
    static updateOrder(id: string, order: number): Promise<Testimonial | null>;
    static getStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        averageRating: number;
    }>;
}
//# sourceMappingURL=TestimonialService.d.ts.map
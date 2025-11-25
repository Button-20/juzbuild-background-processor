"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const FaqService_1 = require("@/services/FaqService");
const server_1 = require("next/server");
async function GET() {
    try {
        // Fetch FAQs for homepage
        let { faqs, total } = await FaqService_1.FaqService.findAll({
            isActive: true,
            limit: 20,
        });
        // If no FAQs exist, seed with default data (but check again to avoid race conditions)
        if (total === 0) {
            // Double-check by querying all FAQs (including inactive ones)
            const { total: allFaqsCount } = await FaqService_1.FaqService.findAll({
                limit: 1,
            });
            // Only seed if truly no FAQs exist
            if (allFaqsCount === 0) {
                const defaultFaqs = [
                    {
                        question: "Can I personalize my homely home?",
                        answer: "Discover a diverse range of premium properties, from luxurious apartments to spacious villas, tailored to your needs.",
                        category: "General",
                        isActive: true,
                        order: 1,
                    },
                    {
                        question: "Where can I find homely homes?",
                        answer: "Discover a diverse range of premium properties, from luxurious apartments to spacious villas, tailored to your needs.",
                        category: "General",
                        isActive: true,
                        order: 2,
                    },
                    {
                        question: "What steps to buy a homely?",
                        answer: "Discover a diverse range of premium properties, from luxurious apartments to spacious villas, tailored to your needs.",
                        category: "Buying",
                        isActive: true,
                        order: 3,
                    },
                ];
                // Create default FAQs
                for (const faqData of defaultFaqs) {
                    await FaqService_1.FaqService.create(faqData);
                }
                // Re-fetch FAQs after seeding
                const result = await FaqService_1.FaqService.findAll({
                    isActive: true,
                    limit: 20,
                });
                faqs = result.faqs;
                total = result.total;
            }
        }
        return server_1.NextResponse.json({
            faqs,
            total: faqs.length,
        });
    }
    catch (error) {
        console.error("FAQs GET error:", error);
        return server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        // Validate required fields
        const { question, answer } = body;
        if (!question || !answer) {
            return server_1.NextResponse.json({ error: "Question and answer are required" }, { status: 400 });
        }
        // Create new FAQ
        const faq = await FaqService_1.FaqService.create({
            question,
            answer,
            category: body.category || "",
            isActive: body.isActive !== undefined ? body.isActive : true,
            order: body.order || 0,
        });
        return server_1.NextResponse.json(faq, { status: 201 });
    }
    catch (error) {
        console.error("FAQ POST error:", error);
        return server_1.NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map
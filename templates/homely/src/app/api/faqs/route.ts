import { FaqService } from "@/services/FaqService";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if there are any FAQs in the database
    const { total } = await FaqService.findAll({
      isActive: true,
      limit: 1,
    });

    // If no FAQs exist, seed with default data
    if (total === 0) {
      const defaultFaqs = [
        {
          question: "Can I personalize my homely home?",
          answer:
            "Discover a diverse range of premium properties, from luxurious apartments to spacious villas, tailored to your needs.",
          category: "General",
          isActive: true,
          order: 1,
        },
        {
          question: "Where can I find homely homes?",
          answer:
            "Discover a diverse range of premium properties, from luxurious apartments to spacious villas, tailored to your needs.",
          category: "General",
          isActive: true,
          order: 2,
        },
        {
          question: "What steps to buy a homely?",
          answer:
            "Discover a diverse range of premium properties, from luxurious apartments to spacious villas, tailored to your needs.",
          category: "Buying",
          isActive: true,
          order: 3,
        },
      ];

      // Create default FAQs
      for (const faqData of defaultFaqs) {
        await FaqService.create(faqData);
      }
    }

    // Fetch FAQs for homepage
    const { faqs } = await FaqService.findAll({
      isActive: true,
      limit: 20,
    });

    return NextResponse.json({
      faqs,
      total: faqs.length,
    });
  } catch (error) {
    console.error("FAQs GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { question, answer } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer are required" },
        { status: 400 }
      );
    }

    // Create new FAQ
    const faq = await FaqService.create({
      question,
      answer,
      category: body.category || "",
      isActive: body.isActive !== undefined ? body.isActive : true,
      order: body.order || 0,
    });

    return NextResponse.json(faq, { status: 201 });
  } catch (error: any) {
    console.error("FAQ POST error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

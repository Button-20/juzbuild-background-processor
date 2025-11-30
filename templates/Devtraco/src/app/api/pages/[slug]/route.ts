import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { db } = await connectDB();
    const domain =
      process.env.NEXT_PUBLIC_DOMAIN || request.headers.get("host");

    const page = await db.collection("pages").findOne({
      domain,
      slug: slug,
    });

    if (!page) {
      return NextResponse.json(
        { success: false, error: "Page not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      page: {
        title: page.title,
        slug: page.slug,
        content: page.content,
        updatedAt: page.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching page:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch page" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { db } = await connectDB();
    const domain =
      process.env.NEXT_PUBLIC_DOMAIN || request.headers.get("host");

    const { content } = await request.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { success: false, error: "Content is required" },
        { status: 400 }
      );
    }

    // Determine title based on slug
    const titleMap: Record<string, string> = {
      "privacy-policy": "Privacy Policy",
      "terms-of-service": "Terms of Service",
    };

    const title = titleMap[slug] || slug;

    // Update or create page
    const result = await db.collection("pages").updateOne(
      { domain, slug: slug },
      {
        $set: {
          content,
          title,
          slug: slug,
          domain,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Page updated successfully",
    });
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update page" },
      { status: 500 }
    );
  }
}

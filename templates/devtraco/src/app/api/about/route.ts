import { AboutService } from "@/services/AboutService";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const aboutPage = await AboutService.get();

    if (!aboutPage) {
      // Return defaults if not found
      return NextResponse.json({
        success: true,
        aboutPage: await AboutService.upsert({}),
      });
    }

    return NextResponse.json({
      success: true,
      aboutPage,
    });
  } catch (error) {
    console.error("About page GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const aboutPage = await AboutService.upsert(body);

    return NextResponse.json({
      success: true,
      aboutPage,
    });
  } catch (error) {
    console.error("About page PUT error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

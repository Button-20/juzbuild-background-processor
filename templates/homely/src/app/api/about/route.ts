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
    console.log("[About PUT] Starting request...");
    const body = await req.json();
    console.log("[About PUT] Body received:", JSON.stringify(body, null, 2));

    const aboutPage = await AboutService.upsert(body);
    console.log("[About PUT] Upsert successful");

    return NextResponse.json({
      success: true,
      aboutPage,
    });
  } catch (error) {
    console.error("[About PUT] Error occurred:", error);
    console.error(
      "[About PUT] Error message:",
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      "[About PUT] Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

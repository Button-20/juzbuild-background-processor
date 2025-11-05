import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectDB();
    const settingsCollection = db.collection("settings");

    // Fetch settings document
    const settings = await settingsCollection.findOne({});

    if (!settings) {
      return NextResponse.json(
        { error: "Settings not found" },
        { status: 404 }
      );
    }

    // Return settings data
    return NextResponse.json({
      success: true,
      settings: {
        siteName: settings.siteName || "",
        tagline: settings.tagline || "",
        aboutSection: settings.aboutSection || "",
        primaryColor: settings.primaryColor || "#3B82F6",
        secondaryColor: settings.secondaryColor || "#EF4444",
        accentColor: settings.accentColor || "#10B981",
        theme: settings.theme || "homely",
        contactMethods: settings.contactMethods || [],
        leadCaptureMethods: settings.leadCaptureMethods || [],
        userEmail: settings.userEmail || "",
      },
    });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

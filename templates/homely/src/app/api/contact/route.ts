import { EmailService } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      message,
      company,
      subject,
      budget,
      timeline,
      propertyName,
      propertyUrl,
    } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Validate subject for general contact forms
    if (!propertyName && !subject) {
      return NextResponse.json(
        { error: "Subject is required for general inquiries" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Prepare data for lead creation and email sending
    const leadData = {
      name,
      email,
      phone,
      company,
      subject:
        subject ||
        (propertyName
          ? `Property Inquiry: ${propertyName}`
          : "General Inquiry"),
      message,
      budget,
      timeline,
      propertyName,
      propertyUrl,
      source: propertyName
        ? ("property_inquiry" as const)
        : ("contact_form" as const),
    };

    // Create lead and send emails
    try {
      // Create lead in database

      // Send confirmation email to enquirer and notification email to owner
      await EmailService.sendEmails(leadData);
    } catch (leadError) {
      console.error("Failed to create lead:", leadError);
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Your message has been received! We'll get back to you soon.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}

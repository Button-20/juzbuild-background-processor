"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const email_1 = require("@/lib/email");
const lead_1 = require("@/lib/lead");
const server_1 = require("next/server");
async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, phone, message, company, subject, budget, timeline, propertyName, propertyUrl, } = body;
        // Validate required fields
        if (!name || !email || !message) {
            return server_1.NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
        }
        // Validate subject for general contact forms
        if (!propertyName && !subject) {
            return server_1.NextResponse.json({ error: "Subject is required for general inquiries" }, { status: 400 });
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return server_1.NextResponse.json({ error: "Invalid email format" }, { status: 400 });
        }
        // Get domain from request headers
        const domain = request.headers.get("host") || "localhost";
        // Prepare data for lead creation and email sending
        const leadData = {
            name,
            email,
            phone,
            company,
            subject: subject ||
                (propertyName
                    ? `Property Inquiry: ${propertyName}`
                    : "General Inquiry"),
            message,
            budget,
            timeline,
            propertyName,
            propertyUrl,
            source: propertyName
                ? "property_inquiry"
                : "contact_form",
            domain,
        };
        // Create lead and send emails
        try {
            // Create lead in database
            await lead_1.LeadService.createLead(leadData);
            // Send confirmation email to enquirer and notification email to owner
            await email_1.EmailService.sendEmails(leadData);
        }
        catch (leadError) {
            console.error("Failed to create lead:", leadError);
        }
        // Return success response
        return server_1.NextResponse.json({
            success: true,
            message: "Your message has been received! We'll get back to you soon.",
        });
    }
    catch (error) {
        return server_1.NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map
import { Resend } from "resend";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  budget?: string;
  timeline?: string;
  propertyName?: string;
  propertyUrl?: string;
}

export interface EmailConfig {
  fromEmail: string;
  fromName: string;
  ownerEmail: string;
  companyName: string;
  websiteUrl: string;
}

export class EmailService {
  private static config: EmailConfig = {
    fromEmail: process.env.NEXT_PUBLIC_FROM_EMAIL || "noreply@homely.com",
    fromName: process.env.NEXT_PUBLIC_FROM_NAME || "Homely Real Estate",
    ownerEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@homely.com",
    companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || "Homely Real Estate",
    websiteUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  };

  /**
   * Format source type for user-friendly display
   */
  private static formatSourceType(source: string): string {
    const sourceMap: Record<string, string> = {
      property_inquiry: "Property Inquiry",
      contact_form: "Contact Form Submission",
    };
    return sourceMap[source] || source;
  }
  /**
   * Send confirmation email to the enquirer
   */
  static async sendConfirmationEmail(data: EmailData): Promise<void> {
    const isPropertyInquiry = !!data.propertyName;

    const subject = isPropertyInquiry
      ? `Thank you for your property inquiry - ${data.propertyName}`
      : `Thank you for contacting ${this.config.companyName}`;

    const htmlContent = this.generateConfirmationEmailHtml(
      data,
      isPropertyInquiry
    );
    const textContent = this.generateConfirmationEmailText(
      data,
      isPropertyInquiry
    );

    await resend.emails.send({
      from: `${this.config.fromName} <${this.config.fromEmail}>`,
      to: [data.email],
      subject: subject,
      html: htmlContent,
      text: textContent,
    });
  }

  /**
   * Send notification email to the website owner
   */
  static async sendNotificationEmail(data: EmailData): Promise<void> {
    const isPropertyInquiry = !!data.propertyName;

    const subject = isPropertyInquiry
      ? `New Property Inquiry: ${data.propertyName} from ${data.name}`
      : `New Contact Form Submission from ${data.name}`;

    const htmlContent = this.generateNotificationEmailHtml(
      data,
      isPropertyInquiry
    );
    const textContent = this.generateNotificationEmailText(
      data,
      isPropertyInquiry
    );

    await resend.emails.send({
      from: `${this.config.fromName} <${this.config.fromEmail}>`,
      to: [this.config.ownerEmail],
      subject: subject,
      html: htmlContent,
      text: textContent,
    });
  }

  /**
   * Send both confirmation and notification emails
   */
  static async sendEmails(data: EmailData): Promise<void> {
    try {
      await Promise.all([
        this.sendConfirmationEmail(data),
        this.sendNotificationEmail(data),
      ]);
    } catch (error) {
      console.error("Failed to send emails:", error);
      throw new Error("Email sending failed");
    }
  }

  /**
   * Generate confirmation email HTML for enquirer
   */
  private static generateConfirmationEmailHtml(
    data: EmailData,
    isPropertyInquiry: boolean
  ): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You - ${this.config.companyName}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .highlight { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${this.config.companyName}</h1>
        <p>Thank you for ${
          isPropertyInquiry ? "your property inquiry" : "contacting us"
        }!</p>
    </div>
    <div class="content">
        <p>Dear ${data.name},</p>
        
        <p>Thank you for ${
          isPropertyInquiry
            ? "your interest in our property"
            : "reaching out to us"
        }. We have received your ${
      isPropertyInquiry ? "inquiry" : "message"
    } and our team will get back to you within 24 hours.</p>
        
        <div class="highlight">
            <h3>Your ${isPropertyInquiry ? "Inquiry" : "Message"} Details:</h3>
            ${
              isPropertyInquiry
                ? `<p><strong>Property:</strong> ${data.propertyName}</p>`
                : ""
            }
            <p><strong>Subject:</strong> ${data.subject}</p>
            <p><strong>Message:</strong> ${data.message}</p>
            ${
              data.budget
                ? `<p><strong>Budget:</strong> ${data.budget}</p>`
                : ""
            }
            ${
              data.timeline
                ? `<p><strong>Timeline:</strong> ${data.timeline}</p>`
                : ""
            }
        </div>
        
        <p>In the meantime, feel free to browse our website for more properties and information.</p>
        
        <a href="${this.config.websiteUrl}" class="button">Visit Our Website</a>
        
        <p>If you have any urgent questions, please don't hesitate to contact us directly:</p>
        <p>📧 Email: ${this.config.ownerEmail}<br>
        📞 Phone: ${process.env.NEXT_PUBLIC_PHONE_NUMBER || "N/A"}</p>
        
        <p>Best regards,<br>The ${this.config.companyName} Team</p>
    </div>
    <div class="footer">
        <p>${this.config.companyName} | ${
      process.env.NEXT_PUBLIC_ADDRESS || ""
    }</p>
        <p>This is an automated message. Please do not reply to this email.</p>
    </div>
</body>
</html>`;
  }

  /**
   * Generate confirmation email text for enquirer
   */
  private static generateConfirmationEmailText(
    data: EmailData,
    isPropertyInquiry: boolean
  ): string {
    return `
Dear ${data.name},

Thank you for ${
      isPropertyInquiry ? "your interest in our property" : "contacting us"
    }. We have received your ${
      isPropertyInquiry ? "inquiry" : "message"
    } and our team will get back to you within 24 hours.

YOUR ${isPropertyInquiry ? "INQUIRY" : "MESSAGE"} DETAILS:
${isPropertyInquiry ? `Property: ${data.propertyName}\n` : ""}Subject: ${
      data.subject
    }
Message: ${data.message}
${data.budget ? `Budget: ${data.budget}\n` : ""}${
      data.timeline ? `Timeline: ${data.timeline}\n` : ""
    }

If you have any urgent questions, please contact us directly:
Email: ${this.config.ownerEmail}
Phone: ${process.env.NEXT_PUBLIC_PHONE_NUMBER || "N/A"}

Best regards,
The ${this.config.companyName} Team

---
${this.config.companyName}
${process.env.NEXT_PUBLIC_ADDRESS || ""}
This is an automated message. Please do not reply to this email.
    `.trim();
  }

  /**
   * Generate notification email HTML for owner
   */
  private static generateNotificationEmailHtml(
    data: EmailData,
    isPropertyInquiry: boolean
  ): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New ${isPropertyInquiry ? "Property Inquiry" : "Contact"} - ${
      this.config.companyName
    }</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .customer-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
        .inquiry-details { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .label { font-weight: bold; color: #495057; }
        .value { margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔔 New ${
          isPropertyInquiry ? "Property Inquiry" : "Contact Form Submission"
        }</h1>
        <p>You have received a new ${
          isPropertyInquiry ? "property inquiry" : "contact form submission"
        }</p>
    </div>
    <div class="content">
        <div class="customer-info">
            <h3>👤 Customer Information</h3>
            <div class="value"><span class="label">Name:</span> ${
              data.name
            }</div>
            <div class="value"><span class="label">Email:</span> ${
              data.email
            }</div>
            ${
              data.phone
                ? `<div class="value"><span class="label">Phone:</span> ${data.phone}</div>`
                : ""
            }
            ${
              data.company
                ? `<div class="value"><span class="label">Company:</span> ${data.company}</div>`
                : ""
            }
        </div>
        
        <div class="inquiry-details">
            <h3>${
              isPropertyInquiry
                ? "🏠 Property Inquiry Details"
                : "💬 Message Details"
            }</h3>
            ${
              isPropertyInquiry
                ? `<div class="value"><span class="label">Property:</span> ${data.propertyName}</div>`
                : ""
            }
            ${
              data.propertyUrl
                ? `<div class="value"><span class="label">Property URL:</span> <a href="${data.propertyUrl}">${data.propertyUrl}</a></div>`
                : ""
            }
            <div class="value"><span class="label">Subject:</span> ${
              data.subject
            }</div>
            <div class="value"><span class="label">Message:</span><br>${data.message.replace(
              /\n/g,
              "<br>"
            )}</div>
            ${
              data.budget
                ? `<div class="value"><span class="label">Budget:</span> ${data.budget}</div>`
                : ""
            }
            ${
              data.timeline
                ? `<div class="value"><span class="label">Timeline:</span> ${data.timeline}</div>`
                : ""
            }
        </div>
        
        <p><strong>📧 Reply to:</strong> ${data.email}</p>
        <p><strong>⏰ Received:</strong> ${new Date().toLocaleString()}</p>
        
        <p style="background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
            <strong>⚡ Action Required:</strong> Please respond to this inquiry within 24 hours to maintain excellent customer service.
        </p>
    </div>
</body>
</html>`;
  }

  /**
   * Generate notification email text for owner
   */
  private static generateNotificationEmailText(
    data: EmailData,
    isPropertyInquiry: boolean
  ): string {
    return `
NEW ${isPropertyInquiry ? "PROPERTY INQUIRY" : "CONTACT FORM SUBMISSION"}

CUSTOMER INFORMATION:
Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}\n` : ""}${
      data.company ? `Company: ${data.company}\n` : ""
    }

${isPropertyInquiry ? "PROPERTY INQUIRY" : "MESSAGE"} DETAILS:
${isPropertyInquiry ? `Property: ${data.propertyName}\n` : ""}${
      data.propertyUrl ? `Property URL: ${data.propertyUrl}\n` : ""
    }Subject: ${data.subject}
Message: ${data.message}
${data.budget ? `Budget: ${data.budget}\n` : ""}${
      data.timeline ? `Timeline: ${data.timeline}\n` : ""
    }

Reply to: ${data.email}
Received: ${new Date().toLocaleString()}

ACTION REQUIRED: Please respond to this inquiry within 24 hours.
    `.trim();
  }
}

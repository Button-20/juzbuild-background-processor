// Simplified email service for background processor
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendWebsiteCreationEmail(websiteData: {
  userEmail: string;
  companyName: string;
  websiteName: string;
  domain: string;
  theme: string;
  layoutStyle: string;
  websiteUrl: string;
  createdAt: string;
}): Promise<void> {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Your Website is Ready!</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #007bff; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .button { background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Your Website is Ready!</h1>
            </div>
            <div class="content">
                <h2>Hi there,</h2>
                <p>Great news! Your new real estate website <strong>${websiteData.websiteName}</strong> has been successfully created and is now live!</p>
                
                <h3>Website Details:</h3>
                <ul>
                    <li><strong>Website Name:</strong> ${websiteData.websiteName}</li>
                    <li><strong>Company:</strong> ${websiteData.companyName}</li>
                    <li><strong>Domain:</strong> <a href="${websiteData.websiteUrl}">${websiteData.domain}</a></li>
                    <li><strong>Theme:</strong> ${websiteData.theme}</li>
                    <li><strong>Layout:</strong> ${websiteData.layoutStyle}</li>
                </ul>

                <p>Your website includes:</p>
                <ul>
                    <li>Professional property listings</li>
                    <li>Custom branding with your selected colors</li>
                    <li>Contact forms and lead capture</li>
                    <li>Mobile-responsive design</li>
                </ul>

                <a href="${websiteData.websiteUrl}" class="button">View Your Website</a>

                <h3>Next Steps:</h3>
                <ol>
                    <li>Visit your new website at <a href="${websiteData.websiteUrl}">${websiteData.domain}</a></li>
                    <li>Add your own property listings</li>
                    <li>Upload your logo and images</li>
                    <li>Configure contact forms and lead capture</li>
                </ol>

                <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>

                <p>Welcome to Juzbuild!</p>
            </div>
            <div class="footer">
                <p>&copy; 2025 Juzbuild. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`;

  const mailOptions = {
    from: `Juzbuild <${process.env.EMAIL_USER}>`,
    to: websiteData.userEmail,
    subject: `🎉 Your Website is Live! - ${websiteData.companyName}`,
    html: emailHtml,
  };

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    await transporter.sendMail(mailOptions);
  } else {
    console.log(`Email would be sent to: ${websiteData.userEmail}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log("Email service not configured - skipping actual send");
  }
}

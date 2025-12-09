// Email service using Resend API
import { Resend } from "resend";

const resend = new Resend(process.env.JUZBUILD_RESEND_API_KEY);

export async function sendWebsiteCreationEmail(websiteData: {
  userEmail: string;
  companyName: string;
  websiteName: string;
  domain: string;
  theme: string;
  websiteUrl: string;
  createdAt: string;
}): Promise<void> {
  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Website is Live!</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            margin: 0; 
            padding: 0; 
            background-color: #f5f5f5; 
        }
        .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white; 
            border-radius: 12px; 
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            text-align: center; 
            padding: 40px 20px; 
        }
        .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: 700; 
        }
        .content { 
            padding: 40px 30px; 
        }
        .success-badge {
            background: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            display: inline-block;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 20px;
        }
        .website-info {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .info-item:last-child {
            border-bottom: none;
        }
        .info-label {
            font-weight: 600;
            color: #374151;
        }
        .info-value {
            color: #667eea;
            font-weight: 500;
        }
        .cta-button { 
            display: inline-block; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600; 
            margin: 20px 10px 20px 0; 
            transition: transform 0.2s;
        }
        .secondary-button { 
            display: inline-block; 
            background: white; 
            color: #667eea; 
            border: 2px solid #667eea;
            padding: 13px 28px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600; 
            margin: 20px 10px 20px 0; 
        }
        .features {
            background: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .feature-item {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        .feature-icon {
            width: 50px;
            height: 50px;
            background: #667eea;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            margin-right: 15px;
            flex-shrink: 0;
            line-height: 1;
        }
        .footer { 
            background: #f8fafc; 
            padding: 30px; 
            text-align: center; 
            color: #64748b;
            border-top: 1px solid #e2e8f0;
        }
        h2 { color: #1e293b; font-weight: 600; }
        h3 { color: #334155; font-weight: 600; margin-top: 30px; }
        a { color: #667eea; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Your Website is Live!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your professional real estate website has been created successfully</p>
        </div>
        
        <div class="content">
            <div class="success-badge">✅ Website Created Successfully</div>
            
            <h2>Hello ${websiteData.companyName}!</h2>
            <p>Great news! Your professional real estate website has been automatically created and is now live. Here are your website details:</p>
            
            <div class="website-info">
                <div class="info-item">
                    <span class="info-label">Website Name:</span>
                    <span class="info-value">${websiteData.websiteName}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Company:</span>
                    <span class="info-value">${websiteData.companyName}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Domain:</span>
                    <span class="info-value"><a href="${
                      websiteData.websiteUrl
                    }">${websiteData.domain}</a></span>
                </div>
                <div class="info-item">
                    <span class="info-label">Theme:</span>
                    <span class="info-value">${websiteData.theme}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Created:</span>
                    <span class="info-value">${websiteData.createdAt}</span>
                </div>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="${
                  websiteData.websiteUrl
                }" class="cta-button">🌐 View Your Website</a>
                <a href="https://juzbuild.com/dashboard" class="secondary-button">📊 Manage Website</a>
            </div>

            <div class="features">
                <h3>What's included in your website:</h3>
                
                <div class="feature-item">
                    <div class="feature-icon">🏠</div>
                    <div>
                        <strong>Property Listings</strong><br>
                        Modern property showcase with detailed information, image galleries, and filtering options
                    </div>
                </div>

                <div class="feature-item">
                    <div class="feature-icon">🎨</div>
                    <div>
                        <strong>Custom Branding</strong><br>
                        Your brand colors, logo, and personalized content reflecting your business identity
                    </div>
                </div>

                <div class="feature-item">
                    <div class="feature-icon">📱</div>
                    <div>
                        <strong>Mobile-Responsive Design</strong><br>
                        Perfect viewing experience across all devices - desktop, tablet, and mobile
                    </div>
                </div>

                <div class="feature-item">
                    <div class="feature-icon">📧</div>
                    <div>
                        <strong>Lead Capture Forms</strong><br>
                        Contact forms and inquiry systems to capture and manage potential clients
                    </div>
                </div>
            </div>

            <h3>🚀 Next Steps:</h3>
            <ol style="color: #475569;">
                <li>Visit your website and explore all the features</li>
                <li>Access your dashboard to manage properties and content</li>
                <li>Add your first property listings</li>
                <li>Customize your contact information and settings</li>
            </ol>

            <div style="background: #eff6ff; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; color: #1e40af;"><strong>Need Help?</strong> Our support team is here to assist you with any questions or customizations. Contact us anytime!</p>
            </div>

            <p>Welcome to Juzbuild! We're excited to see your real estate business thrive online.</p>
        </div>
        
        <div class="footer">
            <p style="margin: 0 0 10px 0;">&copy; ${new Date().getFullYear()} Juzbuild. All rights reserved.</p>
            <p style="margin: 0; font-size: 14px;">Professional real estate websites made simple.</p>
        </div>
    </div>
</body>
</html>`;

  const fromEmail =
    process.env.JUZBUILD_RESEND_FROM_EMAIL || "info@juzbuild.com";

  try {
    const result = await resend.emails.send({
      from: `Juzbuild <${fromEmail}>`,
      to: [websiteData.userEmail],
      subject: `🎉 Your Website is Live! - ${websiteData.companyName}`,
      html: emailHtml,
    });

    if (result.error) {
      console.error("❌ Resend API error:", result.error);
      throw new Error(`Resend error: ${result.error.message}`);
    }

    console.log(`✅ Email sent successfully to ${websiteData.userEmail}`);
    console.log(`📧 Email ID: ${result.data?.id}`);
  } catch (error) {
    console.error("Failed to send email via Resend:", error);
    throw error;
  }
}

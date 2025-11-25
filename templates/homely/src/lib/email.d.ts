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
export declare class EmailService {
    private static config;
    /**
     * Format source type for user-friendly display
     */
    private static formatSourceType;
    /**
     * Send confirmation email to the enquirer
     */
    static sendConfirmationEmail(data: EmailData): Promise<void>;
    /**
     * Send notification email to the website owner
     */
    static sendNotificationEmail(data: EmailData): Promise<void>;
    /**
     * Send both confirmation and notification emails
     */
    static sendEmails(data: EmailData): Promise<void>;
    /**
     * Generate confirmation email HTML for enquirer
     */
    private static generateConfirmationEmailHtml;
    /**
     * Generate confirmation email text for enquirer
     */
    private static generateConfirmationEmailText;
    /**
     * Generate notification email HTML for owner
     */
    private static generateNotificationEmailHtml;
    /**
     * Generate notification email text for owner
     */
    private static generateNotificationEmailText;
}
//# sourceMappingURL=email.d.ts.map
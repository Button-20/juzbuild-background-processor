/**
 * Client-side contact info fetcher
 * Uses the /api/contact-info endpoint to get contact data
 */
export interface ContactData {
    contact: {
        phone: string;
        email: string;
        supportEmail: string;
        whatsappNumber: string;
        address: string;
    };
    social: {
        facebook: string;
        twitter: string;
        instagram: string;
        linkedin: string;
        youtube: string;
    };
    logoUrl?: string;
}
export declare function fetchContactData(): Promise<ContactData>;
//# sourceMappingURL=contactInfo-client.d.ts.map
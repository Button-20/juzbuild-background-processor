export interface LeadData {
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
    source: "contact_form" | "property_inquiry";
    domain: string;
}
export interface Lead {
    _id?: string;
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
    source: "contact_form" | "property_inquiry";
    domain: string;
    priority: "high" | "medium" | "low";
    status: "new" | "contacted" | "qualified" | "converted" | "closed";
    createdAt: Date;
    updatedAt: Date;
}
export declare class LeadService {
    private static collectionName;
    /**
     * Format source type for user-friendly display
     */
    static formatSourceType(source: Lead["source"]): string;
    /**
     * Create a new lead from form data
     */
    static createLead(data: LeadData): Promise<Lead>;
    /**
     * Get all leads with pagination
     */
    static getLeads(page?: number, limit?: number, filter?: Partial<Pick<Lead, "status" | "priority" | "source">>): Promise<{
        leads: Lead[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    /**
     * Get a single lead by ID
     */
    static getLeadById(id: string): Promise<Lead | null>;
    /**
     * Update lead status
     */
    static updateLeadStatus(id: string, status: Lead["status"], notes?: string): Promise<boolean>;
    /**
     * Get lead statistics
     */
    static getLeadStats(): Promise<{
        total: number;
        byStatus: Record<Lead["status"], number>;
        byPriority: Record<Lead["priority"], number>;
        bySource: Record<Lead["source"], number>;
        recentCount: number;
    }>;
    /**
     * Calculate lead priority based on available information
     */
    private static calculatePriority;
    /**
     * Helper method to convert aggregation results to record
     */
    private static aggregateToRecord;
}
//# sourceMappingURL=lead.d.ts.map
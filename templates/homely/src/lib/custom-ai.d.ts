export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}
export interface PropertyContext {
    properties: any[];
    priceRange: {
        min: number;
        max: number;
    };
}
export interface ConversationState {
    sessionId: string;
    preferences: {
        propertyType?: string;
        bedrooms?: number;
        bathrooms?: number;
        budget?: {
            min?: number;
            max?: number;
        };
        location?: string;
        timeline?: string;
    };
    viewedProperties: string[];
    contactInfo: {
        name?: string;
        email?: string;
        phone?: string;
        budget?: string;
        timeline?: string;
    };
    conversationHistory: ChatMessage[];
    lastActivity: Date;
    userLocation?: {
        country: string;
        countryCode: string;
        currency: string;
        currencySymbol: string;
    };
}
export declare function formatPrice(price: number): string;
export declare function formatPriceForUser(price: number, currency?: string): string;
export declare function convertPriceForUser(priceInGHS: number, targetCurrency?: string): number;
export declare function initializeConversation(sessionId: string): ConversationState;
export declare function extractContactInfo(message: string, currentInfo: ConversationState["contactInfo"]): ConversationState["contactInfo"];
export declare function generateGeminiAIResponse(userMessage: string, conversationHistory: ChatMessage[], state: ConversationState, propertyContext: PropertyContext): Promise<{
    response: string;
    updatedState: ConversationState;
}>;
export declare function generateLead(state: ConversationState): {
    name: string;
    email: string | undefined;
    phone: string | undefined;
    message: string;
    source: "ai_chat";
    propertyId: string | undefined;
};
//# sourceMappingURL=custom-ai.d.ts.map
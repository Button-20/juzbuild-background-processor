"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
exports.GET = GET;
const custom_ai_1 = require("@/lib/custom-ai");
const lead_1 = require("@/lib/lead");
const location_currency_1 = require("@/lib/location-currency");
const mongodb_1 = __importDefault(require("@/lib/mongodb"));
const services_1 = require("@/services");
const server_1 = require("next/server");
// Simple in-memory conversation storage (for demo - use Redis or DB in production)
const conversationStore = new Map();
// Simple in-memory rate limiter
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 15; // 15 requests per minute
function getRateLimitKey(request) {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";
    return ip;
}
function checkRateLimit(key) {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW;
    const userLimit = rateLimitMap.get(key);
    if (!userLimit || userLimit.resetTime < windowStart) {
        rateLimitMap.set(key, { count: 1, resetTime: now });
        return true;
    }
    if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
        return false;
    }
    userLimit.count++;
    return true;
}
async function POST(request) {
    // Check rate limit first
    const rateLimitKey = getRateLimitKey(request);
    if (!checkRateLimit(rateLimitKey)) {
        return server_1.NextResponse.json({
            success: true,
            response: "I'm receiving a lot of messages right now. Please wait a moment before sending another message, or use the WhatsApp button to contact us directly! 📞",
        });
    }
    try {
        const { message, sessionId } = await request.json();
        if (!message || typeof message !== "string") {
            return server_1.NextResponse.json({ error: "Message is required" }, { status: 400 });
        }
        // Get or create conversation state
        const conversationKey = sessionId || "default";
        let conversationState = conversationStore.get(conversationKey);
        if (!conversationState) {
            conversationState = (0, custom_ai_1.initializeConversation)(conversationKey);
            // Detect user location for currency conversion
            try {
                const locationInfo = await (0, location_currency_1.getUserLocation)(request);
                conversationState.userLocation = {
                    country: locationInfo.country,
                    countryCode: locationInfo.countryCode,
                    currency: locationInfo.currency,
                    currencySymbol: locationInfo.currencySymbol,
                };
            }
            catch (error) {
                console.error("Failed to detect user location:", error);
                // Default to Ghana
                conversationState.userLocation = {
                    country: "Ghana",
                    countryCode: "GH",
                    currency: "GHS",
                    currencySymbol: "₵",
                };
            }
        }
        // Connect to database and get property context
        await (0, mongodb_1.default)();
        const propertyContext = await getPropertyContext();
        // Add user message to history
        const userMessage = {
            role: "user",
            content: message,
            timestamp: new Date(),
        };
        const conversationHistory = conversationState.conversationHistory || [];
        conversationHistory.push(userMessage);
        // Generate AI response using Gemini
        const { response, updatedState } = await (0, custom_ai_1.generateGeminiAIResponse)(message, conversationHistory, conversationState, propertyContext);
        // Add assistant response to history
        conversationHistory.push({
            role: "assistant",
            content: response,
            timestamp: new Date(),
        });
        // Keep only last 20 messages
        if (conversationHistory.length > 20) {
            conversationHistory.splice(0, conversationHistory.length - 20);
        }
        updatedState.conversationHistory = conversationHistory;
        // Update conversation state
        conversationStore.set(conversationKey, updatedState);
        // Check if lead should be generated (with all required info)
        const hasCompleteContactInfo = updatedState.contactInfo.email &&
            updatedState.contactInfo.phone &&
            updatedState.contactInfo.budget &&
            updatedState.contactInfo.timeline;
        if (hasCompleteContactInfo) {
            try {
                const leadData = (0, custom_ai_1.generateLead)(updatedState);
                if (leadData && leadData.email) {
                    await lead_1.LeadService.createLead({
                        name: leadData.name,
                        email: leadData.email,
                        phone: leadData.phone,
                        subject: "AI Chat - Property Inquiry",
                        message: leadData.message,
                        source: "property_inquiry",
                        domain: request.headers.get("host") || "localhost",
                    });
                }
            }
            catch (leadError) {
                console.error("Failed to create lead:", leadError);
            }
        }
        return server_1.NextResponse.json({
            success: true,
            response: response,
            sessionId: conversationKey,
            userLocation: updatedState.userLocation,
            debug: {
                preferences: updatedState.preferences,
                viewedProperties: updatedState.viewedProperties.length,
                hasContact: !!(updatedState.contactInfo.email || updatedState.contactInfo.phone),
                hasBudget: !!updatedState.contactInfo.budget,
                hasTimeline: !!updatedState.contactInfo.timeline,
                currency: updatedState.userLocation?.currency,
            },
        });
    }
    catch (error) {
        console.error("Gemini AI Chat error:", error);
        // Always provide a helpful fallback response
        return server_1.NextResponse.json({
            success: true,
            response: "I'm here to help you find your perfect property! 🏠 Tell me about your preferences - budget, location, bedrooms, etc.",
        });
    }
}
// GET method for health check
async function GET() {
    return server_1.NextResponse.json({
        success: true,
        message: "AI Chat API is running with custom conversation system",
        timestamp: new Date().toISOString(),
    });
}
async function getPropertyContext() {
    try {
        const propertiesResult = await services_1.PropertyService.findAll({
            isActive: true,
            limit: 50,
        });
        const properties = propertiesResult.properties || [];
        const prices = properties.map((p) => p.price).filter(Boolean);
        const priceRange = prices.length > 0
            ? { min: Math.min(...prices), max: Math.max(...prices) }
            : { min: 0, max: 0 };
        return {
            properties,
            priceRange,
        };
    }
    catch (error) {
        console.error("Error getting property context:", error);
        return {
            properties: [],
            priceRange: { min: 0, max: 0 },
        };
    }
}
//# sourceMappingURL=route.js.map
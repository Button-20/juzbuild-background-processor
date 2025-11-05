import {
  ConversationState,
  generateGeminiAIResponse,
  generateLead,
  initializeConversation,
  PropertyContext,
} from "@/lib/custom-ai";
import { LeadService } from "@/lib/lead";
import { getUserLocation } from "@/lib/location-currency";
import connectDB from "@/lib/mongodb";
import { PropertyService } from "@/services";
import { NextRequest, NextResponse } from "next/server";

// Simple in-memory conversation storage (for demo - use Redis or DB in production)
const conversationStore = new Map<string, ConversationState>();

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 15; // 15 requests per minute

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "unknown";
  return ip;
}

function checkRateLimit(key: string): boolean {
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

export async function POST(request: NextRequest) {
  // Check rate limit first
  const rateLimitKey = getRateLimitKey(request);
  if (!checkRateLimit(rateLimitKey)) {
    return NextResponse.json({
      success: true,
      response:
        "I'm receiving a lot of messages right now. Please wait a moment before sending another message, or use the WhatsApp button to contact us directly! 📞",
    });
  }

  try {
    const { message, sessionId } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get or create conversation state
    const conversationKey = sessionId || "default";
    let conversationState = conversationStore.get(conversationKey);

    if (!conversationState) {
      conversationState = initializeConversation(conversationKey);

      // Detect user location for currency conversion
      try {
        const locationInfo = await getUserLocation(request);
        conversationState.userLocation = {
          country: locationInfo.country,
          countryCode: locationInfo.countryCode,
          currency: locationInfo.currency,
          currencySymbol: locationInfo.currencySymbol,
        };
      } catch (error) {
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
    await connectDB();
    const propertyContext = await getPropertyContext();

    // Add user message to history
    const userMessage = {
      role: "user" as const,
      content: message,
      timestamp: new Date(),
    };

    const conversationHistory = conversationState.conversationHistory || [];
    conversationHistory.push(userMessage);

    // Generate AI response using Gemini
    const { response, updatedState } = await generateGeminiAIResponse(
      message,
      conversationHistory,
      conversationState,
      propertyContext
    );

    // Add assistant response to history
    conversationHistory.push({
      role: "assistant" as const,
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
    const hasCompleteContactInfo =
      updatedState.contactInfo.email &&
      updatedState.contactInfo.phone &&
      updatedState.contactInfo.budget &&
      updatedState.contactInfo.timeline;

    if (hasCompleteContactInfo) {
      try {
        const leadData = generateLead(updatedState);
        if (leadData && leadData.email) {
          await LeadService.createLead({
            name: leadData.name,
            email: leadData.email,
            phone: leadData.phone,
            subject: "AI Chat - Property Inquiry",
            message: leadData.message,
            source: "property_inquiry" as const,
            domain: request.headers.get("host") || "localhost",
          });
        }
      } catch (leadError) {
        console.error("Failed to create lead:", leadError);
      }
    }

    return NextResponse.json({
      success: true,
      response: response,
      sessionId: conversationKey,
      userLocation: updatedState.userLocation,
      debug: {
        preferences: updatedState.preferences,
        viewedProperties: updatedState.viewedProperties.length,
        hasContact: !!(
          updatedState.contactInfo.email || updatedState.contactInfo.phone
        ),
        hasBudget: !!updatedState.contactInfo.budget,
        hasTimeline: !!updatedState.contactInfo.timeline,
        currency: updatedState.userLocation?.currency,
      },
    });
  } catch (error) {
    console.error("Gemini AI Chat error:", error);

    // Always provide a helpful fallback response
    return NextResponse.json({
      success: true,
      response:
        "I'm here to help you find your perfect property! 🏠 Tell me about your preferences - budget, location, bedrooms, etc.",
    });
  }
}

// GET method for health check
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "AI Chat API is running with custom conversation system",
    timestamp: new Date().toISOString(),
  });
}

async function getPropertyContext(): Promise<PropertyContext> {
  try {
    const propertiesResult = await PropertyService.findAll({
      isActive: true,
      limit: 50,
    });

    const properties = propertiesResult.properties || [];

    const prices = properties.map((p) => p.price).filter(Boolean);
    const priceRange =
      prices.length > 0
        ? { min: Math.min(...prices), max: Math.max(...prices) }
        : { min: 0, max: 0 };

    return {
      properties,
      priceRange,
    };
  } catch (error) {
    console.error("Error getting property context:", error);
    return {
      properties: [],
      priceRange: { min: 0, max: 0 },
    };
  }
}

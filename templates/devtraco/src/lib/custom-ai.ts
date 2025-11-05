// Gemini-Powered AI Assistant for Property Inquiries
import { GoogleGenerativeAI } from "@google/generative-ai";
import { convertPrice, formatPriceWithCurrency } from "./location-currency";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

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
    timeline?: string; // When they want to move/buy
  };
  viewedProperties: string[];
  contactInfo: {
    name?: string;
    email?: string;
    phone?: string;
    budget?: string; // User's stated budget
    timeline?: string; // User's stated timeline
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

export function formatPrice(price: number): string {
  return "GHS " + price.toLocaleString();
}

export function formatPriceForUser(
  price: number,
  currency: string = "GHS"
): string {
  return formatPriceWithCurrency(price, currency);
}

export function convertPriceForUser(
  priceInGHS: number,
  targetCurrency: string = "GHS"
): number {
  return convertPrice(priceInGHS, targetCurrency);
}

export function initializeConversation(sessionId: string): ConversationState {
  return {
    sessionId,
    preferences: {},
    viewedProperties: [],
    contactInfo: {},
    conversationHistory: [],
    lastActivity: new Date(),
  };
}

function buildSystemPrompt(
  propertyContext: PropertyContext,
  state: ConversationState
): string {
  const userCurrency = state.userLocation?.currency || "GHS";
  const currencySymbol = state.userLocation?.currencySymbol || "₵";

  const availableProperties = propertyContext.properties
    .slice(0, 20)
    .map((p, idx) => {
      const convertedPrice = convertPrice(p.price, userCurrency);
      return {
        id: idx + 1,
        title: p.title,
        location: p.location || p.address,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        price: convertedPrice,
        priceFormatted: formatPriceWithCurrency(convertedPrice, userCurrency),
        features: p.features?.slice(0, 3),
      };
    });

  const minPrice = convertPrice(propertyContext.priceRange.min, userCurrency);
  const maxPrice = convertPrice(propertyContext.priceRange.max, userCurrency);

  return `You are a professional and friendly real estate assistant for a property listing platform in Ghana.

USER LOCATION: ${
    state.userLocation?.country || "Ghana"
  } (Currency: ${userCurrency})

AVAILABLE PROPERTIES:
${JSON.stringify(availableProperties, null, 2)}

PRICE RANGE: ${formatPriceWithCurrency(
    minPrice,
    userCurrency
  )} - ${formatPriceWithCurrency(maxPrice, userCurrency)}

USER PREFERENCES: ${JSON.stringify(state.preferences)}
CONTACT INFO: Email ${
    state.contactInfo.email ? "collected" : "needed"
  }, Phone ${state.contactInfo.phone ? "collected" : "needed"}, Budget ${
    state.contactInfo.budget ? "collected" : "needed"
  }, Timeline ${state.contactInfo.timeline ? "collected" : "needed"}

INSTRUCTIONS:
1. Help users find properties matching their budget, bedrooms, bathrooms, and location
2. When showing properties, format them clearly with emojis (🏠 💰 📍 🛏️ 🚿)
3. IMPORTANT: Always show prices in ${userCurrency} (${currencySymbol}) format from the provided data
4. When users express interest in viewing a property, collect ALL of the following:
   - Name
   - Email address
   - Phone number
   - **Budget range** (what they can afford)
   - **Timeline** (when they plan to move/buy - e.g., "immediately", "within 3 months", "next year")
5. Naturally ask for budget and timeline during the conversation if not provided
6. After collecting ALL contact info (including budget and timeline), confirm lead creation and that team will follow up
7. Be conversational, friendly, and helpful
8. Mention that prices are displayed in their local currency (${userCurrency}) but properties are in Ghana

Always be specific about properties and help users schedule viewings.`;
}

export function extractContactInfo(
  message: string,
  currentInfo: ConversationState["contactInfo"]
): ConversationState["contactInfo"] {
  const info = { ...currentInfo };

  const emailMatch = message.match(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
  );
  if (emailMatch) {
    info.email = emailMatch[0];
  }

  const phonePatterns = [
    /\b(?:\+233|0)(?:\d{9}|\d{10})\b/,
    /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/,
  ];

  for (const pattern of phonePatterns) {
    const match = message.match(pattern);
    if (match) {
      info.phone = match[0].replace(/[-.\s]/g, "");
      break;
    }
  }

  if (!info.name) {
    const namePatterns = [
      /(?:my name is|i'm|i am|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
      /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)(?:\s|$)/,
    ];

    for (const pattern of namePatterns) {
      const match = message.match(pattern);
      if (match) {
        info.name = match[1];
        break;
      }
    }
  }

  // Extract budget information
  if (!info.budget) {
    const budgetPatterns = [
      /budget\s+(?:is|of|around|about)?\s*(?:GHS|₵|\$|USD|EUR|GBP)?\s*([\d,]+(?:\s*(?:to|-)\s*[\d,]+)?)/i,
      /(?:afford|spend|looking\s+(?:to\s+spend|at))\s+(?:up\s+to\s+)?(?:GHS|₵|\$|USD|EUR|GBP)?\s*([\d,]+(?:\s*(?:to|-)\s*[\d,]+)?)/i,
      /(?:GHS|₵|\$|USD|EUR|GBP)\s*([\d,]+(?:\s*(?:to|-)\s*[\d,]+)?)\s+(?:budget|range)/i,
    ];

    for (const pattern of budgetPatterns) {
      const match = message.match(pattern);
      if (match) {
        info.budget = match[1].replace(/,/g, "");
        break;
      }
    }
  }

  // Extract timeline information
  if (!info.timeline) {
    const timelinePatterns = [
      /(?:move|buy|purchase|looking)\s+(?:in|within|by|around)\s+((?:next\s+)?(?:week|month|year|immediately|asap|soon|[0-9]+\s+(?:weeks?|months?|years?)))/i,
      /timeline\s+(?:is|of)?\s*:?\s*([^\n,.]+)/i,
      /(?:need|want|planning)\s+(?:it|to\s+move|to\s+buy)\s+(?:by|within|in)\s+((?:next\s+)?(?:week|month|year|immediately|asap|soon|[0-9]+\s+(?:weeks?|months?|years?)))/i,
      /(?:immediately|asap|urgently|as\s+soon\s+as\s+possible)/i,
    ];

    for (const pattern of timelinePatterns) {
      const match = message.match(pattern);
      if (match) {
        info.timeline = match[1] || "immediately";
        break;
      }
    }
  }

  return info;
}

export async function generateGeminiAIResponse(
  userMessage: string,
  conversationHistory: ChatMessage[],
  state: ConversationState,
  propertyContext: PropertyContext
): Promise<{ response: string; updatedState: ConversationState }> {
  const updatedState = { ...state, lastActivity: new Date() };
  updatedState.contactInfo = extractContactInfo(
    userMessage,
    updatedState.contactInfo
  );

  const systemPrompt = buildSystemPrompt(propertyContext, updatedState);
  const conversationContext = conversationHistory
    .slice(-10)
    .map(
      (msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
    )
    .join("\n\n");

  const fullPrompt = `${systemPrompt}

CONVERSATION HISTORY:
${conversationContext}

USER MESSAGE: ${userMessage}

Respond helpfully and professionally:`;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = result.response.text();

    const propertyNumberMatches = response.matchAll(
      /(?:property\s*)?(?:#|number\s*)?(\d+)/gi
    );
    for (const match of propertyNumberMatches) {
      const propIndex = parseInt(match[1]) - 1;
      if (propIndex >= 0 && propIndex < propertyContext.properties.length) {
        const propId = propertyContext.properties[propIndex]._id;
        if (!updatedState.viewedProperties.includes(propId)) {
          updatedState.viewedProperties.push(propId);
        }
      }
    }

    return { response, updatedState };
  } catch (error) {
    console.error("Gemini API Error:", error);

    const fallbackResponse =
      "I'm here to help you find your perfect property! 🏠\n\n" +
      "Tell me about:\n" +
      "💰 Your budget range\n" +
      "🛏️ Number of bedrooms\n" +
      "📍 Preferred location\n\n" +
      "What are you looking for?";

    return { response: fallbackResponse, updatedState };
  }
}

export function generateLead(state: ConversationState) {
  const { contactInfo, preferences, viewedProperties } = state;

  const budgetStr = preferences.budget
    ? ` (Budget: ${formatPrice(preferences.budget.min || 0)} - ${formatPrice(
        preferences.budget.max || 0
      )})`
    : contactInfo.budget
    ? ` (Budget: ${contactInfo.budget})`
    : "";

  const timelineStr = contactInfo.timeline
    ? ` | Timeline: ${contactInfo.timeline}`
    : preferences.timeline
    ? ` | Timeline: ${preferences.timeline}`
    : "";

  const preferencesStr =
    [
      preferences.propertyType,
      preferences.bedrooms ? `${preferences.bedrooms} bedrooms` : null,
      preferences.bathrooms ? `${preferences.bathrooms} bathrooms` : null,
      preferences.location ? `in ${preferences.location}` : null,
    ]
      .filter(Boolean)
      .join(", ") || "any property";

  return {
    name: contactInfo.name || "AI Chat User",
    email: contactInfo.email,
    phone: contactInfo.phone,
    message: `AI Chat Inquiry - Looking for: ${preferencesStr}${budgetStr}${timelineStr}. Viewed ${viewedProperties.length} properties.`,
    source: "ai_chat" as const,
    propertyId: viewedProperties[viewedProperties.length - 1] || undefined,
  };
}

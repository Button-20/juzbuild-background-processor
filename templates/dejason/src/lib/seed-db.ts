import { Property, propertyParser } from "@/models/Property";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import connectDB from "./mongodb";

const llm = new ChatOpenAI({
  temperature: 0.7,
  modelName: "gpt-4o-mini",
});

async function generateSyntheticProperties(): Promise<Property[]> {
  const prompt = `Generate a list of 15 diverse real estate properties with the following details for each property:
    - _id (optional MongoDB ObjectId string)
    - name (property name)
    - slug (URL-friendly version of name)
    - description (detailed property description)
    - location (full address)
    - price (numeric price value)
    - currency (GHS, USD, EUR, GBP, CAD, AUD)
    - propertyType (ObjectId string - use placeholder like "house-type-id")
    - status (for-sale, for-rent, sold, rented)
    - beds (number of bedrooms)
    - baths (number of bathrooms) 
    - area (area in square feet)
    - images (array of objects with src, alt, isMain properties)
    - amenities (array of amenity strings)
    - features (array of feature strings)
    - coordinates (object with lat/lng properties)
    - isActive (boolean, default true)
    - isFeatured (boolean)
    - userId (required string - use placeholder "user-id-placeholder")
    - websiteId (optional string)
    - domain (required string - use placeholder "example.com")
    - createdAt (current date)
    - updatedAt (current date)
    
    Ensure the data matches the updated property schema and is realistic and varied. Format the output as a JSON array.
    
    ${propertyParser.getFormatInstructions()}
    `;

  console.log("Generating properties...");

  const response = await llm.invoke(prompt);
  return propertyParser.parse(response.text as string);
}

async function createPropertySummary(property: Property): Promise<string> {
  return new Promise((resolve) => {
    const summary = `Property "${property.name}" located in ${
      property.location
    } is a ${property.status} ${property.propertyType} with ${
      property.beds
    } bedrooms and ${property.baths} bathrooms, priced at ${
      property.currency
    } ${property.price}. Key features include: ${property.features.join(
      ", "
    )}. Amenities available: ${property.amenities.join(", ")}.`;
    resolve(summary);
  });
}

export async function seedDatabase(userId: string, domain: string) {
  try {
    const { db } = await connectDB();
    console.log("Connected to MongoDB");

    const collection = db.collection("properties");
    await collection.deleteMany({});
    console.log("Cleared existing properties");

    const syntheticProperties = await generateSyntheticProperties();

    const recordsWithSummaries = await Promise.all(
      syntheticProperties.map(async (property) => ({
        pageContent: await createPropertySummary(property),
        metadata: {
          ...property,
          userId:
            property.userId === "user-id-placeholder"
              ? userId
              : property.userId,
          domain: property.domain === "example.com" ? domain : property.domain,
        },
      }))
    );

    for (const record of recordsWithSummaries) {
      await MongoDBAtlasVectorSearch.fromDocuments(
        [record],
        new OpenAIEmbeddings(),
        {
          collection,
          indexName: "property-index",
          textKey: "pageContent",
          embeddingKey: "embedding",
        }
      );

      console.log(`Inserted property: ${record.metadata.name}`);
    }
    console.log("Database seeding completed.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Example usage - replace with actual userId and domain when calling
// seedDatabase("user-id-here", "example.com").then(() => {
//   console.log("Seeding process finished.");
//   process.exit(0);
// });

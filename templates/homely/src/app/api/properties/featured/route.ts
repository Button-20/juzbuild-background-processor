import { PropertyService, PropertyTypeService } from "@/services";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch featured properties
    const featuredProperties = await PropertyService.findFeatured(1);

    if (!featuredProperties || featuredProperties.length === 0) {
      return NextResponse.json({
        property: null,
        message: "No featured property found",
      });
    }

    const featuredProperty = featuredProperties[0];

    // Get property type data for URL-friendly slug
    const propertyTypeData = await PropertyTypeService.findById(
      String(featuredProperty.propertyType)
    );

    // Transform the data
    const transformedProperty = {
      ...featuredProperty,
      _id: featuredProperty._id?.toString(),
      propertyType:
        propertyTypeData?.slug || String(featuredProperty.propertyType),
    };

    return NextResponse.json({
      property: transformedProperty,
    });
  } catch (error) {
    console.error("Featured property GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

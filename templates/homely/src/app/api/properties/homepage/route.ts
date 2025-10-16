import { PropertyService, PropertyTypeService } from "@/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "6");
    const featured = searchParams.get("featured");

    let properties;

    // If featured parameter is specified, get featured properties
    if (featured === "true") {
      properties = await PropertyService.findFeatured(limit);
    } else {
      // Get all properties with limit
      const result = await PropertyService.findAll({
        limit,
        skip: 0,
      });
      properties = result.properties;
    }

    // Get property types for URL-friendly slugs
    const propertyTypeIds: string[] = Array.from(
      new Set(properties.map((p) => String(p.propertyType)))
    ) as string[];
    const propertyTypes = await Promise.all(
      propertyTypeIds.map((id: string) => PropertyTypeService.findById(id))
    );
    const propertyTypeMap = new Map(
      propertyTypes.filter(Boolean).map((pt) => [pt!._id!.toString(), pt])
    );

    // Transform the data
    const transformedProperties = properties.map((property) => {
      const propertyTypeData = propertyTypeMap.get(
        String(property.propertyType)
      );
      return {
        ...property,
        _id: property._id?.toString(),
        propertyType: propertyTypeData?.slug || String(property.propertyType),
      };
    });

    return NextResponse.json({
      properties: transformedProperties,
      total: transformedProperties.length,
    });
  } catch (error) {
    console.error("Homepage properties GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

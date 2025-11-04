import connectDB from "@/lib/mongodb";
import {
  AboutPage,
  UpdateAboutPageInput,
  UpdateAboutPageSchema,
} from "@/schemas/About";

export class AboutService {
  private static async getCollection() {
    const { db } = await connectDB();
    return db.collection<AboutPage>("about-page");
  }

  // Get about page content
  static async get(): Promise<AboutPage | null> {
    const collection = await this.getCollection();
    const aboutPage = await collection.findOne({});
    return aboutPage;
  }

  // Create or update about page content
  static async upsert(data: UpdateAboutPageInput): Promise<AboutPage> {
    const validatedData = UpdateAboutPageSchema.parse(data);
    const collection = await this.getCollection();

    const existingPage = await collection.findOne({});

    if (existingPage) {
      // Update existing
      const result = await collection.findOneAndUpdate(
        {},
        {
          $set: {
            ...validatedData,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" }
      );

      return result as AboutPage;
    } else {
      // Create new with defaults
      const defaultData: AboutPage = {
        storyHeading: "Building Dreams, Creating Homes",
        missionText:
          "To deliver exceptional service and value to our clients, helping them achieve their real estate goals with integrity, transparency, and excellence. We strive to make every transaction seamless and rewarding.",
        visionText:
          "To be recognized as the leading real estate provider, setting standards for quality, innovation, and customer satisfaction. We envision a future where everyone finds their perfect property.",
        values: [
          {
            title: "Integrity",
            description:
              "Operating with honesty and transparency in all our dealings with clients",
            icon: "ph:shield-check",
            image:
              "https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170",
          },
          {
            title: "Excellence",
            description:
              "Striving for the highest quality in everything we do for our clients",
            icon: "ph:trophy",
            image:
              "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1073",
          },
          {
            title: "Innovation",
            description:
              "Embracing new ideas and creative solutions to serve you better",
            icon: "ph:lightbulb",
            image:
              "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1074",
          },
          {
            title: "Community",
            description:
              "Building lasting relationships and supporting our communities",
            icon: "ph:users-three",
            image:
              "https://images.unsplash.com/photo-1565402170291-8491f14678db?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1117",
          },
        ],
        statistics: [
          {
            value: "1000+",
            label: "Happy Clients",
            icon: "ph:users-three",
          },
          {
            value: "500+",
            label: "Properties Sold",
            icon: "ph:house-line",
          },
          {
            value: "15+",
            label: "Years Experience",
            icon: "ph:medal",
          },
          {
            value: "4.9",
            label: "Client Rating",
            icon: "ph:star",
          },
        ],
        ctaHeading: "Ready to Work With Us?",
        ctaDescription:
          "We're here to help you achieve your real estate goals. Get in touch with us today and let's start a conversation.",
        ctaImage:
          "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1074",
        storyImage: "/images/hero/heroBanner.png",
        createdAt: new Date(),
        updatedAt: new Date(),
        ...validatedData,
      };

      const result = await collection.insertOne(defaultData);
      return defaultData;
    }
  }
}

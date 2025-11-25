"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const TestimonialService_1 = require("@/services/TestimonialService");
const server_1 = require("next/server");
async function GET() {
    try {
        // Check if there are any testimonials in the database
        const { total } = await TestimonialService_1.TestimonialService.findAll({
            isActive: true,
            limit: 1,
        });
        // If no testimonials exist, seed with default data
        if (total === 0) {
            const defaultTestimonials = [
                {
                    name: "John Smith",
                    role: "Property Investor",
                    message: "Outstanding service from start to finish! The team helped me find the perfect investment property and guided me through every step of the process. Their market knowledge is exceptional.",
                    image: "https://res.cloudinary.com/dho8jec7k/image/upload/v1760939579/smiths_shdf7a.jpg",
                    rating: 5,
                    isActive: true,
                    order: 1,
                },
                {
                    name: "Sarah Johnson",
                    role: "First-time Buyer",
                    message: "As a first-time homebuyer, I was nervous about the process. But the team made everything so smooth and explained everything clearly. I couldn't be happier with my new home!",
                    image: "https://res.cloudinary.com/dho8jec7k/image/upload/v1760939605/mark_thpuxz.jpg",
                    rating: 5,
                    isActive: true,
                    order: 2,
                },
                {
                    name: "Michael Chen",
                    role: "Real Estate Developer",
                    company: "Chen Properties",
                    message: "Professional, reliable, and results-driven. They've helped us sell multiple high-value properties quickly and at great prices. Highly recommend their services.",
                    image: "https://res.cloudinary.com/dho8jec7k/image/upload/v1760939580/johns_s8iho8.jpg",
                    rating: 5,
                    isActive: true,
                    order: 3,
                },
            ];
            // Create default testimonials
            for (const testimonialData of defaultTestimonials) {
                await TestimonialService_1.TestimonialService.create(testimonialData);
            }
        }
        // Fetch testimonials for homepage
        const { testimonials } = await TestimonialService_1.TestimonialService.findAll({
            isActive: true,
            limit: 10,
        });
        return server_1.NextResponse.json({
            testimonials,
            total: testimonials.length,
        });
    }
    catch (error) {
        console.error("Testimonials GET error:", error);
        return server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        // Validate required fields
        const { name, role, message, image } = body;
        if (!name || !role || !message || !image) {
            return server_1.NextResponse.json({ error: "Name, role, message, and image are required" }, { status: 400 });
        }
        // Create new testimonial
        const testimonial = await TestimonialService_1.TestimonialService.create({
            name,
            role,
            company: body.company || "",
            message,
            image,
            rating: body.rating || 5,
            isActive: body.isActive !== undefined ? body.isActive : true,
            order: body.order || 0,
        });
        return server_1.NextResponse.json({ message: "Testimonial created successfully", testimonial }, { status: 201 });
    }
    catch (error) {
        console.error("Testimonial POST error:", error);
        return server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map
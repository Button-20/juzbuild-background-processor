"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const cloudinary_1 = require("cloudinary");
const server_1 = require("next/server");
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
async function POST(request) {
    try {
        // Debug: Check if Cloudinary is properly configured
        const config = cloudinary_1.v2.config();
        if (!config.cloud_name) {
            console.error("Cloudinary configuration error: Missing cloud_name");
            return server_1.NextResponse.json({ error: "Cloudinary configuration error: Missing cloud_name" }, { status: 500 });
        }
        const formData = await request.formData();
        const file = formData.get("file");
        if (!file) {
            return server_1.NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }
        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;
        // Upload to Cloudinary
        const result = await cloudinary_1.v2.uploader.upload(base64File, {
            folder: "real-estate-properties",
            resource_type: "image",
            transformation: [
                {
                    width: 1200,
                    height: 800,
                    crop: "limit",
                    quality: "auto:good",
                    format: "webp",
                },
            ],
        });
        return server_1.NextResponse.json({
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
        });
    }
    catch (error) {
        console.error("Cloudinary upload error:", error);
        return server_1.NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map
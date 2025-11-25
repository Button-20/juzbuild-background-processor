"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const BlogService_1 = require("@/services/BlogService");
const server_1 = require("next/server");
// GET /api/blogs/[slug] - Get a single blog by slug
async function GET(request, { params }) {
    try {
        const { slug } = await params;
        const blog = await BlogService_1.BlogService.findBySlug(slug);
        if (!blog) {
            return server_1.NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }
        // Increment views
        await BlogService_1.BlogService.incrementViews(blog._id.toString());
        // Get related blogs (same tags, excluding current blog)
        let relatedBlogs = [];
        if (blog.tags && blog.tags.length > 0) {
            // Get blogs with same tags
            for (const tag of blog.tags) {
                const tagBlogs = await BlogService_1.BlogService.findByTag(tag, 5);
                relatedBlogs.push(...tagBlogs.filter((rb) => rb._id.toString() !== blog._id.toString()));
            }
            // Remove duplicates and limit to 3
            const uniqueBlogs = relatedBlogs
                .filter((blog, index, self) => index ===
                self.findIndex((b) => b._id.toString() === blog._id.toString()))
                .slice(0, 3);
            relatedBlogs = uniqueBlogs;
        }
        // Transform blog to exclude content for related blogs
        const transformedRelatedBlogs = relatedBlogs.map((rb) => ({
            _id: rb._id.toString(),
            title: rb.title,
            slug: rb.slug,
            excerpt: rb.excerpt,
            coverImage: rb.coverImage,
            authorId: rb.authorId,
            author: rb.author, // Populated from authorId
            authorImage: rb.authorImage, // Populated from authorId
            tags: rb.tags,
            isPublished: rb.isPublished,
            publishedAt: rb.publishedAt,
            readTime: rb.readTime,
            views: rb.views,
            createdAt: rb.createdAt,
            updatedAt: rb.updatedAt,
        }));
        return server_1.NextResponse.json({
            blog: {
                _id: blog._id.toString(),
                ...blog,
            },
            relatedBlogs: transformedRelatedBlogs,
        });
    }
    catch (error) {
        console.error("Blog fetch error:", error);
        return server_1.NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map
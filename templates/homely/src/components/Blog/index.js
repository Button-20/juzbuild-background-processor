"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const blogCard_1 = __importDefault(require("@/components/shared/Blog/blogCard"));
const services_1 = require("@/services");
const react_1 = __importDefault(require("react"));
async function getBlogs() {
    try {
        const { blogs } = await services_1.BlogService.findAll({
            isPublished: true,
            limit: 20,
            skip: 0,
        });
        // Transform the data to match the Blog type
        return blogs.map((blog) => ({
            _id: blog._id?.toString(),
            title: blog.title,
            slug: blog.slug,
            content: blog.content,
            excerpt: blog.excerpt || "",
            coverImage: blog.coverImage || "",
            authorId: blog.authorId || "",
            author: blog.author || "Blog Author",
            authorImage: blog.authorImage || "",
            tags: blog.tags || [],
            isPublished: blog.isPublished,
            views: blog.views || 0,
            readTime: blog.readTime || 1,
            createdAt: blog.createdAt instanceof Date
                ? blog.createdAt.toISOString()
                : new Date(blog.createdAt || Date.now()).toISOString(),
            updatedAt: blog.updatedAt instanceof Date
                ? blog.updatedAt.toISOString()
                : new Date(blog.updatedAt || Date.now()).toISOString(),
        }));
    }
    catch (error) {
        console.error("Error fetching blogs:", error);
        return [];
    }
}
const BlogList = async () => {
    const blogs = await getBlogs();
    if (blogs.length === 0) {
        return ((0, jsx_runtime_1.jsx)("section", { className: "pt-0!", children: (0, jsx_runtime_1.jsx)("div", { className: "container max-w-8xl mx-auto px-5 2xl:px-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-semibold text-gray-900 dark:text-white mb-4", children: "No blogs found" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 dark:text-gray-400", children: "Check back later for new blog posts." })] }) }) }));
    }
    return ((0, jsx_runtime_1.jsx)("section", { className: "pt-0!", children: (0, jsx_runtime_1.jsx)("div", { className: "container max-w-8xl mx-auto px-5 2xl:px-0", children: (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-stretch", children: blogs.map((blog) => ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full", children: (0, jsx_runtime_1.jsx)(blogCard_1.default, { blog: blog }) }, blog._id))) }) }) }));
};
exports.default = BlogList;
//# sourceMappingURL=index.js.map
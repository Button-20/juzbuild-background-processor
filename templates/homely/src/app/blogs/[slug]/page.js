"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revalidate = void 0;
exports.generateMetadata = generateMetadata;
exports.default = BlogPost;
const jsx_runtime_1 = require("react/jsx-runtime");
const services_1 = require("@/services");
const react_1 = require("@iconify/react");
const date_fns_1 = require("date-fns");
const image_1 = __importDefault(require("next/image"));
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
// Enable static generation with revalidation
exports.revalidate = 300;
async function getBlogBySlug(slug) {
    try {
        const blog = await services_1.BlogService.findBySlug(slug);
        if (!blog || !blog.isPublished) {
            return null;
        }
        // The BlogService already returns the populated blog with author info
        // Just ensure proper type casting and string conversion
        return {
            _id: blog._id?.toString() || "",
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
        };
    }
    catch (error) {
        console.error("Error fetching blog:", error);
        return null;
    }
}
async function getRelatedBlogs(currentSlug, tags) {
    try {
        // Get related blogs with similar tags
        const { blogs } = await services_1.BlogService.findAll({
            isPublished: true,
            tags: tags.length > 0 ? tags : undefined,
            limit: 4, // Get one extra in case we need to filter out current blog
            skip: 0,
        });
        // Filter out current blog and limit to 3
        const filteredBlogs = blogs
            .filter((blog) => blog.slug !== currentSlug)
            .slice(0, 3);
        // Transform the data to match the Blog type
        return filteredBlogs.map((blog) => ({
            _id: blog._id?.toString() || "",
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
        console.error("Error fetching related blogs:", error);
        return [];
    }
}
async function generateMetadata({ params, }) {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);
    const siteName = process.env.SITE_NAME || "Homely Real Estate";
    const authorName = process.env.AUTHOR_NAME || "Homely Team";
    if (!blog) {
        return {
            title: "Blog Not Found",
            description: "The requested blog post could not be found.",
            author: authorName,
            robots: {
                index: false,
                follow: false,
            },
        };
    }
    return {
        title: `${blog.title} | ${siteName}`,
        description: blog.excerpt,
        author: blog.author || authorName,
        keywords: blog.tags.join(", "),
        openGraph: {
            title: blog.title,
            description: blog.excerpt,
            images: [blog.coverImage],
            type: "article",
            publishedTime: blog.createdAt,
            authors: [blog.author],
            tags: blog.tags,
        },
        robots: {
            index: true,
            follow: true,
            nocache: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };
}
async function BlogPost({ params, }) {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);
    if (!blog) {
        (0, navigation_1.notFound)();
    }
    const relatedBlogs = await getRelatedBlogs(slug, blog.tags);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("section", { className: "relative !pt-24 sm:!pt-32 lg:!pt-44 pb-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "container max-w-8xl mx-auto px-4 sm:px-6 lg:px-0", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(link_1.default, { href: "/blogs", className: "flex items-center gap-2 sm:gap-3 text-white bg-primary py-2.5 sm:py-3 px-3 sm:px-4 rounded-full w-fit hover:bg-dark duration-300 text-sm sm:text-base", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:arrow-left", width: 16, height: 16, className: "sm:w-5 sm:h-5" }), (0, jsx_runtime_1.jsx)("span", { children: "Go Back" })] }), (0, jsx_runtime_1.jsx)("h2", { className: "text-dark dark:text-white text-2xl sm:text-36 md:text-44 lg:text-52 leading-[1.2] font-semibold pt-6 sm:pt-7", children: blog.title }), (0, jsx_runtime_1.jsx)("h6", { className: "text-sm sm:text-base mt-4 sm:mt-5 text-dark dark:text-white", children: blog.excerpt })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 mt-8 sm:mt-10 lg:mt-12", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 sm:gap-4", children: [(0, jsx_runtime_1.jsx)(image_1.default, { src: blog.authorImage || "/images/users/alkesh.jpg", alt: blog.author || "Blog Author", className: "bg-no-repeat bg-contain inline-block rounded-full !w-10 !h-10 sm:!w-12 sm:!h-12 object-cover", width: 48, height: 48, quality: 100, unoptimized: true }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("span", { className: "text-sm sm:text-base text-dark dark:text-white", children: blog.author || "Blog Author" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-7", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 sm:gap-3", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "ph:clock", width: 16, height: 16, className: "sm:w-5 sm:h-5" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm sm:text-base text-dark font-medium dark:text-white", children: (() => {
                                                                try {
                                                                    return (0, date_fns_1.format)(new Date(blog.createdAt), "MMM dd, yyyy");
                                                                }
                                                                catch (error) {
                                                                    return "Date unavailable";
                                                                }
                                                            })() })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5 sm:gap-2", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "solar:eye-outline", className: "w-3.5 h-3.5 sm:w-4 sm:h-4" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs sm:text-sm text-dark dark:text-white", children: [blog.views, " views"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5 sm:gap-2", children: [(0, jsx_runtime_1.jsx)(react_1.Icon, { icon: "solar:clock-circle-outline", className: "w-3.5 h-3.5 sm:w-4 sm:h-4" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs sm:text-sm text-dark dark:text-white", children: [blog.readTime, " min"] })] }), blog.tags && blog.tags.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "py-1.5 sm:py-2.5 px-3 sm:px-5 bg-dark/5 rounded-full dark:bg-white/15", children: (0, jsx_runtime_1.jsx)("p", { className: "text-xs sm:text-sm font-semibold text-dark dark:text-white", children: blog.tags[0] }) }))] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "z-20 mt-8 sm:mt-10 lg:mt-12 overflow-hidden rounded", children: (0, jsx_runtime_1.jsx)(image_1.default, { src: blog.coverImage, alt: blog.title, width: 1170, height: 766, quality: 100, className: "h-full w-full object-cover object-center rounded-2xl sm:rounded-3xl" }) })] }) }), (0, jsx_runtime_1.jsx)("section", { className: "!pt-0 px-4", children: (0, jsx_runtime_1.jsx)("div", { className: "container max-w-8xl mx-auto px-4", children: (0, jsx_runtime_1.jsx)("div", { className: "-mx-4 flex flex-wrap justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "blog-details markdown xl:pr-10", children: (0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: { __html: blog.content } }) }) }) }) }), relatedBlogs.length > 0 && ((0, jsx_runtime_1.jsx)("section", { className: "py-16 bg-gray-50 dark:bg-gray-900", children: (0, jsx_runtime_1.jsxs)("div", { className: "container max-w-7xl mx-auto px-5 2xl:px-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center mb-12", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-bold text-dark dark:text-white mb-4", children: "Related Articles" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 dark:text-gray-400", children: "Discover more insights and tips" })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch", children: relatedBlogs.map((relatedBlog) => ((0, jsx_runtime_1.jsx)(link_1.default, { href: `/blogs/${relatedBlog.slug}`, className: "group block h-full", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col", children: [(0, jsx_runtime_1.jsx)("div", { className: "overflow-hidden", children: (0, jsx_runtime_1.jsx)(image_1.default, { src: relatedBlog.coverImage, alt: relatedBlog.title, className: "w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110", width: 400, height: 240, unoptimized: true }) }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6 flex flex-col flex-grow", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-dark dark:text-white group-hover:text-primary transition-colors duration-300 mb-2 line-clamp-2 min-h-[3.5rem]", children: relatedBlog.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-grow", children: relatedBlog.excerpt }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto", children: [(0, jsx_runtime_1.jsx)("span", { children: (() => {
                                                                try {
                                                                    return (0, date_fns_1.format)(new Date(relatedBlog.createdAt), "MMM dd, yyyy");
                                                                }
                                                                catch (error) {
                                                                    return "Date unavailable";
                                                                }
                                                            })() }), (0, jsx_runtime_1.jsxs)("span", { children: [relatedBlog.readTime, " min read"] })] })] })] }) }, relatedBlog._id))) })] }) }))] }));
}
//# sourceMappingURL=page.js.map
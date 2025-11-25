"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostSlugs = getPostSlugs;
exports.getPostBySlug = getPostBySlug;
exports.getAllPosts = getAllPosts;
const fs_1 = __importDefault(require("fs"));
const gray_matter_1 = __importDefault(require("gray-matter"));
const path_1 = require("path");
const postsDirectory = (0, path_1.join)(process.cwd(), "markdown/blogs");
function getPostSlugs() {
    return fs_1.default.readdirSync(postsDirectory);
}
function getPostBySlug(slug, fields = []) {
    const realSlug = slug.replace(/\.mdx$/, "");
    const fullPath = (0, path_1.join)(postsDirectory, `${realSlug}.mdx`);
    const fileContents = fs_1.default.readFileSync(fullPath, "utf8");
    const { data, content } = (0, gray_matter_1.default)(fileContents);
    const items = {};
    function processImages(content) {
        // You can modify this function to handle image processing
        // For example, replace image paths with actual HTML image tags
        return content.replace(/!\[.*?\]\((.*?)\)/g, '<img src="$1" alt="" />');
    }
    // Ensure only the minimal needed data is exposed
    fields.forEach((field) => {
        if (field === "slug") {
            items[field] = realSlug;
        }
        if (field === "content") {
            // You can modify the content here to include images
            items[field] = processImages(content);
        }
        if (field === "metadata") {
            // Include metadata, including the image information
            items[field] = { ...data, coverImage: data.coverImage || null };
        }
        if (typeof data[field] !== "undefined") {
            items[field] = data[field];
        }
    });
    return items;
}
function getAllPosts(fields = []) {
    const slugs = getPostSlugs();
    const posts = slugs
        .map((slug) => getPostBySlug(slug, fields))
        // sort posts by date in descending order
        .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
    return posts;
}
//# sourceMappingURL=markdown.js.map
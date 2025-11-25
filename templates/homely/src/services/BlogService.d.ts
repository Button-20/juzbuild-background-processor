import { Blog, BlogFilters, CreateBlogInput, UpdateBlogInput } from "@/schemas/Blog";
export declare class BlogService {
    private static getCollection;
    private static getAuthorCollection;
    private static populateAuthor;
    private static populateAuthorsForBlogs;
    static create(data: CreateBlogInput): Promise<Blog>;
    static findById(id: string): Promise<Blog | null>;
    static findBySlug(slug: string): Promise<Blog | null>;
    static update(id: string, data: UpdateBlogInput): Promise<Blog | null>;
    static delete(id: string): Promise<boolean>;
    static findAll(filters?: Partial<BlogFilters>): Promise<{
        blogs: Blog[];
        total: number;
    }>;
    static findPublished(limit?: number): Promise<Blog[]>;
    static findByTag(tag: string, limit?: number): Promise<Blog[]>;
    static incrementViews(id: string): Promise<void>;
    static togglePublished(id: string): Promise<Blog | null>;
    static getStats(): Promise<{
        total: number;
        published: number;
        draft: number;
        totalViews: number;
    }>;
    static getAllTags(): Promise<string[]>;
}
//# sourceMappingURL=BlogService.d.ts.map
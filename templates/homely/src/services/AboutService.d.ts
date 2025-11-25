import { AboutPage, UpdateAboutPageInput } from "@/schemas/About";
export declare class AboutService {
    private static getCollection;
    static get(): Promise<AboutPage | null>;
    static upsert(data: UpdateAboutPageInput): Promise<AboutPage>;
}
//# sourceMappingURL=AboutService.d.ts.map
export declare const revalidate = 300;
export declare function generateMetadata({ params, }: {
    params: Promise<{
        slug: string;
    }>;
}): Promise<{
    title: string;
    description: string;
    author: string;
    robots: {
        index: boolean;
        follow: boolean;
        nocache?: never;
        googleBot?: never;
    };
    keywords?: never;
    openGraph?: never;
} | {
    title: string;
    description: any;
    author: any;
    keywords: any;
    openGraph: {
        title: any;
        description: any;
        images: any[];
        type: string;
        publishedTime: any;
        authors: any[];
        tags: any;
    };
    robots: {
        index: boolean;
        follow: boolean;
        nocache: boolean;
        googleBot: {
            index: boolean;
            follow: boolean;
            "max-video-preview": number;
            "max-image-preview": string;
            "max-snippet": number;
        };
    };
}>;
export default function BlogPost({ params, }: {
    params: Promise<{
        slug: string;
    }>;
}): Promise<any>;
//# sourceMappingURL=page.d.ts.map
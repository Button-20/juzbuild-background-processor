import ConditionalLayout from "@/components/Layout/ConditionalLayout";
import ChatWidgets from "@/components/shared/ChatWidgets";
import {
  generatePageMetadata,
  generateStructuredData,
  SEO_CONFIG,
} from "@/lib/seo";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Bricolage_Grotesque } from "next/font/google";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const font = Bricolage_Grotesque({ subsets: ["latin"] });

// Enhanced metadata with dynamic SEO
export const metadata: Metadata = {
  metadataBase: new URL(SEO_CONFIG.WEBSITE_URL),
  ...generatePageMetadata.homepage(),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "{{GOOGLE_VERIFICATION_CODE}}", // Will be replaced with user's verification code
    other: {
      "facebook-domain-verification": "{{FACEBOOK_VERIFICATION_CODE}}",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateStructuredData.organization();

  return (
    <html lang="en">
      <head>
        {/* Organization Schema */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        {/* Additional Meta Tags */}
        <meta name="geo.region" content="{{GEO_REGION}}" />
        <meta name="geo.placename" content="{{GEO_PLACENAME}}" />
        <meta name="geo.position" content="{{GEO_POSITION}}" />
        <meta name="ICBM" content="{{GEO_POSITION}}" />

        {/* Google Analytics - Will be replaced with user's tracking ID */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id={{GA_TRACKING_ID}}"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '{{GA_TRACKING_ID}}');
          `}
        </Script>

        {/* Facebook Pixel - Will be replaced with user's pixel ID */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '{{FACEBOOK_PIXEL_ID}}');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
      </head>
      <body className={`${font.className} bg-white dark:bg-black antialiased`}>
        <NextTopLoader color="#07be8a" />
        <ThemeProvider
          attribute="class"
          enableSystem={true}
          defaultTheme="light"
        >
          <ConditionalLayout>{children}</ConditionalLayout>
          <ChatWidgets />
        </ThemeProvider>
      </body>
    </html>
  );
}

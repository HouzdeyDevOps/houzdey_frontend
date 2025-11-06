import type { Metadata } from "next";
import "../styles/globals.css";
import { AppProviders } from "./providers/providers";
import Navbar from "@/components/navbar/Navbar";
import ChatNotification from "@/components/chat/chat-notification";
import HydrationFix from "@/components/HydrationFix";
import { Toaster } from 'sonner';

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Houzdey - Find Your Perfect Home",
  description: "Discover and rent your ideal home with Houzdey. Browse apartments, houses, and more with our easy-to-use property rental platform.",
  keywords: "property rental, house rent, apartments, real estate, Nigeria housing",
  authors: [{ name: "Houzdey" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://www.houzdey.com'),
  openGraph: {
    title: "Houzdey - Find Your Perfect Home",
    description: "Discover and rent your ideal home with Houzdey. Browse apartments, houses, and more with our easy-to-use property rental platform.",
    url: "https://www.houzdey.com/",
    siteName: "Houzdey",
    images: [
      {
        url: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1687888425/houzdey-logo_p2we1a.png`,
        width: 1200,
        height: 630,
        alt: 'Houzdey Logo',
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Houzdey - Find Your Perfect Home",
    description: "Discover and rent your ideal home with Houzdey",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: 'https://www.houzdey.com/',
    name: 'Houzdey',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.houzdey.com/properties?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased transition-colors duration-200`}
        suppressHydrationWarning
      >
        {/* SEO: Add WebSite JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <AppProviders>
          <HydrationFix />
          {children}
          <ChatNotification />
          <Toaster 
            // position="top-right"
            expand={false}
            richColors
            theme="system"
          />
        </AppProviders>
      </body>
    </html>
  );
}

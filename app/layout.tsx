import type { Metadata } from "next";
import Script from "next/script";
import "../styles/globals.css";
import { AppProviders } from "./providers/providers";
import HydrationFix from "@/components/HydrationFix";
import { Toaster } from "sonner";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Houzdey - Find Your Perfect Home in Nigeria",
    template: "%s | Houzdey",
  },
  description:
    "Discover and rent or buy your ideal home with Houzdey. Browse apartments, houses, and more properties for rent and sale across Nigeria.",
  keywords:
    "property rental, house rent, apartments, real estate, Nigeria housing, houses for sale, property for sale, Lagos property, Abuja property, Enugu property, Port Harcourt property",
  authors: [{ name: "Houzdey" }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://houzdey.com"
  ),
  icons: {
    icon: "/assets/images/favicon.png",
    apple: "/assets/icons/apple.png",
  },
  other: {
    "geo.region": "NG",
    "geo.country": "Nigeria",
    "geo.placename": "Nigeria",
    "DC.title": "Houzdey - Find Your Perfect Home in Nigeria",
    "DC.subject": "Real Estate, Property Rental, Property for Sale, Nigeria",
    "DC.language": "en-NG",
  },
  openGraph: {
    title: "Houzdey - Find Your Perfect Home in Nigeria",
    description:
      "Discover and rent or buy your ideal home with Houzdey. Browse apartments, houses, and more properties for rent and sale across Nigeria.",
    url: "https://houzdey.com",
    siteName: "Houzdey",
    images: [
      {
        url: "https://houzdey.com/assets/images/houzdey-og-image.png",
        width: 1200,
        height: 630,
        alt: "Houzdey - Find Your Perfect Home",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Houzdey - Find Your Perfect Home in Nigeria",
    description: "Discover and rent or buy your ideal home with Houzdey",
    site: "@houzdey",
    images: ["https://houzdey.com/assets/images/houzdey-og-image.png"],
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
  alternates: {
    canonical: "/",
  },
  verification: {
    // Add when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://houzdey.com",
    name: "Houzdey",
    description:
      "Find your perfect home - properties for rent and sale across Nigeria",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://houzdey.com"
        }/properties?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Houzdey",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://houzdey.com",
    logo: `${
      process.env.NEXT_PUBLIC_BASE_URL || "https://houzdey.com"
    }/assets/images/houzdey-logo.png`,
    description: "Nigeria's property platform for renting and buying homes. Browse thousands of apartments, flats, and houses for rent and sale across Lagos, Abuja, Enugu, and more.",
    areaServed: {
      "@type": "Country",
      name: "Nigeria"
    },
    knowsAbout: ["Real Estate", "Property Rental", "Property for Sale", "Nigeria Housing Market"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "English",
      url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://houzdey.com"}/support/contact`
    },
    sameAs: [
      "https://www.facebook.com/people/Houzdey/61583662165446/",
      "https://www.linkedin.com/company/houzdey/",
      "https://www.instagram.com/houzdey/",
    ],
  };
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-DDF0PY4Z61"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-DDF0PY4Z61');
        `}
      </Script>
      <body
        className={`antialiased transition-colors duration-200`}
        suppressHydrationWarning
      >
        {/* SEO: Add WebSite JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* SEO: Add Organization JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <AppProviders>
          <HydrationFix />
          {children}
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

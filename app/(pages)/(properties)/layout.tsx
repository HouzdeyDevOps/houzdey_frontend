import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties for Rent and Sale in Nigeria | Houzdey",
  description:
    "Browse thousands of apartments, houses, flats, and duplexes for rent and sale across Nigeria. Find your perfect home in Lagos, Abuja, Enugu, Port Harcourt, and more.",
  keywords:
    "properties for rent Nigeria, houses for sale Nigeria, apartments for rent Lagos, properties Abuja, houses Enugu, real estate Nigeria, rent apartment Nigeria, buy property Nigeria",
  openGraph: {
    title: "Properties for Rent and Sale in Nigeria | Houzdey",
    description:
      "Browse thousands of apartments, houses, flats, and duplexes for rent and sale across Nigeria.",
    url: "https://houzdey.com",
    siteName: "Houzdey",
    images: [
      {
        url: "https://houzdey.com/assets/images/houzdey-og-image.png",
        width: 1200,
        height: 630,
        alt: "Houzdey - Properties for Rent and Sale in Nigeria",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Properties for Rent and Sale in Nigeria | Houzdey",
    description: "Find your perfect home. Browse thousands of listings across Nigeria.",
    site: "@houzdey",
    images: ["https://houzdey.com/assets/images/houzdey-og-image.png"],
  },
  alternates: {
    canonical: "https://houzdey.com",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "geo.region": "NG",
    "geo.placename": "Nigeria",
  },
};

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

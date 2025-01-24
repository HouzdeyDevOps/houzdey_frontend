import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { AppProviders } from "./providers";


export const metadata: Metadata = {
  title: "Houzdey - Find Your Perfect Home",
  description: "Discover and rent your ideal home with Houzdey. Browse apartments, houses, and more with our easy-to-use property rental platform.",
  keywords: "property rental, house rent, apartments, real estate, Nigeria housing",
  authors: [{ name: "Houzdey" }],
  openGraph: {
    title: "Houzdey - Find Your Perfect Home",
    description: "Discover and rent your ideal home with Houzdey. Browse apartments, houses, and more with our easy-to-use property rental platform.",
    url: "https://www.houzdey.com/",
    siteName: "Houzdey",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Houzdey - Find Your Perfect Home",
    description: "Discover and rent your ideal home with Houzdey",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased transition-colors duration-200`}
      >
        <AppProviders>{children}</AppProviders>
        </body>
    </html>
  );
}

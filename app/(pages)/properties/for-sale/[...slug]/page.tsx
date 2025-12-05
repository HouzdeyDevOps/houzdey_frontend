import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getPropertyBySlugServer } from "@/lib/server-api";
import PropertyDetailsClient from "@/components/properties/PropertyDetailsClient";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

/**
 * Generate dynamic metadata for property pages using SEO-friendly slugs
 * Critical for SEO - provides unique title, description, and OG tags per property
 */
export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Next.js 15: await params before accessing properties
  const { slug } = await params;
  const fullSlug = `for-sale/${slug.join("/")}`;
  
  const property = await getPropertyBySlugServer(fullSlug);

  if (!property) {
    return {
      title: "Property Not Found - Houzdey",
      description: "This property could not be found.",
    };
  }

  // Create SEO-friendly description (first 155 characters)
  const description = property.description
    ? property.description.substring(0, 155) + "..."
    : `${property.beds} bed${property.beds !== 1 ? 's' : ''}, ${property.baths} bath${property.baths !== 1 ? 's' : ''} ${property.type} for sale in ${property.lga}, ${property.state}`;

  // Format price for title
  const priceDisplay = `₦${(property.sale_price || property.price).toLocaleString()}`;

  // Build SEO-optimized title
  const title = `${property.title} - ${priceDisplay} | Houzdey`;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://houzdey.com';
  const propertyUrl = `${baseUrl}/properties/${fullSlug}`;

  return {
    title,
    description,
    keywords: [
      property.type,
      'for sale',
      property.state,
      property.lga,
      `${property.beds} bedroom`,
      'Nigeria property',
      'real estate',
    ].join(', '),
    openGraph: {
      title: property.title,
      description,
      url: propertyUrl,
      siteName: "Houzdey",
      images: [
        {
          url: property.images[0],
          width: 1200,
          height: 630,
          alt: property.title,
        },
        ...property.images.slice(1, 4).map((img) => ({
          url: img,
          width: 1200,
          height: 630,
          alt: property.title,
        })),
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: property.title,
      description,
      images: [property.images[0]],
    },
    alternates: {
      canonical: propertyUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Server Component - Property Details Page (SEO-friendly slug URLs)
 * Fetches data server-side for SEO and performance
 */
export default async function PropertyDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const fullSlug = `for-sale/${slug.join("/")}`;
  const property = await getPropertyBySlugServer(fullSlug);

  if (!property) {
    notFound();
  }

  // Generate JSON-LD structured data for SEO
  const propertyJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    image: property.images,
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://houzdey.com'}/properties/${fullSlug}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: property.lga,
      addressRegion: property.state,
      addressCountry: "NG",
    },
    price: property.sale_price || property.price,
    priceCurrency: "NGN",
    numberOfRooms: property.beds,
    numberOfBathroomsTotal: property.baths,
    floorSize: property.size ? {
      "@type": "QuantitativeValue",
      value: property.size,
      unitText: "sqm"
    } : undefined,
    amenityFeature: property.amenities.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity.name,
    })),
  };

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://houzdey.com'}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Properties",
        item: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://houzdey.com'}/properties`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: property.title,
        item: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://houzdey.com'}/properties/${fullSlug}`,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      <PropertyDetailsClient property={property} />
    </>
  );
}
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
  const avgRating = property.reviews?.length
    ? property.reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / property.reviews.length
    : null;

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
    aggregateRating: avgRating ? {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      reviewCount: property.reviews.length,
    } : undefined,
    offers: {
      "@type": "Offer",
      price: property.sale_price || property.price,
      priceCurrency: "NGN",
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "PriceSpecification",
        price: property.sale_price || property.price,
        priceCurrency: "NGN"
      }
    },
    floorSize: property.size ? {
      "@type": "QuantitativeValue",
      value: property.size,
      unitText: "sqm"
    } : undefined,
    amenityFeature: property.amenities.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity.name,
    })),
    datePosted: property.created_at,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Number of Bedrooms",
        value: property.beds
      },
      {
        "@type": "PropertyValue",
        name: "Number of Bathrooms",
        value: property.baths
      },
      {
        "@type": "PropertyValue",
        name: "Property Type",
        value: property.type
      },
      {
        "@type": "PropertyValue",
        name: "Listing Type",
        value: "For Sale"
      },
      {
        "@type": "PropertyValue",
        name: "Furnishing",
        value: property.furnishing || "Unfurnished"
      },
      {
        "@type": "PropertyValue",
        name: "Condition",
        value: property.condition || "Good"
      },
      {
        "@type": "PropertyValue",
        name: "Address",
        value: `${property.address}, ${property.lga}, ${property.state}, Nigeria`
      }
    ].filter(Boolean),
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

  // FAQ JSON-LD for AEO (Answer Engine Optimization)
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much does this property cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The sale price for this ${property.type} is ₦${(property.sale_price || property.price).toLocaleString()}. ${property.agency_fee ? `Agency fee: ₦${property.agency_fee.toLocaleString()}.` : ''} ${property.legal_fee ? `Legal fee: ₦${property.legal_fee.toLocaleString()}.` : ''}`
        }
      },
      {
        "@type": "Question",
        "name": "What amenities are included in this property?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": property.amenities.length > 0 
            ? `This property includes the following amenities: ${property.amenities.map(a => a.name).join(', ')}.`
            : "Please contact the property owner for details about available amenities."
        }
      },
      {
        "@type": "Question",
        "name": "Where is this property located?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `This property is located at ${property.address}, ${property.lga}, ${property.state}, Nigeria.${property.estate ? ` It is in ${property.estate}.` : ''}`
        }
      },
      {
        "@type": "Question",
        "name": "How many bedrooms and bathrooms does this property have?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `This ${property.type} has ${property.beds} bedroom${property.beds !== 1 ? 's' : ''} and ${property.baths} bathroom${property.baths !== 1 ? 's' : ''}.${property.toilets ? ` It also has ${property.toilets} toilet${property.toilets !== 1 ? 's' : ''}.` : ''}`
        }
      },
      {
        "@type": "Question",
        "name": "Is this property furnished or unfurnished?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `This property is ${property.furnishing || 'unfurnished'}.`
        }
      },
      {
        "@type": "Question",
        "name": "What is the condition of this property?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `This property is in ${property.condition || 'good'} condition.`
        }
      },
      property.size ? {
        "@type": "Question",
        "name": "What is the size of this property?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `This property has a floor size of ${property.size}.`
        }
      } : null
    ].filter(Boolean)
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      
      <PropertyDetailsClient property={property} />
    </>
  );
}
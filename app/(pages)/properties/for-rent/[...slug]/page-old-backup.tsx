import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import PropertyImageGallery from "@/components/properties/PropertyImageGallery";
import PropertyContactSection from "@/components/properties/PropertyContactSection";
import { getAmenityIcon } from "@/utils/iconUtils";
import { formatLocation } from "@/utils/formatLocation";
import { generateGoogleMapsEmbedUrl } from "@/utils/mapUtils";
import { getPropertyBySlugServer } from "@/lib/server-api";

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
  const fullSlug = `for-rent/${slug.join("/")}`;
  
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
    : `${property.beds} bed${property.beds !== 1 ? 's' : ''}, ${property.baths} bath${property.baths !== 1 ? 's' : ''} ${property.type} for rent in ${property.lga}, ${property.state}`;

  // Format price for title
  const priceDisplay = `₦${(property.rental_price || property.price).toLocaleString()}/year`;

  // Build SEO-optimized title
  const title = `${property.title} - ${priceDisplay} | Houzdey`;

  // Get primary image for OG tags
  const primaryImage = property.images?.[0] || "/assets/placeholder-property.jpg";

  return {
    title,
    description,
    keywords: [
      property.type,
      "for rent",
      property.lga,
      property.state,
      "Nigeria",
      `${property.beds} bedroom`,
      property.furnishing,
      ...(property.amenities?.map((a: any) => a.name) || []),
    ].join(", "),
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://houzdey.com/properties/${fullSlug}`,
      images: [
        {
          url: primaryImage,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
      siteName: "Houzdey",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [primaryImage],
    },
    alternates: {
      canonical: `https://houzdey.com/properties/${fullSlug}`,
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  // Next.js 15: await params before accessing properties
  const { slug } = await params;
  const fullSlug = `for-rent/${slug.join("/")}`;

  // Fetch property data on the server
  const property = await getPropertyBySlugServer(fullSlug);

  // Handle 404
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
    price: property.rental_price || property.price,
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

      <div className="min-h-screen bg-white">
        <Navbar showSearch={false} showPropertyTypeFilters={false} />
        <main className="max-w-7xl mx-auto px-8 py-4 mt-24">
        {/* Back Button */}
        <Link
          href="/properties"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Properties
        </Link>

        {/* Property Title & Price */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {property.title}
            </h1>
            <p className="text-lg text-gray-600">
              {formatLocation(property.address)}, {formatLocation(property.lga)}, {formatLocation(property.state)}
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <p className="text-3xl font-bold text-primary">
              ₦{(property.rental_price || property.price).toLocaleString()}
              <span className="text-lg text-gray-600">/year</span>
            </p>
            {property.agency_fee && (
              <p className="text-sm text-gray-500 mt-1">
                Agency Fee: ₦{property.agency_fee.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <PropertyImageGallery images={property.images} title={property.title} />

            {/* Property Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Property Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Bedrooms</span>
                  <span className="text-xl font-semibold">{property.beds}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Bathrooms</span>
                  <span className="text-xl font-semibold">{property.baths}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Toilets</span>
                  <span className="text-xl font-semibold">{property.toilets}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Type</span>
                  <span className="text-xl font-semibold capitalize">
                    {property.type}
                  </span>
                </div>
                {property.furnishing && (
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">Furnishing</span>
                    <span className="text-xl font-semibold capitalize">
                      {property.furnishing.replace("_", " ")}
                    </span>
                  </div>
                )}
                {property.condition && (
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">Condition</span>
                    <span className="text-xl font-semibold capitalize">
                      {property.condition.replace("_", " ")}
                    </span>
                  </div>
                )}
                {property.size && (
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">Size</span>
                    <span className="text-xl font-semibold">{property.size}</span>
                  </div>
                )}
                {property.estate && (
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">Estate</span>
                    <span className="text-xl font-semibold">{property.estate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity: any, index: number) => {
                    const icon = getAmenityIcon(amenity.icon || amenity.name);
                    return (
                      <div key={index} className="flex items-center gap-2">
                        {icon}
                        <span className="text-gray-700">{amenity.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Location Map */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Location</h2>
              <div className="aspect-video w-full rounded-lg overflow-hidden">
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Property Location"
                />
              </div>
              <p className="mt-4 text-gray-600">
                {formatLocation(property.address)}, {formatLocation(property.lga)}, {formatLocation(property.state)}
              </p>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <PropertyContactSection 
                propertyId={property.id}
                host={property.host}
                isOwner={false}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

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
import { getPropertyByIdServer } from "@/lib/server-api";
import { PropertyDetail } from "@/@types/property";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Generate dynamic metadata for property pages
 * Critical for SEO - provides unique title, description, and OG tags per property
 */
export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Next.js 15: await params before accessing properties
  const { id } = await params;
  const property = await getPropertyByIdServer(id);

  if (!property) {
    return {
      title: "Property Not Found - Houzdey",
      description: "This property could not be found.",
    };
  }

  // Create SEO-friendly description (first 155 characters)
  const description = property.description
    ? property.description.substring(0, 155) + "..."
    : `${property.beds} bed${property.beds !== 1 ? 's' : ''}, ${property.baths} bath${property.baths !== 1 ? 's' : ''} ${property.type} ${property.listing_type === 'sale' ? 'for sale' : 'for rent'} in ${property.lga}, ${property.state}`;

  // Format price for title
  const priceDisplay = property.listing_type === 'sale'
    ? `₦${(property.sale_price || property.price).toLocaleString()}`
    : `₦${(property.rental_price || property.price).toLocaleString()}/year`;

  // Build SEO-optimized title
  const title = `${property.title} - ${priceDisplay} | Houzdey`;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://houzdey.com';
  const propertyUrl = `${baseUrl}/properties/${property.id}`;

  return {
    title,
    description,
    keywords: [
      property.type,
      property.listing_type === 'sale' ? 'for sale' : 'for rent',
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
 * Server Component - Property Details Page
 * Fetches data server-side for SEO and performance
 */
export default async function PropertyDetailsPage({ params }: PageProps) {
  // Next.js 15: await params before accessing properties
  const { id } = await params;
  const property = await getPropertyByIdServer(id);

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
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://houzdey.com'}/properties/${property.id}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: property.lga,
      addressRegion: property.state,
      addressCountry: "NG",
    },
    price: property.listing_type === 'sale' 
      ? (property.sale_price || property.price)
      : (property.rental_price || property.price),
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
        item: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://houzdey.com'}/properties/${id}`,
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
          {/* Back button and title */}
          <div className="flex items-center gap-2 mb-10">
            <Link
              href="/"
              className="flex items-center text-gray-600 font-semibold text-2xl"
            >
              <ChevronLeft className="w-6 h-6" />
              <span>Back</span>
            </Link>
          </div>

          {/* Image Gallery - Client Component */}
          <PropertyImageGallery images={property.images} title={property.title} video={property.video} />

          {/* Main Content with Sticky Sidebar */}
          <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Property Details */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                <div className="mb-10">
                  <h1 className="text-2xl font-semibold mb-2">
                    {formatLocation(property.title)}
                  </h1>
                  <p className="text-gray-600 mb-4 text-lg">
                    {`${
                      property?.estate
                        ? `${formatLocation(property.estate)} Estate,`
                        : ""
                    } ${property.lga}, ${property.state}`}
                  </p>
                  <div className="flex items-center gap-4">
                    <p className="text-2xl font-semibold">
                      {property.listing_type === "sale" ? (
                        <>
                          ₦ {(property.sale_price || property.price).toLocaleString()}
                        </>
                      ) : (
                        <>
                          ₦{" "}
                          {(property.rental_price || property.price).toLocaleString()}{" "}
                          / year
                        </>
                      )}
                    </p>
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        property.listing_type === "sale"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {property.listing_type === "sale" ? "For Sale" : "For Rent"}
                    </span>
                  </div>

                  {/* Additional Fees Section */}
                  {(property.agency_fee || property.legal_fee || property.other_fees) && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">
                        Additional Fees
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {property.agency_fee && (
                          <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                            <span className="text-gray-600">
                              {property.listing_type === "rent"
                                ? "Agency Fee"
                                : "Agency Commission"}
                            </span>
                            <span className="font-medium">
                              ₦{property.agency_fee.toLocaleString()}
                            </span>
                          </div>
                        )}

                        {property.legal_fee && (
                          <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                            <span className="text-gray-600">
                              {property.listing_type === "rent"
                                ? "Legal Fee"
                                : "Legal Documentation Fee"}
                            </span>
                            <span className="font-medium">
                              ₦{property.legal_fee.toLocaleString()}
                            </span>
                          </div>
                        )}

                        {property.other_fees && (
                          <div className="flex justify-between items-center p-3 bg-white rounded-lg md:col-span-2">
                            <span className="text-gray-600">Other Fees</span>
                            <span className="font-medium">
                              ₦{property.other_fees.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* divider */}
                <div className="h-[1px] w-full bg-gray-200 my-10"></div>

                <div className="mt-10">
                  <h2 className="text-lg font-semibold">Description</h2>
                  <p className="text-gray-600 w-[80%]">{property.description}</p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {getAmenityIcon(amenity.icon)}
                        <span className="text-gray-600">{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* divider */}
                <div className="h-[1px] w-full bg-gray-200 my-10"></div>

                {/* Map Section */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Location</h2>
                  <div className="aspect-[16/9] rounded-lg overflow-hidden">
                    <iframe
                      src={generateGoogleMapsEmbedUrl({
                        address: property.address,
                        state: property.state,
                        lga: property.lga,
                        ward: property.ward,
                        estate: property.estate,
                      })}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Property Location Map"
                    />
                  </div>
                </div>

                {/* divider */}
                <div className="h-[1px] w-full bg-gray-200 my-10"></div>

                {/* Host Section */}
                <div className="mt-8">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={property?.host?.image}
                      alt={property?.host?.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">
                        Posted by {property?.host?.name}
                      </h3>
                      <p className="text-gray-600">{property?.host?.company}</p>
                    </div>
                  </div>
                </div>

                {/* Reviews Section */}
                {property?.reviews && property.reviews.length > 0 && (
                  <div className="mt-8">
                    <div className="flex items-center gap-2 mb-6">
                      <h2 className="text-lg font-semibold">Reviews</h2>
                      <span className="text-gray-600">
                        ({property.reviews.length})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {property.reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <img
                              src={review.user.image}
                              alt={review.user.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <h4 className="font-medium">{review.user.name}</h4>
                              <p className="text-sm text-gray-600">
                                {review.date}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Sticky Contact Section - Client Component */}
            <div className="lg:col-span-1">
              <PropertyContactSection
                propertyId={id}
                host={property.host}
                isOwner={false}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

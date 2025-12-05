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
import { PropertyDetail } from "@/@types/property";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

/**
 * Generate dynamic metadata for property pages using SEO-friendly slugs
 */
export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const fullSlug = `for-sale/${slug.join("/")}`;
  
  const property = await getPropertyBySlugServer(fullSlug);

  if (!property) {
    return {
      title: "Property Not Found - Houzdey",
      description: "This property could not be found.",
    };
  }

  const description = property.description
    ? property.description.substring(0, 155) + "..."
    : `${property.beds} bed${property.beds !== 1 ? 's' : ''}, ${property.baths} bath${property.baths !== 1 ? 's' : ''} ${property.type} for sale in ${property.lga}, ${property.state}`;

  const priceDisplay = `₦${(property.sale_price || property.price).toLocaleString()}`;
  const title = `${property.title} - ${priceDisplay} | Houzdey`;
  const primaryImage = property.images?.[0] || "/assets/placeholder-property.jpg";

  return {
    title,
    description,
    keywords: [
      property.type,
      "for sale",
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
  const { slug } = await params;
  const fullSlug = `for-sale/${slug.join("/")}`;

  const property: PropertyDetail | null = await getPropertyBySlugServer(fullSlug);

  if (!property) {
    notFound();
  }

  const mapUrl = generateGoogleMapsEmbedUrl(
    property.address,
    property.lga,
    property.state
  );

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/properties"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Properties
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {property.title}
            </h1>
            <p className="text-lg text-gray-600">
              {formatLocation(property.address, property.lga, property.state)}
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <p className="text-3xl font-bold text-primary">
              ₦{(property.sale_price || property.price).toLocaleString()}
            </p>
            {property.agency_fee && (
              <p className="text-sm text-gray-500 mt-1">
                Agency Fee: ₦{property.agency_fee.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <PropertyImageGallery images={property.images} title={property.title} />

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
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Furnishing</span>
                  <span className="text-xl font-semibold capitalize">
                    {property.furnishing.replace("_", " ")}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Condition</span>
                  <span className="text-xl font-semibold capitalize">
                    {property.condition.replace("_", " ")}
                  </span>
                </div>
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

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity: any, index: number) => {
                    const Icon = getAmenityIcon(amenity.name);
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="text-gray-700">{amenity.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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
                {formatLocation(property.address, property.lga, property.state)}
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <PropertyContactSection property={property} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import ImageGalleryModal from "./image-gallary-modal";
import { getAmenityIcon } from "@/utils/iconUtils";
import { motion } from "framer-motion";
import { propertyApi } from "@/api/properties";
import { PropertyDetail } from "@/@types/property";
import { formatLocation } from "@/utils/formatLocation";
import { generateGoogleMapsEmbedUrl } from "@/utils/mapUtils";
import { PropertyDetailSkeleton } from "@/components/ui/property-skeleton";
import { chatApi } from "@/api/chat";

interface Review {
  id: number;
  user: {
    name: string;
    image: string;
  };
  rating: number;
  date: string;
  comment: string;
}

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  description: string;
  images: string[];
  amenities: {
    name: string;
    icon: string;
  }[];
  host: {
    name: string;
    image: string;
    company: string;
    role: string;
  };
  reviews: Review[];
}

export default function PropertyDetails() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setIsLoading(true);
        const data = await propertyApi.getPropertyById(id as string);
        setProperty(data);
      } catch (err: any) {
        setError("Property not found");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  const handleContactHost = async () => {
    try {
      if (!property?.id) return;
      
      // Show loading state
      setIsLoading(true);
      
      // Create or get existing conversation
      const conversation = await chatApi.createConversation(id as string);
      
      // Navigate to chat
      router.push(`/chat/${conversation.id}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PropertyDetailSkeleton />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar showSearch={false} showPropertyTypeFilters={false} />
        <div className="max-w-7xl mx-auto px-4 py-4 mt-24">
          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/properties"
              className="flex items-center text-gray-600"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Properties</span>
            </Link>
          </div>
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Property Not Found
            </h2>
            <p className="text-gray-600">
              The property you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4">
      <Navbar showSearch={false} showPropertyTypeFilters={false} />

      <main className="max-w-7xl mx-auto px-4 py-4 mt-24">
        {/* Back button and title */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="flex items-center text-gray-600">
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
          </div>

          {/* Image Gallery */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              className="col-span-1 aspect-[4/3] cursor-pointer"
              onClick={() => {
                setSelectedImageIndex(0);
                setShowGallery(true);
              }}
            >
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover rounded-lg hover:opacity-95 transition-opacity"
              />
            </motion.div>
            <motion.div
              className="col-span-1 grid grid-cols-2 gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {property.images.slice(1, 5).map((image, index) => (
                <motion.div
                  key={index}
                  className="relative aspect-[4/3] cursor-pointer group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  onClick={() => {
                    setSelectedImageIndex(index + 1);
                    setShowGallery(true);
                  }}
                >
                  <img
                    src={image}
                    alt={`${property.title} ${index + 2}`}
                    className="w-full h-full object-cover rounded-lg hover:opacity-95 transition-opacity"
                  />
                  {index === 3 && property.images.length > 5 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg group-hover:bg-black/60 transition-colors">
                      <span className="text-white text-lg font-medium">
                        +{property.images.length - 5} more
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image Gallery Modal */}
          {showGallery && (
            <ImageGalleryModal
              images={property.images}
              initialIndex={selectedImageIndex}
              onClose={() => setShowGallery(false)}
            />
          )}

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
                  <p className="text-2xl font-semibold">
                    ₦ {property.price.toLocaleString()} / year
                  </p>
                </div>

                {/* divider */}
                <div className="h-[1px] w-full bg-gray-200 my-10"></div>

                <div className="mt-10">
                  <h2 className="text-lg font-semibold">Description</h2>
                  <p className="text-gray-600 w-[80%]">
                    {property.description}
                  </p>
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
                  {/* <p className="text-gray-600">James is an Agent</p>
                  <p className="text-gray-600">
                    James is an Agent and has been in the real estate business
                    for over 10 years.
                  </p> */}
                </div>

                {/* Reviews Section */}
                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-6">
                    <h2 className="text-lg font-semibold">Reviews</h2>
                    <span className="text-gray-600">
                      ({property?.reviews?.length})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {property?.reviews?.map((review) => (
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
              </div>
            </div>

            {/* Right Column - Sticky Host Information */}
            <div className="lg:col-span-1">
              <div className="sticky top-40">
                <div className="border rounded-xl p-6">
                  <button 
                    onClick={handleContactHost}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
                  >
                    Contact Host
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

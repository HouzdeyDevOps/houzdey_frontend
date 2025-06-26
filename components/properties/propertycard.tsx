"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useRouter } from 'next/navigation';
import { formatLocation } from "@/utils/formatLocation";
import WishlistButton from "@/components/wishlist/WishlistButton";

interface Property {
  id: string;
  title: string;
  state: string;
  lga: string;
  address: string;
  beds: number;
  baths: number;
  price: number;  // For backward compatibility
  rental_price?: number;
  sale_price?: number;
  listing_type?: string;
  images: string[];
}

function PropertyCard({ property }: { property: Property }) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Ensure images is always an array
  const images = property.images || [];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };



  const handlePropertyClick = () => {
    router.push(`/properties/${property.id}`);
  };

  return (
    <div
      className="group cursor-pointer"
      onClick={handlePropertyClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <div
          className="w-full h-full transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentImageIndex * 100}%)`,
            display: "flex",
          }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${property.title} - Image ${index + 1}`}
              className="object-cover w-full h-full transition-transform duration-300 flex-shrink-0"
            />
          ))}
        </div>

        {/* Navigation Arrows - Only show when there are multiple images */}
        {images.length > 1 && isHovered && (
          <>
            <button
              onClick={previousImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
            >
              <ChevronLeft className="w-4 h-4 text-neutral-600" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
            >
              <ChevronRight className="w-4 h-4 text-neutral-600" />
            </button>
          </>
        )}

        {/* Heart Button */}
        <WishlistButton propertyId={property.id} />

        {/* Image Dots Indicator - Only show when there are multiple images */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold">{formatLocation(property.title)}</h3>
        <p className="text-gray-600 dark:text-gray-400">{`${formatLocation(
          property.lga
        )}, ${formatLocation(property.state)}`}</p>
        <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400 mt-2">
          <span>{property.beds} bed</span>
          <span>•</span>
          <span>{property.baths} bath</span>
        </div>
        <div className="mt-2">
          {property.listing_type === 'sale' ? (
            <p className="font-semibold">
              ₦ {(property.sale_price || property.price || 0).toLocaleString()}
            </p>
          ) : (
            <p className="font-semibold">
              ₦ {(property.rental_price || property.price || 0).toLocaleString()}
              <span className="text-sm font-normal text-gray-600 dark:text-gray-400">/month</span>
            </p>
          )}
          <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
            property.listing_type === 'sale' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;

function HeartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="#737373"
      stroke="none"
      //   fill="none"
      //   stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

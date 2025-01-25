"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

interface Property {
  id: number;
  title: string;
  location: string;
  beds: number;
  baths: number;
  price: number;
  images: string[];
}

function PropertyCard({ property }: { property: Property }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <img
          src={property.images[currentImageIndex]}
          alt={property.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Navigation Arrows */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            previousImage();
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-4 h-4 text-neutral-600" />
        </button>
        
        <button 
          onClick={(e) => {
            e.preventDefault();
            nextImage();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-4 h-4 text-neutral-600" />
        </button>

        {/* Heart Button */}
        <button className="absolute bottom-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
          <Heart className="w-5 h-5 text-neutral-600" />
        </button>

        {/* Image Dots Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {property.images.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold">{property.title}</h3>
        <p className="text-gray-600">{property.location}</p>
        <div className="flex gap-2 text-sm text-gray-600 mt-2">
          <span>{property.beds} bed</span>
          <span>•</span>
          <span>{property.baths} bath</span>
        </div>
        <p className="font-semibold mt-2">
          ₦ {property.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default PropertyCard;

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

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

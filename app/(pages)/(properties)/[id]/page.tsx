"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/app/components/navbar/Navbar";
import ImageGalleryModal from "./image-gallary-modal";
import { getAmenityIcon } from "@/utils/iconUtils";
import { motion } from "framer-motion";

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
  const [selectedImage, setSelectedImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
const [selectedImageIndex, setSelectedImageIndex] = useState(0);


  // Dummy data to match the image
  const property: Property = {
    id: 1,
    title: "Furnished bedroom apartment",
    location: "Clara Estate, Adeniloyes, Ikeja",
    price: 350000000,
    description:
      "Hot deal! This beautiful 4-bedroom duplex comes with 5 spacious bathrooms, a fully fitted CookingPot, and a private study room. Nestled in a serene part of Lekki Phase 1, it's close to top-notch schools, shopping centers, and eateries. With ample parking space and 24/7 security, it's perfect for family living. Don't miss out—book your inspection today",
    images: [
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1594484208280-efa00f96fc21?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1582883545851-725a3b9502ce?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1512845296467-183ccf124347?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    amenities: [
      { name: "CookingPot", icon: "CookingPot" },
      { name: "Garden view", icon: "garden" },
      { name: "Pets allowed", icon: "pets" },
      { name: "Central air conditioning", icon: "ac" },
      { name: "Water heater", icon: "water" },
      { name: "Refrigerator", icon: "fridge" },
      { name: "Security cameras on property", icon: "security" },
    ],
    host: {
      name: "James Olaniyi",
      image:
        "https://images.unsplash.com/photo-1581368129682-e2d66324045b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      company: "Trolope Property",
      role: "Agent",
    },
    reviews: [
      {
        id: 1,
        user: {
          name: "Adeyemi",
          image:
            "https://images.unsplash.com/photo-1581368129682-e2d66324045b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        rating: 5,
        date: "2 years ago",
        comment: "Lorem ipsum",
      },
      // Add more reviews as needed
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />


      <main className="max-w-7xl mx-auto px-4 py-4">

      {/* Back button and title */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 mb-4 ">
          <Link href="/" className="flex items-center text-gray-600">
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
        </div>

  
        {/* Image Gallery */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8"
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
          <motion.div className="col-span-1 grid grid-cols-2 gap-2"
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
              <div>
                <h1 className="text-2xl font-semibold mb-2">
                  {property.title}
                </h1>
                <p className="text-gray-600 mb-4">{property.location}</p>
                <p className="text-xl font-semibold">
                  ₦ {property.price.toLocaleString()} / year
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Description</h2>
                <p className="text-gray-600">{property.description}</p>
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

              {/* Map Section */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Location</h2>
                <div className="aspect-[16/9] rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.3520781419667!2d3.3751296!3d6.6018864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b922f39f2ea89%3A0x3d340c94b6c5f0ef!2sIkeja%2C%20Lagos!5e0!3m2!1sen!2sng!4v1709900000000!5m2!1sen!2sng"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              {/* Reviews Section */}
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
                          <p className="text-sm text-gray-600">{review.date}</p>
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
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={property.host.image}
                    alt={property.host.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">
                      Posted by {property.host.name}
                    </h3>
                    <p className="text-gray-600">{property.host.company}</p>
                  </div>
                </div>
                <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">
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

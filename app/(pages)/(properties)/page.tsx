// app/properties/page.tsx
"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import Navbar from "@/app/components/navbar/Navbar";

const fetchFeaturedProperties = async () => {
  const { data } = await axios.get("/api/properties/featured");
  return data;
};

export default function HomePage() {
  // const { data: properties, isLoading } = useQuery(
  //   ["featuredProperties"],
  //   fetchFeaturedProperties
  // );
  // dummy data
  const properties = [
    {
      id: 1,
      title: "3 Bedroom Bungalow",
      location: "Lekki Phase 1, Lagos",
      beds: 3,
      baths: 2,
      price: 25000000,
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1380&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
    },
    {
      id: 2,
      title: "4 Bedroom Duplex",
      location: "Ikeja, Lagos",
      beds: 4,
      baths: 3,
      price: 45000000,
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1380&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
    },
    {
      id: 3,
      title: "2 Bedroom Flat",
      location: "Victoria Island, Lagos",
      beds: 2,
      baths: 1,
      price: 18000000,
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1380&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
    },
    {
      id: 4,
      title: "5 Bedroom Mansion",
      location: "Ikoyi, Lagos",
      beds: 5,
      baths: 4,
      price: 75000000,
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1380&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
    },
  ];
  const isLoading = false;

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Properties Grid */}
      <section className="max-w-7xl mx-auto p-4">
        <div className="flex justify-end mb-4 gap-x-2">
          <ThemeToggle />
          <select className="border rounded-lg px-3 py-2">
            <option>Newest to Oldest</option>
            <option>Oldest to Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <p>Loading properties...</p>
          ) : (
            properties?.map((property: any) => (
              <PropertyCard key={property.id} property={property} />
            ))
          )}
        </div>
      </section>
    </main>
  );
}

function PropertyCard({ property }: { property: any }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="relative aspect-[4/3]">
        <img
          src={property.images[0]}
          alt={property.title}
          className="object-cover w-full h-full"
        />
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full">
          <HeartIcon />
        </button>
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
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

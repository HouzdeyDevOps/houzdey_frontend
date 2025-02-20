// app/properties/page.tsx
"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Navbar from "@/components/navbar/Navbar";
import PropertyCard from "@/components/properties/propertycard";
import Loader from "@/components/ui/Loader";

const fetchFeaturedProperties = async () => {
  const { data } = await axios.get("/api/properties/featured");
  return data;
};

export default function HomePage() {
  // const { data: properties, isLoading, error } = useQuery({
  //   queryKey: ["featuredProperties"],
  //   queryFn: fetchFeaturedProperties,
  //   suspense: true,
  //   useErrorBoundary: true,
  // });
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
        "https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
      <Navbar showSearch={true} showPropertyTypeFilters={true}/>
      {/* Properties Grid */}
      <section className="max-w-7xl mx-auto p-4 mt-44">
        <div className="flex justify-end mb-4 gap-x-2">
          <select className="border rounded-lg px-3 py-2">
            <option>Newest to Oldest</option>
            <option>Oldest to Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties?.map((property: any) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

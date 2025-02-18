"use client"
import Favouritecard from "@/app/components/favoriteproperties/Favouritecard";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Property = {
  id: number;
  title: string;
  location: string;
  beds: number;
  baths: number;
  price: number;
  images: string[];
};

export default function Favourite() {
  const favoriteproperty: Property[] = [
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

  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <main className="relative h-screen">
      <header className="p-4 border-b">
        <nav className="max-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Image
              src="/assets/images/houzdey-logo.png"
              alt="Houzdey"
              width={180}
              height={180}
            />
          </Link>
          <Image
            src="/assets/images/Face _37.png"
            alt="profile_Image"
            className="rounded-full"
            width={48}
            height={48}
          />
        </nav>
      </header>

      {/* Title */}
      <div className="flex justify-between py-8 px-4 mt-6 items-center cursor-pointer">
        <div className="flex h-9 text-2xl items-center text-center gap-6">
          <ChevronLeft className="w-6 h-6 font-bold" />
          <h1 className="font-semibold text-gray-800">Your favourite listings</h1>
        </div>
        <div className="rounded-full">
          <select className="border rounded-lg w-[240px] h-11">
            <option>Newest to Oldest</option>
            <option>Oldest to Newest</option>
          </select>
        </div>
      </div>
      
      {/* Main Body */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
        {isLoading ? (
          <p>Loading properties...</p>
        ) : (
          favoriteproperty?.map((property) => (
            <Favouritecard key={property.id} property={property} />
          ))
        )}
      </div>
    </main>
  );
}

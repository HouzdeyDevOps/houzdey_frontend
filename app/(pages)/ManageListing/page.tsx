"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ListingmanageCard from "@/app/components/ListingManage/ListingmanageCard";
import { useState } from "react";

type Property = {
  id: number;
  title: string;
  location: string;
  PropertyId: string;
  images: string[];
};

export default function ManageListing() {
  const [isLoading, setIsLoading] = useState(false);
  const [listedProperty, setListedProperty] = useState<Property[]>([
    {
      id: 1,
      title: "Furnished Bedroom Apartment",
      location: "Ikeja Lagos",
      PropertyId: "PID: 12ABCD",
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1380&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
    },
    {
      id: 2,
      title: "Luxury Duplex",
      location: "Lekki Phase 1",
      PropertyId: "PID: 45XYZ",
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1380&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
    },
    {
      id: 3,
      title: "Serviced Apartment",
      location: "Victoria Island",
      PropertyId: "PID: 89JKL",
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1380&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
    },
    {
      id: 4,
      title: "Serviced Apartment",
      location: "Victoria Island",
      PropertyId: "PID: 89JKL",
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1380&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
    },
  ]);

  // Function to delete a listing
  function handleDeleteListing(id: number) {
    setListedProperty((prevProperties) =>
      prevProperties.filter((property) => property.id !== id)
    );
  }

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
          <h1 className="font-semibold text-gray-800">Manage your listings</h1>
        </div>
        <div className="rounded-full">
          <select className="border rounded-lg w-[240px] h-11">
            <option>Newest to Oldest</option>
            <option>Oldest to Newest</option>
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex gap-14 text-center justify-center">
          <li className="text-indigo-600 font-semibold border-b-4 text-xl border-indigo-600 pb-1 rounded-sm">
            <Link href="/" className="">
              All
            </Link>
          </li>

          {["Available", "Unavailable", "Draft", "Pending Approval"].map(
            (status) => {
              return (
                <li key={status} className="text-gray-500 font-semibold text-xl">
                  <Link
                    href={`/properties?listing=${status.toLowerCase()}`}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {status}
                  </Link>
                </li>
              );
            }
          )}
        </ul>
      </div>

      {/* Main Body */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 py-6">
        {isLoading ? (
          <p>Loading properties...</p>
        ) : (
          listedProperty.map((property) => (
            <ListingmanageCard
              key={property.id}
              property={property}
              onDelete={handleDeleteListing}
            />
          ))
        )}
      </div>
    </main>
  );
}

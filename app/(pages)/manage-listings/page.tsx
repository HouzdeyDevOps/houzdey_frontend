"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ListingmanageCard from "@/app/components/ListingManage/ListingmanageCard";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar/Navbar";
import { propertyApi } from "@/api/properties";
import { toast } from "sonner";
import { Property } from "@/@types/property";

type SortOption = "newest" | "oldest";

export default function ManageListing() {
  const [isLoading, setIsLoading] = useState(true);
  const [listedProperties, setListedProperties] = useState<Property[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOption>("newest");
  const [activeStatus, setActiveStatus] = useState("all");

  // Fetch user's properties
  const fetchUserProperties = async () => {
    try {
      setIsLoading(true);
      const response = await propertyApi.getUserProperties();
      setListedProperties(response);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch properties");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProperties();
  }, []);

  // Handle property deletion
  const handleDeleteListing = async (id: string) => {
    try {
      await propertyApi.deleteProperty(id);
      toast.success("Property deleted successfully");
      // Refresh the properties list
      fetchUserProperties();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete property");
    }
  };

  // Filter properties based on status
  const filteredProperties = listedProperties.filter((property) => {
    if (activeStatus === "all") return true;
    return property.status.toLowerCase() === activeStatus.toLowerCase();
  });

  // Sort properties based on creation date
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <main className="relative h-screen">
      <Navbar
        showListingButton={false}
        showSearch={false}
        showPropertyTypeFilters={false}
      />

      {/* Title */}
      <div className="flex justify-between py-8 px-4 items-center cursor-pointer mt-24">
        <div className="flex h-9 text-2xl items-center text-center gap-6">
          <Link href="/" className="hover:text-gray-600">
            <ChevronLeft className="w-6 h-6 font-bold" />
          </Link>
          <h1 className="font-semibold text-gray-800">Manage your listings</h1>
        </div>
        <div className="rounded-full">
          <select 
            className="border rounded-lg w-[240px] h-11 px-4"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOption)}
          >
            <option value="newest">Newest to Oldest</option>
            <option value="oldest">Oldest to Newest</option>
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 my-8">
        <ul className="flex gap-14 text-center justify-center">
          {["All", "Available", "Unavailable", "Draft", "Pending Approval"].map(
            (status) => (
              <li
                key={status}
                className={`text-lg cursor-pointer ${
                  activeStatus === status.toLowerCase()
                    ? "text-indigo-600 border-b-4 border-indigo-600 pb-1 rounded-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                onClick={() => setActiveStatus(status.toLowerCase())}
              >
                {status}
              </li>
            )
          )}
        </ul>
      </div>

      {/* Main Body */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-10 py-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center">
            <p className="text-gray-500">Loading properties...</p>
          </div>
        ) : sortedProperties.length === 0 ? (
          <div className="col-span-full flex justify-center items-center">
            <p className="text-gray-500">No properties found</p>
          </div>
        ) : (
          sortedProperties.map((property) => (
            <ListingmanageCard
              key={property.id}
              property={property}
              onDelete={() => handleDeleteListing(property.id)}
            />
          ))
        )}
      </div>
    </main>
  );
}

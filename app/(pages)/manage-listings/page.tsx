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
import ProtectedRoute from "@/components/auth/protected-route";
import CreateListingModal from "@/components/properties/create-listing-modal/create-listing-modal";

type SortOption = "newest" | "oldest";

export default function ManageListing() {
  const [isLoading, setIsLoading] = useState(true);
  const [listedProperties, setListedProperties] = useState<Property[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOption>("newest");
  const [activeStatus, setActiveStatus] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

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

  // Handle property edit
  const handleEditListing = (property: Property) => {
    setEditingProperty(property);
    setIsEditModalOpen(true);
  };

  // Handle edit modal close
  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingProperty(null);
    // Refresh properties list after edit
    fetchUserProperties();
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
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar
          showListingButton={false}
          showSearch={false}
          showPropertyTypeFilters={false}
        />

        {/* Title Section */}
        <div className="w-full mx-auto mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-6">
              <Link href="/" className="hover:text-gray-600">
                <ChevronLeft className="w-6 h-6 font-bold" />
              </Link>
              <h1 className="text-2xl font-semibold text-gray-800">Manage your listings</h1>
            </div>
            <select 
              className="border rounded-lg w-full sm:w-[240px] h-11 px-4 bg-white"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOption)}
            >
              <option value="newest">Newest to Oldest</option>
              <option value="oldest">Oldest to Newest</option>
            </select>
          </div>

          {/* Status Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8 overflow-x-auto">
              {["All", "Available", "Unavailable", "Draft", "Pending Approval"].map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveStatus(status.toLowerCase())}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeStatus === status.toLowerCase()
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {status}
                  {/* Show count for active status */}
                  {activeStatus === status.toLowerCase() && (
                    <span className="ml-2 bg-indigo-100 text-indigo-600 py-0.5 px-2 rounded-full text-xs">
                      {sortedProperties.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Properties Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm border animate-pulse h-80"
                />
              ))}
            </div>
          ) : sortedProperties.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeStatus === "all" ? "No properties yet" : `No ${activeStatus} properties`}
              </h3>
              <p className="text-gray-500 mb-6">
                {activeStatus === "all" 
                  ? "Create your first property listing to get started" 
                  : `You don't have any ${activeStatus} properties at the moment`
                }
              </p>
              {activeStatus === "all" && (
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Create Listing
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProperties.map((property) => (
                <ListingmanageCard
                  key={property.id}
                  property={property}
                  onDelete={() => handleDeleteListing(property.id)}
                  onEdit={handleEditListing}
                />
              ))}
            </div>
          )}
        </div>

        {/* Edit Listing Modal */}
        <CreateListingModal
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          property={editingProperty}
          mode="edit"
        />
      </div>
    </ProtectedRoute>
  );
}

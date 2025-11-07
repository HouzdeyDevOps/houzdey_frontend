"use client"
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/protected-route";
import Navbar from "@/components/navbar/Navbar";
import PropertyCard from "@/components/properties/propertycard";
import { PropertyCardSkeleton } from "@/components/ui/property-card-skeleton";
import { useWishlist } from "@/hooks/useWishlist";
import { wishlistApi } from "@/api/wishlist";
import { Property } from "@/@types/property";

type SortOption = "newest" | "oldest";

export default function Favourite() {
  const [sortOrder, setSortOrder] = useState<SortOption>("newest");
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Use the wishlist hook to get wishlist items
  const { items: wishlistItems } = useWishlist();

  useEffect(() => {
    const fetchWishlistProperties = async () => {
      try {
        setLoading(true);
        const response = await wishlistApi.getWishlist();
        setFavoriteProperties(response.items || []);
      } catch (error) {
        console.error("Failed to load wishlist:", error);
        setFavoriteProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProperties();
  }, [wishlistItems]); // Refetch when wishlist items change

  // Sort properties based on selected order
  const sortedProperties = [...favoriteProperties].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    } else {
      return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
    }
  });

  return (
    <ProtectedRoute>
      <main className="relative h-screen">
        <Navbar
          showListingButton={false}
          showSearch={false}
          showPropertyTypeFilters={false}
        />

        {/* Title - Fixed container structure */}
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between py-8 mt-24 items-center">
            <div className="flex h-9 text-2xl items-center text-center gap-6">
              <Link href="/" className="hover:text-gray-600">
                <ChevronLeft className="w-6 h-6 font-bold" />
              </Link>
              <h1 className="font-semibold text-gray-800">Your favourite listings</h1>
            </div>
            <div className="rounded-full">
              <select 
                className="border rounded-lg w-[240px] h-11 px-4"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOption)}
              >
                <option key="newest" value="newest">Newest to Oldest</option>
                <option key="oldest" value="oldest">Oldest to Newest</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Main Body */}
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Show loading skeletons
              <>
                {Array.from({ length: 8 }, (_, index) => (
                  <PropertyCardSkeleton key={`skeleton-${index}`} />
                ))}
              </>
            ) : sortedProperties.length === 0 ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="text-center">
                  <p className="text-gray-500 text-lg mb-2">No favourite properties yet</p>
                  <p className="text-gray-400 text-sm">Properties you like will appear here</p>
                </div>
              </div>
            ) : (
              <>
                {sortedProperties.map((property: Property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </>
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}

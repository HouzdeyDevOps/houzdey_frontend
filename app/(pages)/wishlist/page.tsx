"use client";

import { useEffect, useState } from "react";
import { wishlistApi } from "@/api/wishlist";
import { Property } from "@/@types/property";
import { useAuth } from "@/hooks/useAuth";
import { Heart } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import PropertyCard from "@/components/properties/propertycard";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const response = await wishlistApi.getWishlist();
        setWishlistItems(response.items || []);
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadWishlist();
    }
  }, [user]);

  console.log(wishlistItems);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar showSearch={false} showPropertyTypeFilters={false} />
        <div className="w-full mx-auto mt-24">
          <div className="text-center">
            <p className="text-xl text-gray-600">Please log in to view your wishlist</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showSearch={false} showPropertyTypeFilters={false} />
      <div className="w-full mx-auto mt-24">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl font-bold">My Wishlist</h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md animate-pulse h-80"
              />
            ))}
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-500">
              Start adding properties to your wishlist to keep track of your favorite listings
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems?.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
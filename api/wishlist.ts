import { axiosInstance } from "@/api/axios-config";

export const wishlistApi = {
  // Get user's wishlist items with full property details
  getWishlist: async () => {
    const response = await axiosInstance.get("/api/v1/wishlist");
    return response.data;
  },

  // Get user's wishlist property IDs only
  getWishlistIds: async () => {
    const response = await axiosInstance.get("/api/v1/wishlist/ids");
    return response.data;
  },

  // Add property to wishlist
  addToWishlist: async (propertyId: string) => {
    const response = await axiosInstance.post("/api/v1/wishlist", { property_id: propertyId });
    return response.data;
  },

  // Remove property from wishlist
  removeFromWishlist: async (propertyId: string) => {
    const response = await axiosInstance.delete(`/api/v1/wishlist/${propertyId}`);
    return response.data;
  }
}; 
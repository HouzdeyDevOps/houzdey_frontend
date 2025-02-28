import { axiosInstance } from "@/api/axios-config";

export const wishlistApi = {
  // Get user's wishlist items
  getWishlist: async () => {
    const response = await axiosInstance.get("/api/v1/wishlist");
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
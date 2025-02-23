import axios from "axios";
import { API_BASE_URL } from "./auth";

export const wishlistApi = {
  async addToWishlist(propertyId: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/wishlist`, {
        property_id: propertyId
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to add to wishlist");
    }
  },

  async removeFromWishlist(propertyId: string) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/v1/wishlist/${propertyId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to remove from wishlist");
    }
  },

  async getWishlist() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/wishlist`);
      return response.data.items;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to fetch wishlist");
    }
  }
}; 
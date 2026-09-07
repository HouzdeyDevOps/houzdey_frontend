import axios from "axios";
import { API_BASE_URL } from "./auth";
import { PropertyResponse, PropertyFilters, Property, PropertyDetail } from "@/@types/property";
import { CreateListingFormData } from "@/@types/create-listing";
import { generatePropertyTitle } from "@/utils/generatePropertyTitle";

export const propertyApi = {
  async getProperties(
    filters: PropertyFilters = {}
  ): Promise<PropertyResponse> {
    try {
      const params = new URLSearchParams();

      // Handle all filter parameters including search
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (Array.isArray(value)) {
            // Handle array values like amenities
            value.forEach((v) => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });

      const response = await axios.get(
        `${API_BASE_URL}/properties?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || "Failed to fetch properties"
      );
    }
  },

  async createProperty(formData: CreateListingFormData): Promise<any> {
    try {
      const form = new FormData();
      
      // Generate the title using our utility function
      const generatedTitle = generatePropertyTitle(formData);
      
      // Basic fields
      form.append("title", generatedTitle);
      console.log(generatedTitle, "generatedTitle");  
      form.append("type", formData.type);
      form.append("price", formData.price.toString()); // For backward compatibility
      form.append("listing_type", formData.listing_type);
      if (formData.rental_price) {
        form.append("rental_price", formData.rental_price.toString());
      }
      if (formData.sale_price) {
        form.append("sale_price", formData.sale_price.toString());
      }
      
      // Fee fields
      if (formData.agency_fee) {
        form.append("agency_fee", formData.agency_fee.toString());
      }
      if (formData.legal_fee) {
        form.append("legal_fee", formData.legal_fee.toString());
      }
      if (formData.other_fees) {
        form.append("other_fees", formData.other_fees.toString());
      }
      
      form.append("description", formData.description);
      form.append("amenities", JSON.stringify(formData.amenities));

      // Handle numeric fields with proper validation
      const beds = Number(formData.beds);
      const baths = Number(formData.baths);
      const toilets = Number(formData.toilets);

      // Set default to 0 if NaN or negative
      form.append("beds", (isNaN(beds) || beds < 0 ? 0 : beds).toString());
      form.append("baths", (isNaN(baths) || baths < 0 ? 0 : baths).toString());
      form.append("toilets", (isNaN(toilets) || toilets < 0 ? 0 : toilets).toString());

      // Other fields
      form.append("condition", formData.condition);
      form.append("furnishing", formData.furnishing);
      form.append("address", formData.address);
      form.append("state", formData.state);
      form.append("lga", formData.lga);
      form.append("ward", formData.ward);
      form.append("estate", formData.estate || "");
      form.append("size", formData.size || "");
      form.append("status", formData.status || "available");

      // Handle images
      if (formData.coverImage) {
        const coverImageFile = await fetch(formData.coverImage).then(r => r.blob());
        form.append("images", new File([coverImageFile], "cover.jpg"));
      }
      
      for (const imageUrl of formData.images) {
        const imageFile = await fetch(imageUrl).then(r => r.blob());
        form.append("images", new File([imageFile], "image.jpg"));
      }

      // Handle video
      if (formData.video) {
        try {
          const videoBlob = await fetch(formData.video).then(r => r.blob());
          const videoExtension = videoBlob.type.split('/')[1] || 'mp4';
          form.append("video", new File([videoBlob], `property-video.${videoExtension}`, { type: videoBlob.type }));
        } catch (error) {
          console.error("Error processing video:", error);
          // Continue without video if there's an error
        }
      }

      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }
      
      console.log("Sending create property request with token:", token ? "Token exists" : "No token");
      
      const response = await axios.post(`${API_BASE_URL}/properties`, form, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error: any) {
      const data = error.response?.data;
      const errorMessage = data?.detail
        || data?.error?.message
        || data?.error?.details?.map((d: any) => `${d.field}: ${d.message}`).join(", ")
        || error.message
        || "Failed to create property";
      console.error("Property creation error:", { status: error.response?.status, data });
      throw new Error(errorMessage);
    }
  },

  async uploadImages(files: File[]): Promise<string[]> {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });

      const response = await axios.post(
        `${API_BASE_URL}/properties/upload-images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.urls;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || "Failed to upload images"
      );
    }
  },

  async getPropertyById(id: string): Promise<PropertyDetail> {
    try {
      const response = await axios.get(`${API_BASE_URL}/properties/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Property not found');
      }
      throw new Error(
        error.response?.data?.detail || 'Failed to fetch property details'
      );
    }
  },

  async getUserProperties(): Promise<Property[]> {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/properties/users/me/properties`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to fetch user properties");
    }
  },

  async deleteProperty(id: string): Promise<void> {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/properties/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to delete property");
    }
  },

  async updatePropertyStatus(id: string, status: string): Promise<void> {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("status", status);

      await axios.patch(
        `${API_BASE_URL}/properties/${id}/status`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || "Failed to update property status"
      );
    }
  },

  async updateProperty(id: string, formData: CreateListingFormData): Promise<any> {
    try {
      const form = new FormData();
      
      // Generate the title using our utility function
      const generatedTitle = generatePropertyTitle(formData);
      
      // Basic fields
      form.append("title", generatedTitle);
      form.append("type", formData.type);
      form.append("price", formData.price.toString());
      form.append("listing_type", formData.listing_type);
      if (formData.rental_price) {
        form.append("rental_price", formData.rental_price.toString());
      }
      if (formData.sale_price) {
        form.append("sale_price", formData.sale_price.toString());
      }
      
      // Fee fields
      if (formData.agency_fee) {
        form.append("agency_fee", formData.agency_fee.toString());
      }
      if (formData.legal_fee) {
        form.append("legal_fee", formData.legal_fee.toString());
      }
      if (formData.other_fees) {
        form.append("other_fees", formData.other_fees.toString());
      }
      
      form.append("description", formData.description);
      form.append("amenities", JSON.stringify(formData.amenities));

      // Handle numeric fields
      const beds = Number(formData.beds);
      const baths = Number(formData.baths);
      const toilets = Number(formData.toilets);

      form.append("beds", (isNaN(beds) || beds < 0 ? 0 : beds).toString());
      form.append("baths", (isNaN(baths) || baths < 0 ? 0 : baths).toString());
      form.append("toilets", (isNaN(toilets) || toilets < 0 ? 0 : toilets).toString());

      // Other fields
      form.append("condition", formData.condition);
      form.append("furnishing", formData.furnishing);
      form.append("address", formData.address);
      form.append("state", formData.state);
      form.append("lga", formData.lga);
      form.append("ward", formData.ward);
      form.append("estate", formData.estate || "");
      form.append("size", formData.size || "");
      if (formData.status) {
        form.append("status", formData.status);
      }

      // Handle images - only upload new blob URLs
      if (formData.coverImage && formData.coverImage.startsWith('blob:')) {
        const coverImageFile = await fetch(formData.coverImage).then(r => r.blob());
        form.append("images", new File([coverImageFile], "cover.jpg"));
      }
      
      for (const imageUrl of formData.images) {
        if (imageUrl.startsWith('blob:')) {
          const imageFile = await fetch(imageUrl).then(r => r.blob());
          form.append("images", new File([imageFile], "image.jpg"));
        }
      }

      // Handle video
      if (formData.video && formData.video.startsWith('blob:')) {
        try {
          const videoBlob = await fetch(formData.video).then(r => r.blob());
          const videoExtension = videoBlob.type.split('/')[1] || 'mp4';
          form.append("video", new File([videoBlob], `property-video.${videoExtension}`, { type: videoBlob.type }));
        } catch (error) {
          console.error("Error processing video:", error);
        }
      }

      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }
      
      const response = await axios.put(`${API_BASE_URL}/properties/${id}`, form, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error: any) {
      const data = error.response?.data;
      const errorMessage = data?.detail
        || data?.error?.message
        || data?.error?.details?.map((d: any) => `${d.field}: ${d.message}`).join(", ")
        || error.message
        || "Failed to update property";
      console.error("Property update error:", { status: error.response?.status, data });
      throw new Error(errorMessage);
    }
  },
};

// src/services/propertyService.ts
import axios, { AxiosError } from "axios";

const API_BASE_URL =
  (import.meta as any).env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

export interface SearchParams {
  search: string;
  min_price?: number;
  max_price?: number;
  property_type?: string;
  bedrooms?: number;
  bathrooms?: number;
  furnishing?: string;
  condition?: string;
  facilities?: string[];
  sort_by?: string;
  sort_order?: string;
}

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("API Error:", axiosError.response.data);
      throw new Error(
        `API Error: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`
      );
    } else if (axiosError.request) {
      // The request was made but no response was received
      console.error("Network Error:", axiosError.request);
      throw new Error("Network Error: No response received from server");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request Error:", axiosError.message);
      throw new Error(`Request Error: ${axiosError.message}`);
    }
  } else {
    // Non-Axios error
    console.error("Unexpected Error:", error);
    throw new Error("An unexpected error occurred");
  }
};

const propertyService = {
  searchProperties: async (params: SearchParams) => {
    console.log(params);

    try {
      const response = await api.get("/api/v1/properties/properties", {
        params: {
          ...params,
          facilities: params.facilities?.join(","),
        },
      });

      console.log(response.data);

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default propertyService;

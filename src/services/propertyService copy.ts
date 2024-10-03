import axios from 'axios';

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
const API_BASE_URL = (import.meta as any).env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

console.log(API_BASE_URL);


export interface SearchParams {
  location_state?: string;
  location_area?: string;
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

export interface Property {
  id: string;
  availability_status: string;
  location_state: string;
  location_area: string;
  images: string[];
  description: string;
  price: number;
  owner_id: string;
  created_at: string;
  updated_at: string;
  property_address: string;
  estate_name?: string;
  property_type: string;
  condition: string;
  furnishing: string;
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  bookmarked_by_count: number;
  view_count: number;
  caution_fee?: number;
  agency_fee?: number;
  other_fees?: number;
  facilities?: string[];
  listing_by: string;
}

const propertyService = {
  searchProperties: async (params: SearchParams): Promise<Property[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/properties/`, {
        params: {
          ...params,
          facilities: params.facilities?.join(','),
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },
};

export default propertyService;
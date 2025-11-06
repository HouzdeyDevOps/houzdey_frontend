export enum ListingType {
  RENT = 'rent',
  SALE = 'sale'
}

export interface Property {
  id: string;
  title: string;
  price: number;
  rental_price?: number;
  sale_price?: number;
  listing_type: ListingType;
  agency_fee?: number;
  legal_fee?: number;
  other_fees?: number;
  type: string;
  beds: number;
  baths: number;
  state: string;
  lga: string;
  ward: string;
  address: string;
  description?: string;
  size?: string;
  estate?: string;
  owner_id: string;
  status: string;
  amenities: Array<{
    name: string;
    icon: string;
  }>;
  images: string[];
  created_at: string;
}

export interface PropertyResponse {
  properties: Property[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface PropertyFilters {
  search?: string;
  min_price?: number;
  max_price?: number;
  property_type?: string[];
  bedrooms?: number;
  bathrooms?: number;
  state?: string;
  lga?: string;
  amenities?: string[];
  listing_type?: string;  // New: Filter by rent or sale
  sort_by?: SortBy;
  sort_order?: SortOrder;
  page?: number;
  limit?: number;
}

export interface SelectedFilter {
  type: string;
  value: string;
}

export enum SortBy {
  CREATED_AT = 'created_at',
  PRICE = 'price'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export interface PropertyDetail extends Property {
  description: string;
  amenities: {
    name: string;
    icon: string;
  }[];
  host: {
    name: string;
    image: string;
    company: string;
    role: string;
    phone_number: string;
  };
  reviews: {
    id: number;
    user: {
      name: string;
      image: string;
    };
    rating: number;
    date: string;
    comment: string;
  }[];
} 
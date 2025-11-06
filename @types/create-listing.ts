export enum ListingType {
  RENT = 'rent',
  SALE = 'sale'
}

export interface CreateListingFormData {
  title: string;
  type: PropertyType;
  price: string;
  listing_type: ListingType;
  rental_price: string;
  sale_price: string;
  agency_fee?: string;
  legal_fee?: string;
  other_fees?: string;
  amenities: { name: string; icon: string }[];
  description: string;
  images: string[];
  coverImage: string | null;
  video: string | null;
  beds: string;
  baths: string;
  toilets: string;
  condition: string;
  furnishing: string;
  address: string;
  state: string;
  lga: string;
  ward: string;
  estate: string;
  size?: string;
}

export interface StepProps {
  formData: CreateListingFormData;
  updateForm: (field: string, value: any) => void;
}

export enum PropertyType {
  Apartment = "Apartment",
  Bedsitter = "Bedsitter",
  BlockOfFlats = "Block of Flats",
  Bungalow = "Bungalow",
  Chalet = "Chalet",
  Condo = "Condo",
  Duplex = "Duplex",
  FarmHouse = "Farm House",
  House = "House",
  Maisonette = "Maisonette",
  Mansion = "Mansion",
  MiniFlat = "Mini Flat",
  Penthouse = "Penthouse",
  RoomAndParlour = "Room & Parlour",
  SharedApartment = "Shared Apartment",
  StudioApartment = "Studio Apartment",
  TownhouseTerrace = "Townhouse / Terrace",
  Villa = "Villa",
}


export const PropertyTypeArray = Object.values(PropertyType);
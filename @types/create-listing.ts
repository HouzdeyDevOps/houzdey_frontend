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
  caution_fee?: string;
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
  status?: string;
}

export interface StepProps {
  formData: CreateListingFormData;
  updateForm: (field: string, value: any) => void;
}

export enum PropertyType {
  // Most searched residential types
  Apartment = "Apartment",
  MiniFlat = "Mini Flat",
  SelfContain = "Self Contain",
  RoomAndParlour = "Room & Parlour",
  Duplex = "Duplex",
  Bungalow = "Bungalow",
  DetachedHouse = "Detached House",
  SemiDetachedHouse = "Semi-detached House",
  BlockOfFlats = "Block of Flats",
  TownhouseTerrace = "Townhouse / Terrace",
  StudioApartment = "Studio Apartment",
  ServicedApartment = "Serviced Apartment",
  SharedApartment = "Shared Apartment",
  House = "House",
  Mansion = "Mansion",
  Penthouse = "Penthouse",
  Land = "Land",
  // Commercial
  Shop = "Shop",
  Office = "Office",
  Commercial = "Commercial",
  Warehouse = "Warehouse",
}


export const PropertyTypeArray = Object.values(PropertyType);
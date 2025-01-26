export interface FormData {
  title: string;
  type: PropertyType;
  price: string;
  amenities: { name: string; icon: string }[];
  description: string;
  images: string[];
  coverImage: string | null;
  location: string;
  beds: string;
  baths: string;
  address: string;
  state: string;
  lga: string;
  ward: string;
  estate: string;
  size: string;
}

export interface StepProps {
  formData: FormData;
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
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import PropertyDropdown from './PropertyDropdown';
import propertyService, { Property, SearchParams } from '../../../services/propertyService';

const PropertySearch: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    location_state: '',
    location_area: '',
    min_price: undefined,
    max_price: undefined,
    property_type: undefined,
    bedrooms: undefined,
    bathrooms: undefined,
    furnishing: undefined,
    condition: undefined,
    facilities: [],
    sort_by: 'price',
    sort_order: 'asc',
  });

  const {
    data: properties,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery< Error>({
    queryKey: ['properties', searchParams],
    queryFn: () => propertyService.searchProperties(searchParams),
    // enabled: false, // Don't run the query on component mount
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  console.log(properties);
  


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => ({ ...prev, location_area: e.target.value }));
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      [type === 'min' ? 'min_price' : 'max_price']: value === 'No Min' || value === 'No Max' ? undefined : parseFloat(value.replace('$', '')),
    }));
  };

  const handlePropertyTypeChange = (value: string) => {
    setSearchParams((prev) => ({ ...prev, property_type: value }));
  };

  const handleBedsAndBathsChange = (type: 'bedrooms' | 'bathrooms', value: string) => {
    setSearchParams((prev) => ({ ...prev, [type]: parseInt(value) }));
  };

  const handleMoreFiltersChange = (type: 'furnishing' | 'condition', value: string) => {
    setSearchParams((prev) => ({ ...prev, [type]: value }));
  };

  const handleFacilitiesChange = (facilities: string[]) => {
    setSearchParams((prev) => ({ ...prev, facilities }));
  };

  const handleSearch = () => {
    refetch();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Address, neighborhood, city, ZIP"
              value={searchParams.location_area}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>

          <PropertyDropdown
            title="Price"
            handlePriceChange={handlePriceChange}
            priceRange={{ min: searchParams.min_price?.toString() || 'No Min', max: searchParams.max_price?.toString() || 'No Max' }}
          />

          <PropertyDropdown
            title="Property Type"
            handlePropertyTypeChange={handlePropertyTypeChange}
            selectedPropertyType={searchParams.property_type}
          />

          <PropertyDropdown
            title="Beds & Baths"
            handleBedsAndBathsChange={handleBedsAndBathsChange}
            bedrooms={searchParams.bedrooms?.toString()}
            bathrooms={searchParams.bathrooms?.toString()}
          />

          <PropertyDropdown
            title="More"
            handleMoreFiltersChange={handleMoreFiltersChange}
            handleFacilitiesChange={handleFacilitiesChange}
            furnishing={searchParams.furnishing}
            condition={searchParams.condition}
            facilities={searchParams.facilities}
          />

          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>

        {isLoading && <div>Loading...</div>}
        {isError && <div>Error: {error.message}</div>}
        {properties && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <img src={property.images[0]} alt={property.description} className="w-full h-48 object-cover mb-4 rounded" />
      <h3 className="text-xl font-semibold">{property.property_address}</h3>
      <p className="text-gray-600">{property.location_area}, {property.location_state}</p>
      <p className="text-lg font-bold mt-2">${property.price.toLocaleString()} per annum</p>
      <div className="flex justify-between mt-2">
        <span>{property.bedrooms} beds</span>
        <span>{property.bathrooms} baths</span>
        <span>{property.property_type}</span>
      </div>
    </div>
  );
};

export default PropertySearch;
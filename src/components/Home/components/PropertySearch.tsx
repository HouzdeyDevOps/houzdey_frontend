import React, { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import PropertyDropdown from './PropertyDropdown';
import propertyService, { SearchParams } from '../../../services/propertyService';

const PropertySearch: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    search: '',
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

  const [searchInput, setSearchInput] = useState('');


  const {
    data: properties,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<any, Error>({
    queryKey: ['properties', searchParams],
    queryFn: () => propertyService.searchProperties(searchParams),
    enabled: false, // Don't run the query on component mount
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  // const handleSearch = useCallback(() => {
  //   setSearchParams(prevParams => ({
  //     ...prevParams,
  //     location_area: searchInput,
  //   }));
  //   refetch();
  // }, [searchInput, refetch]);



  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchInput(e.target.value);
  // };




  // const handleFilterChange = useCallback((filterType: keyof SearchParams, value: any) => {
  //   setSearchParams(prevParams => ({
  //     ...prevParams,
  //     [filterType]: value,
  //   }));
  // }, []);

  // const handleApplyFilters = useCallback(() => {
  //   refetch();
  // }, [refetch]);
  
  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams(prev => ({ ...prev, search: e.target.value }));
  };

  const handleFilterChange = useCallback((filterType: keyof SearchParams, value: any) => {
    setSearchParams(prev => ({ ...prev, [filterType]: value }));
  }, []);

  const handleApplyFilters = useCallback(() => {
    refetch();
  }, [refetch]);
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Address, neighborhood, city, ZIP"
              value={searchInput}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>

          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>

          <PropertyDropdown
            title="Price"
            handlePriceChange={(type, value) => handleFilterChange(type === 'min' ? 'min_price' : 'max_price', value)}
            priceRange={{ min: searchParams.min_price?.toString() || '', max: searchParams.max_price?.toString() || '' }}
            handleApply={handleApplyFilters}
          />

          <PropertyDropdown
            title="Property Type"
            handlePropertyTypeChange={(value) => handleFilterChange('property_type', value)}
            selectedPropertyType={searchParams.property_type}
            handleApply={handleApplyFilters}
          />

          <PropertyDropdown
            title="Beds & Baths"
            handleBedsAndBathsChange={(type, value) => handleFilterChange(type, value)}
            bedrooms={searchParams.bedrooms?.toString()}
            bathrooms={searchParams.bathrooms?.toString()}
            handleApply={handleApplyFilters}
          />

          <PropertyDropdown
            title="More"
            handleMoreFiltersChange={(type, value) => handleFilterChange(type, value)}
            handleFacilitiesChange={(facilities) => handleFilterChange('facilities', facilities)}
            furnishing={searchParams.furnishing}
            condition={searchParams.condition}
            facilities={searchParams.facilities}
            handleApply={handleApplyFilters}
          />
        </div>

        {isLoading && <div>Loading...</div>}
        {isError && <div>Error: {error.message}</div>}
        {properties && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((property: any) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PropertyCard: React.FC<{ property: any }> = ({ property }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <img src={property.images[0]} alt={property.description} className="w-full h-48 object-cover mb-4 rounded" />
      <h3 className="text-xl font-semibold">{property.property_address}</h3>
      <p className="text-gray-600">{property.location_area}, {property.location_state}</p>
      <p className="text-lg font-bold mt-2">₦{property.price.toLocaleString()} per annum</p>
      <div className="flex justify-between mt-2">
        <span>{property.bedrooms} beds</span>
        <span>{property.bathrooms} baths</span>
        <span>{property.property_type}</span>
      </div>
    </div>
  );
};

export default PropertySearch;
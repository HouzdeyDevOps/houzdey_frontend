import React, { useState } from 'react';
import { Search, MapPin, Home, Bed, Bath, DollarSign, Filter } from 'lucide-react';

// Define the Property interface
interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  furnishing: string;
  facilities: string[];
}

// Define the filter state interface
interface FilterState {
  location: string;
  minPrice: number;
  maxPrice: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  furnishing: string;
  facilities: string[];
}

const PropertySearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    location: '',
    minPrice: 0,
    maxPrice: 1000000,
    propertyType: '',
    bedrooms: 0,
    bathrooms: 0,
    furnishing: '',
    facilities: [],
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleFacilityChange = (facility: string) => {
    setFilters((prevFilters) => {
      const updatedFacilities = prevFilters.facilities.includes(facility)
        ? prevFilters.facilities.filter((f) => f !== facility)
        : [...prevFilters.facilities, facility];
      return { ...prevFilters, facilities: updatedFacilities };
    });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const applyFilters = () => {
    // TODO: Implement the logic to apply filters and update the property list
    console.log('Applying filters:', filters);
    setShowFilters(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        <button
          className="btn btn-primary flex items-center justify-center"
          onClick={toggleFilters}
        >
          <Filter size={20} className="mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="Enter location"
                    className="input input-bordered pl-10 w-full"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Price Range</span>
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="Min"
                      className="input input-bordered pl-10 w-full"
                    />
                  </div>
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="Max"
                      className="input input-bordered pl-10 w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Property Type</span>
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-2.5 text-gray-400" size={20} />
                  <select
                    name="propertyType"
                    value={filters.propertyType}
                    onChange={handleFilterChange}
                    className="select select-bordered pl-10 w-full"
                  >
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Bedrooms</span>
                </label>
                <div className="relative">
                  <Bed className="absolute left-3 top-2.5 text-gray-400" size={20} />
                  <select
                    name="bedrooms"
                    value={filters.bedrooms}
                    onChange={handleFilterChange}
                    className="select select-bordered pl-10 w-full"
                  >
                    <option value={0}>Any</option>
                    <option value={1}>1+</option>
                    <option value={2}>2+</option>
                    <option value={3}>3+</option>
                    <option value={4}>4+</option>
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Bathrooms</span>
                </label>
                <div className="relative">
                  <Bath className="absolute left-3 top-2.5 text-gray-400" size={20} />
                  <select
                    name="bathrooms"
                    value={filters.bathrooms}
                    onChange={handleFilterChange}
                    className="select select-bordered pl-10 w-full"
                  >
                    <option value={0}>Any</option>
                    <option value={1}>1+</option>
                    <option value={2}>2+</option>
                    <option value={3}>3+</option>
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Furnishing</span>
                </label>
                <select
                  name="furnishing"
                  value={filters.furnishing}
                  onChange={handleFilterChange}
                  className="select select-bordered w-full"
                >
                  <option value="">Any</option>
                  <option value="furnished">Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                  <option value="partlyFurnished">Partly Furnished</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold mb-2">Facilities</h4>
              <div className="flex flex-wrap gap-2">
                {['Parking', 'Pool', 'Gym', 'Security', 'Elevator', 'Balcony'].map((facility) => (
                  <label key={facility} className="cursor-pointer label">
                    <span className="label-text mr-2">{facility}</span>
                    <input
                      type="checkbox"
                      checked={filters.facilities.includes(facility)}
                      onChange={() => handleFacilityChange(facility)}
                      className="checkbox checkbox-primary"
                    />
                  </label>
                ))}
              </div>
            </div>

            <button className="btn btn-primary mt-4" onClick={applyFilters}>
              Apply Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertySearch;
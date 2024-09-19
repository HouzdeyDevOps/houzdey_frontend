import React, { useState, useEffect } from 'react';
import { Search, MapPin, Home, Bed, Bath, DollarSign, Filter } from 'lucide-react';

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
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [showFilters, setShowFilters] = useState(false);
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

  // Simulated API call to fetch properties
  useEffect(() => {
    // This would be replaced with an actual API call
    const fetchProperties = async () => {
      // Simulated data
      const data: Property[] = [
        // ... (sample property data would go here)
      ];
      setProperties(data);
      setFilteredProperties(data);
    };

    fetchProperties();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Perform search
    const searchResults = properties.filter(property => 
      property.title.toLowerCase().includes(value.toLowerCase()) ||
      property.location.toLowerCase().includes(value.toLowerCase())
    );
    
    setFilteredProperties(searchResults);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleFacilityChange = (facility: string) => {
    setFilters(prevFilters => {
      const updatedFacilities = prevFilters.facilities.includes(facility)
        ? prevFilters.facilities.filter(f => f !== facility)
        : [...prevFilters.facilities, facility];
      return { ...prevFilters, facilities: updatedFacilities };
    });
  };

  const applyFilters = () => {
    const filtered = properties.filter(property => {
      return (
        (filters.location === '' || property.location.toLowerCase().includes(filters.location.toLowerCase())) &&
        property.price >= filters.minPrice &&
        property.price <= filters.maxPrice &&
        (filters.propertyType === '' || property.propertyType === filters.propertyType) &&
        (filters.bedrooms === 0 || property.bedrooms >= filters.bedrooms) &&
        (filters.bathrooms === 0 || property.bathrooms >= filters.bathrooms) &&
        (filters.furnishing === '' || property.furnishing === filters.furnishing) &&
        (filters.facilities.length === 0 || filters.facilities.every(f => property.facilities.includes(f)))
      );
    });

    setFilteredProperties(filtered);
    setShowFilters(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search properties by title or location..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        {/* Filter Toggle Button */}
        <button
          className="btn bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} className="mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Location Filter */}
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

              {/* Price Range Filter */}
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

              {/* Property Type Filter */}
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

              {/* Bedrooms Filter */}
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

              {/* Bathrooms Filter */}
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

              {/* Furnishing Filter */}
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

            {/* Facilities Filter */}
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

            {/* Apply Filters Button */}
            <button className="btn bg-indigo-600 hover:bg-indigo-700 text-white mt-4" onClick={applyFilters}>
              Apply Filters
            </button>
          </div>
        )}

        {/* Display filtered properties */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProperties.map(property => (
            <div key={property.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{property.title}</h2>
                <p>Location: {property.location}</p>
                <p>Price: ${property.price}</p>
                <p>Type: {property.propertyType}</p>
                <p>Bedrooms: {property.bedrooms}</p>
                <p>Bathrooms: {property.bathrooms}</p>
                <p>Furnishing: {property.furnishing}</p>
                <p>Facilities: {property.facilities.join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertySearch;
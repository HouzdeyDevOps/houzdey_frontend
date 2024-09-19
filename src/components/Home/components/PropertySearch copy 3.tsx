import React, { useState } from 'react';
import { Search, ChevronDown, Heart } from 'lucide-react';

const PropertySearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 'No Min', max: 'No Max' });
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    setPriceRange(prev => ({ ...prev, [type]: value }));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4">
        {/* Search Bar and Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Address, neighborhood, city, ZIP"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          
          <button className="btn btn-outline">
            For Rent <ChevronDown size={16} />
          </button>
          
          <button 
            className={`btn btn-outline ${showPriceFilter ? 'btn-active' : ''}`}
            onClick={() => setShowPriceFilter(!showPriceFilter)}
          >
            Price <ChevronDown size={16} />
          </button>
          
          <button className="btn btn-outline">
            Beds & Baths <ChevronDown size={16} />
          </button>
          
          <button className="btn btn-outline">
            Home Type <ChevronDown size={16} />
          </button>
          
          <button className="btn btn-outline">
            More <ChevronDown size={16} />
          </button>
          
          <button className="btn btn-primary">
            Save search
          </button>
        </div>

        {/* Price Range Filter */}
        {showPriceFilter && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Price Range</h3>
            <div className="flex items-center space-x-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Minimum</span>
                </label>
                <select
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option>No Min</option>
                  <option>$500</option>
                  <option>$1000</option>
                  <option>$1500</option>
                  {/* Add more options as needed */}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Maximum</span>
                </label>
                <select
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option>No Max</option>
                  <option>$1000</option>
                  <option>$2000</option>
                  <option>$3000</option>
                  {/* Add more options as needed */}
                </select>
              </div>
            </div>
            <button className="btn btn-primary mt-4 w-full">Apply</button>
          </div>
        )}

        {/* Map and Listings Container */}
        <div className="flex">
          {/* Listings */}
          <div className="w-1/2 pl-4">
            <div className="flex justify-between items-center mb-4">
              <select className="select select-bordered">
                <option>Sort: Default</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                {/* Add more sorting options */}
              </select>
            </div>

            
            {/* Add more property cards here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertySearch;
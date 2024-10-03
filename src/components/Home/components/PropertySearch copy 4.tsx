import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import PriceDropdown from "./PropertyDropdown";

const PropertySearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({
    min: "No Min",
    max: "No Max",
  });
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePriceChange = (type: "min" | "max", value: string) => {
    setPriceRange((prev) => ({ ...prev, [type]: value }));
  };

  // if i click outside the dropdown, it should close, write the function here
  const handleClickOutside = (event: { target: any }) => {
    if (dropdownRef.current && !dropdownRef.current?.contains(event.target)) {
      setShowPriceFilter(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>

          {/* price dropdown */}
          <PriceDropdown
            title="Price"
            handlePriceChange={handlePriceChange}
            priceRange={priceRange}
          />

          {/* Property Type dropdown */}
          <PriceDropdown
            title="Property Type"
            handlePriceChange={handlePriceChange}
            priceRange={priceRange}
          />

          {/* Beds & Baths dropdown */}
          <PriceDropdown
            title="Beds & Baths"
            handlePriceChange={handlePriceChange}
            priceRange={priceRange}
          />

          {/* More */}
          <PriceDropdown
            title="More"
            handlePriceChange={handlePriceChange}
            priceRange={priceRange}
          />

          {/* Search Button */}
          <button className="btn btn-primary">Search</button>
        </div>
      </div>
    </div>
  );
};

export default PropertySearch;

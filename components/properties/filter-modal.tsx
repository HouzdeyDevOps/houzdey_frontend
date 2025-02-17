"use client";

import { X } from "lucide-react";
import { useState } from "react";

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onFilterChange: (count: number) => void;
  }

export default function FilterModal({ isOpen, onClose, onFilterChange }: FilterModalProps) {
    const [selectedFilters, setSelectedFilters] = useState([
        "All LGAs",
        "All states",
        "All states",
        "Bungalows",
        "Bungalows"
      ]);
  const [selectedState, setSelectedState] = useState("All");
  const [selectedLGA, setSelectedLGA] = useState("All");
  const [priceRange, setPriceRange] = useState({
    min: "50000",
    max: "10000000000",
  });
  const [rooms, setRooms] = useState({
    bedrooms: "Any",
    bathrooms: "2",
    kitchens: "3",
  });
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(
    []
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  if (!isOpen) return null;

  const propertyTypes = [
    "Any",
    "Apartment",
    "Bungalow",
    "Detached house",
    "Duplex",
    "Flats",
    "Mansion",
    "Penthouse",
  ];

  const amenities = [
    "Any",
    "Kitchen",
    "Solar power",
    "Water heater",
    "Air conditioner",
  ];

  const handleFilterRemove = (filter: string) => {
    setSelectedFilters((prev) => prev.filter((f) => f !== filter));
  };

// Update the handleApplyFilters function
const handleApplyFilters = () => {
    // Count active filters
    const activeFilters = [
      ...selectedFilters,
      ...selectedPropertyTypes,
      ...selectedAmenities,
      selectedState !== "All" ? 1 : 0,
      selectedLGA !== "All" ? 1 : 0,
      priceRange.min !== "50000" || priceRange.max !== "10000000000" ? 1 : 0,
      rooms.bedrooms !== "Any" || rooms.bathrooms !== "2" || rooms.kitchens !== "3" ? 1 : 0
    ].filter(Boolean).length;
    
    onFilterChange(activeFilters);
    onClose();
  };

  const addFilter = (filter: string) => {
    if (!selectedFilters.includes(filter)) {
      setSelectedFilters(prev => [...prev, filter]);
    }
  };
  
  
  const handleClearAll = () => {
    setSelectedFilters([]);
    setSelectedState("All");
    setSelectedLGA("All");
    setPriceRange({
      min: "50000",
      max: "10000000000"
    });
    setRooms({
      bedrooms: "Any",
      bathrooms: "2",
      kitchens: "3"
    });
    setSelectedPropertyTypes([]);
    setSelectedAmenities([]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center">
      <div className="bg-white w-full max-w-xl rounded-b-xl overflow-hidden absolute top-0 rounded-t-xl p-4">
        <div className="p-4 border-b">
          <div className="flex items-center justify-center">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button onClick={onClose} className="p-2 absolute right-5">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="py-4 px-8 space-y-8 h-[calc(100vh-140px)] overflow-y-auto">
          {/* Selected Filters */}
          <div>
            <h3 className="font-semibold mb-3">Selected filters</h3>
            <div className="flex flex-wrap gap-2">
              {selectedFilters.map((filter, index) => (
                <button
                  key={index}
                  className="px-3 py-1.5 bg-gray-100 rounded-full text-sm flex items-center gap-1"
                  onClick={() => handleFilterRemove(filter)}
                >
                  {filter}
                  <X className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* State Selection */}
          <div>
            <h3 className="font-medium mb-3">Select state</h3>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                addFilter(`State: ${e.target.value}`);
              }}              
              className="w-full p-3 border rounded-lg"
            >
              <option value="All">All</option>
            </select>
          </div>

          {/* LGA Selection */}
          <div>
            <h3 className="font-medium mb-3">Select LGA</h3>
            <select
              value={selectedLGA}
              onChange={(e) => {
                setSelectedLGA(e.target.value);
                addFilter(`LGA: ${e.target.value}`);
              }}
              className="w-full p-3 border rounded-lg"
            >
              <option value="All">All</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-medium mb-3">Price range</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm text-gray-600">Min</label>
                  <input
                    type="text"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        min: e.target.value,
                      }))
                    }
                    className="w-full p-3 border rounded-lg"
                    placeholder="₦ 50,000"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-600">Max</label>
                  <input
                    type="text"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        max: e.target.value,
                      }))
                    }
                    className="w-full p-3 border rounded-lg"
                    placeholder="₦ 10,000,000,000"
                  />
                </div>
              </div>
              <input
                type="range"
                className="w-full accent-indigo-600"
                min="50000"
                max="10000000000"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Number of Rooms */}
          <div>
            <h3 className="font-medium mb-3">Number of *</h3>
            <div className="space-y-4">
              {Object.entries(rooms).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="capitalize">{key}</span>
                  <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <X className="w-4 h-4 rotate-45" />
                    </button>
                    <span className="w-8 text-center">{value}</span>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <X className="w-4 h-4 rotate-90" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Property Type */}
          <div>
            <h3 className="font-medium mb-3">Type</h3>
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map((type) => (
                <button
                  key={type}
                  className={`px-4 py-2 rounded-full border ${
                    selectedPropertyTypes.includes(type)
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-300"
                  }`}
                  onClick={() => {
                    if (selectedPropertyTypes.includes(type)) {
                      setSelectedPropertyTypes((prev) =>
                        prev.filter((t) => t !== type)
                      );
                    } else {
                      setSelectedPropertyTypes((prev) => [...prev, type]);
                    }
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="font-medium mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity) => (
                <button
                  key={amenity}
                  className={`px-4 py-2 rounded-full border ${
                    selectedAmenities.includes(amenity)
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-300"
                  }`}
                  onClick={() => {
                    if (selectedAmenities.includes(amenity)) {
                      setSelectedAmenities(prev => prev.filter(a => a !== amenity));
                      handleFilterRemove(amenity);
                    } else {
                      setSelectedAmenities(prev => [...prev, amenity]);
                      addFilter(amenity);
                    }
                  }}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 p-4 border-t bg-white flex justify-between max-w-xl mx-auto">
          <button
            onClick={() => {
              setSelectedFilters([]);
              setSelectedPropertyTypes([]);
              setSelectedAmenities([]);
            }}
            className="text-gray-600"
          >
            Clear all
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Apply 5 filters
          </button>
        </div>
      </div>
    </div>
  );
}

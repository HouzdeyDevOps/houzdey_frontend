"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { PropertyFilters } from "@/@types/property";
import { useStates, useLGAs } from '@/hooks/useLocations';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onFilterChange: (filters: Partial<PropertyFilters>) => void;
  }

export default function FilterModal({ isOpen, onClose, onFilterChange }: FilterModalProps) {
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [selectedState, setSelectedState] = useState("All");
    const [selectedLGA, setSelectedLGA] = useState("All");
    const [priceRange, setPriceRange] = useState({
      min: "50000",
      max: "10000000000",
    });
    const [rooms, setRooms] = useState({
      bedrooms: "Any",
      bathrooms: "Any",
      kitchens: "Any",
    });
    const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

    const { data: states, isLoading: statesLoading } = useStates();
    const { data: lgas, isLoading: lgasLoading } = useLGAs(selectedState);

    const roomOptions = {
      bedrooms: ["Any", "1", "2", "3", "4", "5+"],
      bathrooms: ["Any", "1", "2", "3", "4", "5+"],
      kitchens: ["Any", "1", "2", "3", "4"],
    };

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
      
      if (filter.startsWith("Property: ")) {
        const type = filter.replace("Property: ", "");
        setSelectedPropertyTypes(prev => prev.filter(t => t !== type));
      } else if (filter.startsWith("Amenity: ")) {
        const amenity = filter.replace("Amenity: ", "");
        setSelectedAmenities(prev => prev.filter(a => a !== amenity));
      }
    };

    const handleApplyFilters = () => {
      const filters: Partial<PropertyFilters> = {
        property_type: selectedPropertyTypes.length > 0 ? selectedPropertyTypes : undefined,
        amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
        location_state: selectedState !== "All" ? selectedState : undefined,
        location_lga: selectedLGA !== "All" ? selectedLGA : undefined,
        min_price: priceRange.min !== "50000" ? parseInt(priceRange.min) : undefined,
        max_price: priceRange.max !== "10000000000" ? parseInt(priceRange.max) : undefined,
        bedrooms: rooms.bedrooms !== "Any" ? parseInt(rooms.bedrooms) : undefined,
        bathrooms: rooms.bathrooms !== "Any" ? parseInt(rooms.bathrooms) : undefined,
      };

      onFilterChange(filters);
      onClose();
    };

    const addFilter = (filter: string, type: string) => {
      const filterText = type === 'location' ? filter :
                        type === 'property' ? `Property: ${filter}` :
                        type === 'amenity' ? `Amenity: ${filter}` : filter;

      if (!selectedFilters.includes(filterText)) {
        setSelectedFilters(prev => [...prev, filterText]);
        
        switch (type) {
          case 'property':
            setSelectedPropertyTypes(prev => [...prev, filter]);
            break;
          case 'amenity':
            setSelectedAmenities(prev => [...prev, filter]);
            break;
          case 'location':
            // Location is handled by the select handlers
            break;
        }
      }
    };
    
    const handleClearAll = () => {
      setSelectedFilters([]);
      setSelectedPropertyTypes([]);
      setSelectedAmenities([]);
      setSelectedState("All");
      setSelectedLGA("All");
      setPriceRange({ min: "50000", max: "10000000000" });
      setRooms({ bedrooms: "Any", bathrooms: "Any", kitchens: "Any" });
    };

    const handleStateChange = (state: string) => {
      setSelectedState(state);
      setSelectedLGA("All"); // Reset LGA when state changes
      if (state !== "All") {
        addFilter(`State: ${state}`, 'location');
      }
    };

    const handleLGAChange = (lga: string) => {
      setSelectedLGA(lga);
      if (lga !== "All") {
        addFilter(`LGA: ${lga}`, 'location');
      }
    };

    const handleRoomChange = (type: keyof typeof rooms, value: string) => {
      setRooms(prev => ({ ...prev, [type]: value }));
      if (value !== "Any") {
        addFilter(`${type.charAt(0).toUpperCase() + type.slice(1)}: ${value}`, 'room');
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex justify-center">
        <div className="bg-white w-full max-w-xl rounded-b-xl overflow-hidden absolute top-0">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Filters</h2>
              <button onClick={onClose} className="p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="py-4 px-8 space-y-8 h-[calc(100vh-140px)] overflow-y-auto">
            {/* Selected Filters */}
            {selectedFilters.length > 0 && (
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
            )}

            {/* State Selection */}
            <div>
              <h3 className="font-medium mb-3">Select state</h3>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full p-3 border rounded-lg"
                disabled={statesLoading}
              >
                <option value="All">All States</option>
                {states?.map((state: string) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* LGA Selection */}
            <div>
              <h3 className="font-medium mb-3">Select LGA</h3>
              <select
                value={selectedLGA}
                onChange={(e) => handleLGAChange(e.target.value)}
                className="w-full p-3 border rounded-lg"
                disabled={lgasLoading || selectedState === "All"}
              >
                <option value="All">All LGAs</option>
                {lgas?.map((lga: string) => (
                  <option key={lga} value={lga}>
                    {lga}
                  </option>
                ))}
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

            {/* Rooms Section */}
            <div className="space-y-6">
              <h3 className="font-medium mb-3">Rooms</h3>
              
              {/* Bedrooms */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Bedrooms</label>
                <select
                  value={rooms.bedrooms}
                  onChange={(e) => handleRoomChange('bedrooms', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  {roomOptions.bedrooms.map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Bathrooms</label>
                <select
                  value={rooms.bathrooms}
                  onChange={(e) => handleRoomChange('bathrooms', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  {roomOptions.bathrooms.map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* Kitchens */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Kitchens</label>
                <select
                  value={rooms.kitchens}
                  onChange={(e) => handleRoomChange('kitchens', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  {roomOptions.kitchens.map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Property Type */}
            <div>
              <h3 className="font-medium mb-3">Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {propertyTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => addFilter(type, 'property')}
                    className={`p-3 border rounded-lg text-left ${
                      selectedPropertyTypes.includes(type) 
                        ? 'border-indigo-600 bg-indigo-50' 
                        : 'hover:border-gray-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="font-medium mb-3">Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
                {amenities.map((amenity) => (
                  <button
                    key={amenity}
                    onClick={() => addFilter(amenity, 'amenity')}
                    className={`p-3 border rounded-lg text-left ${
                      selectedAmenities.includes(amenity) 
                        ? 'border-indigo-600 bg-indigo-50' 
                        : 'hover:border-gray-400'
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-4 flex justify-between items-center">
            <button
              onClick={handleClearAll}
              className="text-gray-600 font-medium"
            >
              Clear all
            </button>
            <button
              onClick={handleApplyFilters}
              className="bg-indigo-600 text-white px-8 py-2 rounded-lg hover:bg-indigo-700"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    );
}

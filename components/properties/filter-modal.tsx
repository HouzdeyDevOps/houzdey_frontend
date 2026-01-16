"use client";

import { Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import { PropertyFilters } from "@/@types/property";
import { useStates, useLGAs } from '@/hooks/useLocations';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { MultiRangeSlider } from '@/components/ui/double-range-slider';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onFilterChange: (filters: Partial<PropertyFilters>) => void;
  }

export default function FilterModal({ isOpen, onClose, onFilterChange }: FilterModalProps) {
    const dispatch = useDispatch();
    const currentFilters = useSelector((state: RootState) => state.property.filters);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [selectedState, setSelectedState] = useState("All");
    const [selectedLGA, setSelectedLGA] = useState("All");
    const [priceRange, setPriceRange] = useState({
      min: "",
      max: "",
    });
    const [rooms, setRooms] = useState({
      bedrooms: "0",
      bathrooms: "0",
      toilets: "0",
    });
    const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

    const { data: states, isLoading: statesLoading } = useStates();
    const { data: lgas, isLoading: lgasLoading } = useLGAs(selectedState);

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
      } else if (filter.includes("LGA: ")) {
        setSelectedLGA("All");
      } else if (filter.includes("State: ")) {
        setSelectedState("All");
        setSelectedLGA("All");
      }
    };

    const handleApplyFilters = () => {
      const filters: Partial<PropertyFilters> = {
        property_type: selectedPropertyTypes.length > 0 ? selectedPropertyTypes : undefined,
        amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
        state: selectedState !== "All" ? selectedState : undefined,
        lga: selectedLGA !== "All" ? selectedLGA : undefined,
        min_price: priceRange.min ? parseInt(priceRange.min) : undefined,
        max_price: priceRange.max ? parseInt(priceRange.max) : undefined,
        bedrooms: rooms.bedrooms !== "0" ? parseInt(rooms.bedrooms) : undefined,
        bathrooms: rooms.bathrooms !== "0" ? parseInt(rooms.bathrooms) : undefined,
        search: currentFilters.search
      };

      onFilterChange(filters);
      onClose();
    };

    const addFilter = (value: string, type: 'property' | 'amenity' | 'location' | 'room') => {
      const filterText = type === 'location' ? value :
                        type === 'property' ? `Property: ${value}` :
                        type === 'amenity' ? `Amenity: ${value}` :
                        type === 'room' ? value : value;

      // Check if filter already exists
      const filterExists = selectedFilters.includes(filterText);
      
      if (filterExists) {
        // Remove the filter
        setSelectedFilters(prev => prev.filter(f => f !== filterText));
        
        // Remove from corresponding state
        switch (type) {
          case 'property':
            setSelectedPropertyTypes(prev => prev.filter(t => t !== value));
            break;
          case 'amenity':
            setSelectedAmenities(prev => prev.filter(a => a !== value));
            break;
        }
      } else {
        // Add the filter
        setSelectedFilters(prev => [...prev, filterText]);
        
        // Add to corresponding state
        switch (type) {
          case 'property':
            setSelectedPropertyTypes(prev => [...prev, value]);
            break;
          case 'amenity':
            setSelectedAmenities(prev => [...prev, value]);
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
      setPriceRange({ min: "", max: "" });
      setRooms({ bedrooms: "0", bathrooms: "0", toilets: "0" });
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

    const handleRoomChange = (type: string, value: string) => {
      setRooms(prev => ({ ...prev, [type]: value }));
      
      // Create the filter text (e.g., "Bedrooms: 2")
      const filterText = `${type.charAt(0).toUpperCase() + type.slice(1)}: ${value}`;
      
      // Remove any existing filter for this room type
      setSelectedFilters(prev => prev.filter(filter => !filter.startsWith(type.charAt(0).toUpperCase() + type.slice(1))));
      
      // Only add the new filter if the value is not "0"
      if (value !== "0") {
        setSelectedFilters(prev => [...prev, filterText]);
      }
    };

    const formatPrice = (price: string) => {
      if (!price) return '';
      const num = parseInt(price);
      return isNaN(num) ? '' : num.toLocaleString('en-NG');
    };

    const parsePrice = (price: string) => {
      const cleaned = price.replace(/[^0-9]/g, '');
      return cleaned;
    };

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex justify-center">
        <div className="bg-white w-full max-w-xl rounded-b-xl overflow-hidden absolute top-0">
          <div className="p-4 border-b">
            <div className="flex items-center justify-center relative">
              <h2 className="text-xl font-semibold">Filters</h2>
              <button onClick={onClose} className="p-2 absolute right-0">
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
                    onClick={() => handleFilterRemove(filter)}
                    className="px-3 py-1.5 bg-gray-100 rounded-full text-sm flex items-center gap-1"
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
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full p-3 border rounded-lg"
                disabled={statesLoading}
              >
                <option value="All">All States</option>
                {states?.map((state: string) => (
                  <option key={state} value={state} className="capitalize">
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
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                      <input
                        type="text"
                        value={formatPrice(priceRange.min)}
                        onChange={(e) =>
                          setPriceRange((prev) => ({
                            ...prev,
                            min: parsePrice(e.target.value),
                          }))
                        }
                        className="w-full p-3 pl-8 border rounded-lg"
                        placeholder="500,000"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-gray-600">Max</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                      <input
                        type="text"
                        value={formatPrice(priceRange.max)}
                        onChange={(e) =>
                          setPriceRange((prev) => ({
                            ...prev,
                            max: parsePrice(e.target.value),
                          }))
                        }
                        className="w-full p-3 pl-8 border rounded-lg"
                        placeholder="200,000,000"
                      />
                    </div>
                  </div>
                </div>
                <MultiRangeSlider
                  min={50000}
                  max={10000000000}
                  initialMin={parseInt(priceRange.min) || 50000}
                  initialMax={parseInt(priceRange.max) || 10000000000}
                  onChange={({ min, max }) => {
                    setPriceRange({
                      min: min.toString(),
                      max: max.toString()
                    });
                  }}
                />
              </div>
            </div>

            {/* Rooms Section */}
            <div>
              <h3 className="font-medium mb-3">Number of rooms</h3>
              <div className="space-y-4">
                {Object.entries(rooms).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="capitalize">{key}</span>
                    <div className="flex items-center gap-4">
                      <button 
                        className="p-2 hover:bg-gray-100 rounded-full"
                        onClick={() => handleRoomChange(key, Math.max(0, parseInt(value) - 1).toString())}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{value}</span>
                      <button 
                        className="p-2 hover:bg-gray-100 rounded-full"
                        onClick={() => handleRoomChange(key, (parseInt(value) + 1).toString())}
                      >
                        <Plus className="w-4 h-4" />
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
                    onClick={() => addFilter(type, 'property')}
                    className={`px-4 py-2 rounded-full border ${
                      selectedPropertyTypes.includes(type)
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-300"
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
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity) => (
                  <button
                    key={amenity}
                    onClick={() => addFilter(amenity, 'amenity')}
                    className={`px-4 py-2 rounded-full border ${
                      selectedAmenities.includes(amenity)
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-300"
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
              Apply {selectedFilters.length} filters
            </button>
          </div>
        </div>
      </div>
    );
}

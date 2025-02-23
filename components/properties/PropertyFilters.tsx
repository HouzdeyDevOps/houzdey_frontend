import { useState } from 'react';
import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '@/store/slices/propertySlice';
import { RootState } from '@/store/store';
import { PropertyFilters, SelectedFilter } from '@/@types/property';

interface PropertyFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: Partial<PropertyFilters>) => void;
}

export default function PropertyFiltersModal({
  isOpen,
  onClose,
  onFilterChange,
}: PropertyFiltersProps) {
  const dispatch = useDispatch();
  const currentFilters = useSelector((state: RootState) => state.property.filters);
  
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilter[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedState, setSelectedState] = useState('');
  const [selectedLGA, setSelectedLGA] = useState('');
  const [selectedBeds, setSelectedBeds] = useState<number | null>(null);
  const [selectedBaths, setSelectedBaths] = useState<number | null>(null);

  const handleFilterAdd = (type: string, value: string) => {
    const newFilter = { type, value };
    setSelectedFilters([...selectedFilters, newFilter]);
    
    // Update filters based on type
    const updatedFilters: Partial<PropertyFilters> = {};
    switch (type) {
      case 'price':
        const [min, max] = value.split('-');
        updatedFilters.min_price = parseInt(min);
        updatedFilters.max_price = parseInt(max);
        break;
      case 'location':
        updatedFilters.state = selectedState;
        updatedFilters.lga = selectedLGA;
        break;
      case 'beds':
        updatedFilters.bedrooms = parseInt(value);
        break;
      case 'baths':
        updatedFilters.bathrooms = parseInt(value);
        break;
    }
    
    onFilterChange(updatedFilters);
  };

  const handleFilterRemove = (filterToRemove: SelectedFilter) => {
    setSelectedFilters(selectedFilters.filter(
      filter => filter.type !== filterToRemove.type || filter.value !== filterToRemove.value
    ));
  };

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

  const handlePropertyTypeChange = (type: string) => {
    const newTypes = currentFilters.property_type || [];
    const updatedTypes = newTypes.includes(type)
      ? newTypes.filter(t => t !== type)
      : [...newTypes, type];

    handleFilterAdd('property_type', type);
  };

  const handlePriceChange = (min: number, max: number) => {
    handleFilterAdd('price', `${min}-${max}`);
  };

  const handleRoomChange = (type: 'bedrooms' | 'bathrooms', value: number) => {
    handleFilterAdd(type, value.toString());
  };

  const applyFilters = () => {
    onFilterChange({
      min_price: priceRange.min ? parseInt(priceRange.min) : undefined,
      max_price: priceRange.max ? parseInt(priceRange.max) : undefined,
      bedrooms: selectedBeds || undefined,
      bathrooms: selectedBaths || undefined,
      state: selectedState || undefined,
      lga: selectedLGA || undefined,
    });
    onClose();
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    onFilterChange({});
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Selected Filters */}
          {selectedFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedFilters.map((filter, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1"
                >
                  {filter.value}
                  <button onClick={() => handleFilterRemove(filter)}>
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Price Range */}
          <div>
            <h3 className="font-medium mb-3">Price Range</h3>
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Min"
                className="w-full p-2 border rounded"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              />
              <input
                type="number"
                placeholder="Max"
                className="w-full p-2 border rounded"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              />
            </div>
          </div>

          {/* Beds & Baths */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-3">Beds</h3>
              <select 
                className="w-full p-2 border rounded"
                value={selectedBeds || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedBeds(value ? parseInt(value) : null);
                  if (value) handleFilterAdd('beds', value);
                }}
              >
                <option value="">Any</option>
                {[1,2,3,4,5].map(num => (
                  <option key={num} value={num}>{num}+ beds</option>
                ))}
              </select>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Baths</h3>
              <select 
                className="w-full p-2 border rounded"
                value={selectedBaths || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedBaths(value ? parseInt(value) : null);
                  if (value) handleFilterAdd('baths', value);
                }}
              >
                <option value="">Any</option>
                {[1,2,3,4,5].map(num => (
                  <option key={num} value={num}>{num}+ baths</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Apply Filters Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <button
            onClick={applyFilters}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
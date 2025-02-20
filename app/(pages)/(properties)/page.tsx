// app/properties/page.tsx
"use client";

import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { propertyApi } from "@/api/properties";
import { setFilters, setPage } from "@/store/slices/propertySlice";
import { RootState } from "@/store/store";
import Navbar from "@/components/navbar/Navbar";
import PropertyCard from "@/components/properties/propertycard";
import Loader from "@/components/ui/Loader";
import { SortOrder, SortBy, PropertyFilters } from "@/@types/property";
import Pagination from "@/components/ui/pagination";
import { usePropertyFilters } from '@/hooks/usePropertyFilters';
import PropertyFiltersComponent from '@/components/properties/PropertyFilters';
import FilterModal from '@/components/properties/filter-modal';

export default function HomePage() {
  const { 
    filters, 
    data, 
    isLoading, 
    updateFilters, 
    updatePage 
  } = usePropertyFilters();
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (newFilters: Partial<PropertyFilters>) => {
    updateFilters(newFilters);
  };

  const handleSearchChange = (search: string) => {
    updateFilters({ search });
  };

  return (
    <main className="min-h-screen">
      <Navbar 
        showSearch={true} 
        showPropertyTypeFilters={true}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onFilterClick={() => setShowFilters(true)}
      />
      
      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onFilterChange={handleFilterChange}
      />

      <section className="max-w-7xl mx-auto p-4 mt-44">
        <div className="flex justify-end mb-4 gap-x-2">
          <select 
            className="border rounded-lg px-3 py-2"
            onChange={(e) => {
              const [sort_by, sort_order] = e.target.value.split('-');
              handleFilterChange({ sort_by: sort_by as SortBy, sort_order: sort_order as SortOrder });
            }}
            value={`${filters.sort_by}-${filters.sort_order}`}
          >
            <option value="created_at-desc">Newest to Oldest</option>
            <option value="created_at-asc">Oldest to Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data?.properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            
            <div className="mt-8">
              <Pagination
                currentPage={filters.page}
                totalPages={data?.pagination.total_pages || 1}
                onPageChange={updatePage}
              />
            </div>
          </>
        )}
      </section>
    </main>
  );
}

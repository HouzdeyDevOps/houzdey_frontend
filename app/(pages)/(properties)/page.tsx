// app/properties/page.tsx
"use client";

import { useState } from 'react';
import Navbar from "@/components/navbar/Navbar";
import PropertyCard from "@/components/properties/propertycard";
import Loader from "@/components/ui/Loader";
import { SortOrder, SortBy, PropertyFilters, Property } from "@/@types/property";
import Pagination from "@/components/ui/pagination";
import { usePropertyFilters } from '@/hooks/usePropertyFilters';
import FilterModal from '@/components/properties/filter-modal';
import { PropertyCardSkeleton } from '@/components/ui/property-card-skeleton';

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
    <main className="pt-20">
      <Navbar 
        showSearch={true} 
        showPropertyTypeFilters={true}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onFilterClick={() => setShowFilters(true)}
      />
      


      <section className="max-w-7xl mx-auto px-8 mt-44 ">
        <div className="flex justify-end mb-4 gap-x-2 ">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-screen">
          {isLoading ? (
            // Show 8 skeleton cards while loading
            Array(8).fill(0).map((_, index) => (
              <PropertyCardSkeleton key={index} />
            ))
          ) : (
            data?.properties.map((property: Property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          )}
        </div>
            
        {!isLoading && (
          <div className="mt-8">
            <Pagination
              currentPage={filters.page}
              totalPages={data?.pagination.total_pages || 1}
              onPageChange={updatePage}
            />
          </div>
        )}



        <FilterModal
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          onFilterChange={handleFilterChange}
      />
      </section>
    </main>
  );
}

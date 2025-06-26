// app/properties/page.tsx
"use client";

import { useState } from 'react';
import Navbar from "@/components/navbar/Navbar";
import PropertyCard from "@/components/properties/propertycard";
import Loader from "@/components/ui/Loader";
import { SortOrder, SortBy, PropertyFilters, Property } from "@/@types/property";
import Pagination from "@/components/ui/pagination";
import { usePropertyFilters } from '@/hooks/usePropertyFilters';
import { useWishlist } from '@/hooks/useWishlist';
import FilterModal from '@/components/properties/filter-modal';
import { PropertyCardSkeleton } from '@/components/ui/property-card-skeleton';
import ListingTypeNav from "@/components/navbar/ListingTypeNav";
import SortingSelect from '@/components/properties/SortingSelect';

export default function HomePage() {
  const { 
    filters, 
    data, 
    isLoading, 
    updateFilters, 
    updatePage 
  } = usePropertyFilters();
  const [showFilters, setShowFilters] = useState(false);
  
  // Initialize wishlist data when component mounts
  useWishlist();

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
      
      {/* New Listing Type Navigation */}
      {/* <ListingTypeNav /> */}
      


      <section className="max-w-7xl mx-auto px-8 lg:mt-44 mt-10">
        <div className="flex justify-end mb-4 gap-x-2 ">
          <SortingSelect
            sortBy={filters.sort_by || SortBy.CREATED_AT}
            sortOrder={filters.sort_order || SortOrder.DESC}
            onSortChange={(sortBy, sortOrder) => {
              handleFilterChange({ sort_by: sortBy, sort_order: sortOrder });
            }}
          />
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
            
        {!isLoading && data?.properties?.length && data?.properties?.length > 11 && (
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

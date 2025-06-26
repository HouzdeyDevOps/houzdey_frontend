import React, { useState, useEffect } from 'react';
import { SortOrder, SortBy } from '@/@types/property';

interface SortingSelectProps {
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortChange: (sortBy: SortBy, sortOrder: SortOrder) => void;
}

const SortingSelect: React.FC<SortingSelectProps> = ({ sortBy, sortOrder, onSortChange }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return a static version for SSR
    return (
      <select 
        className="border rounded-lg px-3 py-2"
        value={`${sortBy}-${sortOrder}`}
        readOnly
      >
        <option value="created_at-desc">Newest to Oldest</option>
        <option value="created_at-asc">Oldest to Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    );
  }

  return (
    <select 
      className="border rounded-lg px-3 py-2"
      onChange={(e) => {
        const [sort_by, sort_order] = e.target.value.split('-');
        onSortChange(sort_by as SortBy, sort_order as SortOrder);
      }}
      value={`${sortBy}-${sortOrder}`}
      suppressHydrationWarning={true}
    >
      <option value="created_at-desc">Newest to Oldest</option>
      <option value="created_at-asc">Oldest to Newest</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
    </select>
  );
};

export default SortingSelect; 
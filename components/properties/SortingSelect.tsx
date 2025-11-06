import React from 'react';
import { SortOrder, SortBy } from '@/@types/property';
import { useMounted } from '@/utils/hydration';

interface SortingSelectProps {
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortChange: (sortBy: SortBy, sortOrder: SortOrder) => void;
}

const SortingSelect: React.FC<SortingSelectProps> = ({ sortBy, sortOrder, onSortChange }) => {
  const mounted = useMounted();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!mounted) return; // Prevent change events during SSR
    const [sort_by, sort_order] = e.target.value.split('-');
    onSortChange(sort_by as SortBy, sort_order as SortOrder);
  };

  return (
    <select 
      className="border rounded-lg px-3 py-2"
      onChange={handleChange}
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
import { useQuery } from '@tanstack/react-query';
import { propertyApi } from '@/api/properties';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setFilters, setPage } from '@/store/slices/propertySlice';
import { PropertyFilters } from '@/@types/property';

export const usePropertyFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.property.filters);

  const { data, isLoading, error } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyApi.getProperties(filters),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    // keepPreviousData: true, // Keep previous data while fetching new data
    refetchOnWindowFocus: false
  });

  const updateFilters = (newFilters: Partial<PropertyFilters>) => {
    // Merge new filters with existing ones and reset page
    dispatch(setFilters({ 
      ...filters,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
  };

  const updatePage = (page: number) => {
    dispatch(setPage(page));
  };

  const resetFilters = () => {
    dispatch(setFilters({
      search: '',
      min_price: undefined,
      max_price: undefined,
      property_type: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      state: undefined,
      lga: undefined,
      amenities: [],
      page: 1,
      limit: 12
    }));
  };

  return {
    filters,
    data,
    isLoading,
    error,
    updateFilters,
    updatePage,
    resetFilters
  };
}; 
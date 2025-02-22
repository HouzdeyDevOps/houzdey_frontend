import { useQuery } from '@tanstack/react-query';
import { propertyApi } from '@/api/properties';

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyApi.getPropertyById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false
  });
}; 
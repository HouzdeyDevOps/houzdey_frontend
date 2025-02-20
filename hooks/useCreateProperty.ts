import { useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyApi } from '@/api/properties';
import { CreateListingFormData } from '@/@types/create-listing';

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: CreateListingFormData) => 
      propertyApi.createProperty(formData),
    onSuccess: () => {
      // Invalidate properties query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    }
  });
}; 
import { useQuery } from '@tanstack/react-query';
import { locationService } from '@/services/locationService';

export function useStates() {
  return useQuery({
    queryKey: ['states'],
    queryFn: () => locationService.getStates(),
    staleTime: Infinity, // Since this data rarely changes
  });
}

export function useLGAs(state: string) {
  return useQuery({
    queryKey: ['lgas', state],
    queryFn: () => locationService.getLGAs(state),
    enabled: !!state,
    staleTime: Infinity,
  });
}

export function useWards(state: string, lga: string) {
  return useQuery({
    queryKey: ['wards', state, lga],
    queryFn: () => locationService.getWards(state, lga),
    enabled: !!state && !!lga,
    staleTime: Infinity,
  });
} 
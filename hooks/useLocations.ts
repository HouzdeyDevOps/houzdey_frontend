import { useMemo } from 'react';
import { locationService } from '@/services/locationService';

export function useStates() {
  const data = useMemo(() => locationService.getStates(), []);
  return { data, isLoading: false };
}

export function useLGAs(state: string) {
  const data = useMemo(() => locationService.getLGAs(state), [state]);
  return { data, isLoading: false };
}

// frontend/hooks/useAuth.ts
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export function useAuth() {
  const { user, isAuthenticated, isLoading } = useSelector((state: RootState) => state.userAuth);
  
  return {
    user,
    isAuthenticated,
    isLoading
  };
}
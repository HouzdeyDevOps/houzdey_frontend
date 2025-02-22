// frontend/hooks/useAuth.ts
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
// import { User } from '@/store/slices/userAuthSlice';

export function useAuth() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.userAuth);
  
  return {
    user,
    isAuthenticated,
  };
}
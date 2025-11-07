'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, setInitialized } from '@/store/slices/userAuthSlice';
import { setWishlistItems } from '@/store/slices/wishlistSlice';
import { authApi } from '@/api/auth';
import { wishlistApi } from '@/api/wishlist';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const user = await authApi.getCurrentUser();
          
          dispatch(login({
            user,
            token
          }));

          // Initialize wishlist for authenticated user
          try {
            const wishlistData = await wishlistApi.getWishlistIds();
            const propertyIds = wishlistData.items || [];
            dispatch(setWishlistItems(propertyIds));
          } catch (wishlistError) {
            // Don't fail auth if wishlist fails to load
          }
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          dispatch(setWishlistItems([]));
        }
      }
      
      // Set initialized to true whether we have a token or not
      dispatch(setInitialized(true));
      setIsInitialized(true);
    };

    initializeAuth();
  }, [dispatch, isMounted]);

  // Don't render anything until component is mounted (avoids hydration mismatch)
  if (!isMounted || !isInitialized) {
    return <>{children}</>;
  }

  return <>{children}</>;
} 
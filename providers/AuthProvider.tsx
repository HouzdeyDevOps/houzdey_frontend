'use client';

import '@/lib/axiosDefaults';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, logout, setInitialized } from '@/store/slices/userAuthSlice';
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
      try {
        // The httpOnly access_token cookie (if any) is sent automatically with this request.
        const user = await authApi.getCurrentUser();
        dispatch(login({ user }));

        // Initialize wishlist for authenticated user
        try {
          const wishlistData = await wishlistApi.getWishlistIds();
          const propertyIds = wishlistData.items || [];
          dispatch(setWishlistItems(propertyIds));
        } catch (wishlistError) {
          // Don't fail auth if wishlist fails to load
        }
      } catch (error) {
        // Not signed in (no cookie, or expired): stay logged out
        dispatch(logout());
        dispatch(setWishlistItems([]));
      }

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

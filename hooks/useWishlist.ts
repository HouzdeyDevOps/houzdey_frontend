import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { wishlistApi } from '@/api/wishlist';
import { setWishlistItems, setError, setLoading } from '@/store/slices/wishlistSlice';

export const useWishlist = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state: RootState) => state.wishlist);
  const isAuthenticated = useSelector((state: RootState) => state.userAuth.isAuthenticated);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) {
        dispatch(setWishlistItems([]));
        return;
      }
      
      try {
        dispatch(setLoading(true));
        const wishlistData = await wishlistApi.getWishlistIds();
        
        // Extract property IDs from the wishlist response
        const propertyIds: string[] = wishlistData.items || [];
        
        dispatch(setWishlistItems(propertyIds));
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
        dispatch(setError('Failed to fetch wishlist'));
        dispatch(setWishlistItems([]));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchWishlist();
  }, [isAuthenticated, dispatch]);

  return { items, loading, error };
}; 
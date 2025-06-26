import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { RootState } from '@/store/store';
import { addToWishlist, removeFromWishlist, setWishlistItems } from '@/store/slices/wishlistSlice';
import { wishlistApi } from '@/api/wishlist';
import { setCurrentModal } from '@/store/slices/authModalSlice';
import { showSuccessToast, showErrorToast } from '@/utils/toast';

interface WishlistButtonProps {
  propertyId: string;
  className?: string;
}

export default function WishlistButton({ propertyId, className = '' }: WishlistButtonProps) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isAuthenticated = useSelector((state: RootState) => state.userAuth.isAuthenticated);
  const isInWishlist = wishlistItems.includes(propertyId);
  const [isAnimating, setIsAnimating] = useState(false);

  // Note: localStorage sync is now handled in the wishlist slice

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      dispatch(setCurrentModal("signin"));
      showErrorToast("Please sign in to add properties to your wishlist");
      return;
    }

    setIsAnimating(true);
    
    try {
      if (isInWishlist) {
        // Remove from wishlist
        dispatch(removeFromWishlist(propertyId));
        await wishlistApi.removeFromWishlist(propertyId);
        showSuccessToast("Property removed from wishlist");
      } else {
        // Add to wishlist
        dispatch(addToWishlist(propertyId));
        await wishlistApi.addToWishlist(propertyId);
        showSuccessToast("Property added to wishlist");
      }

      // Refresh wishlist data to ensure consistency
      try {
        const wishlistData = await wishlistApi.getWishlistIds();
        const propertyIds = wishlistData.items || [];
        dispatch(setWishlistItems(propertyIds));
      } catch (refreshError) {
        console.error('Failed to refresh wishlist:', refreshError);
      }

    } catch (error) {
      // Revert optimistic update on error
      if (isInWishlist) {
        dispatch(addToWishlist(propertyId));
        showErrorToast("Failed to remove property from wishlist");
      } else {
        dispatch(removeFromWishlist(propertyId));
        showErrorToast("Failed to add property to wishlist");
      }
      console.error('Wishlist operation failed:', error);
    } finally {
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  return (
    <motion.button
      onClick={handleWishlistClick}
      className={`absolute bottom-2 right-2 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors ${className}`}
      whileTap={{ scale: 0.9 }}
    >
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={isInWishlist ? 'filled' : 'empty'}
            initial={{ scale: 1 }}
            animate={{ 
              scale: isAnimating ? [1, 1.2, 0.9, 1.1, 1] : 1,
            }}
            transition={{
              duration: 0.4,
              times: [0, 0.2, 0.4, 0.6, 1],
              ease: "easeInOut"
            }}
            className="relative"
          >
            {isAnimating && !isInWishlist && (
              <div className="heart-animation active absolute inset-0">
                <div className="heart-burst-particles" />
              </div>
            )}
            <Heart
              className={`w-7 h-7 transition-colors ${
                isInWishlist 
                  ? 'fill-red-500 stroke-red-500' 
                  : 'stroke-gray-600 fill-transparent hover:stroke-red-500'
              }`}
              strokeWidth={2}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.button>
  );
}
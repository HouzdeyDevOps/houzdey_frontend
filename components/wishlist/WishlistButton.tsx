import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { RootState } from '@/store/store';
import { addToWishlist, removeFromWishlist } from '@/store/slices/wishlistSlice';
import { wishlistApi } from '@/api/wishlist';
import { setCurrentModal } from '@/store/slices/authModalSlice';

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

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      dispatch(setCurrentModal("signin"));
      return;
    }

    setIsAnimating(true);
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(propertyId));
    } else {
      dispatch(addToWishlist(propertyId));
    }

    try {
      if (isInWishlist) {
        await wishlistApi.removeFromWishlist(propertyId);
      } else {
        await wishlistApi.addToWishlist(propertyId);
      }
    } catch (error) {
      if (isInWishlist) {
        dispatch(addToWishlist(propertyId));
      } else {
        dispatch(removeFromWishlist(propertyId));
      }
      console.error('Wishlist operation failed:', error);
    } finally {
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  return (
    <motion.button
      onClick={handleWishlistClick}
    //   bg-white/80 hover:bg-white
      className={`absolute bottom-2 right-2 z-10 p-2 rounded-full transition-colors ${className}`}
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
            {isAnimating && isInWishlist && (
              <div className="heart-animation active absolute inset-0">
                <div className="heart-burst-particles" />
              </div>
            )}
            <Heart
              className={`w-7 h-7 transition-colors ${
                isInWishlist 
                  ? 'fill-red-500 stroke-red-500' 
                  : 'stroke-gray-100 fill-transparent'
              }`}
              strokeWidth={2}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.button>
  );
}
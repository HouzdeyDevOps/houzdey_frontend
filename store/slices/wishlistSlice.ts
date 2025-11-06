import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistState {
  items: string[];
  loading: boolean;
  error: string | null;
}

const loadWishlistFromStorage = (): string[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

const initialState: WishlistState = {
  items: loadWishlistFromStorage(),
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlistItems: (state, action: PayloadAction<string[]>) => {
      state.items = action.payload;
      // Sync to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('wishlist', JSON.stringify(action.payload));
      }
    },
    addToWishlist: (state, action: PayloadAction<string>) => {
      if (!state.items.includes(action.payload)) {
        state.items.push(action.payload);
        // Sync to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('wishlist', JSON.stringify(state.items));
        }
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(id => id !== action.payload);
      // Sync to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('wishlist', JSON.stringify(state.items));
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setWishlistItems,
  addToWishlist,
  removeFromWishlist,
  setLoading,
  setError,
} = wishlistSlice.actions;

export default wishlistSlice;
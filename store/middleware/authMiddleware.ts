import { createListenerMiddleware } from '@reduxjs/toolkit';
import { login, logout } from '../slices/userAuthSlice';
import { setWishlistItems } from '../slices/wishlistSlice';
import axios from 'axios';

export const authMiddleware = createListenerMiddleware();

const isBrowser = typeof window !== 'undefined';

export const initializeAuth = () => {
    if (!isBrowser) return null;
    
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return token;
    }
    return null;
};

authMiddleware.startListening({
    actionCreator: login,
    effect: (action) => {
      if (!isBrowser) return;
      localStorage.setItem('token', action.payload.token);
      document.cookie = `token=${action.payload.token}; path=/`;
      axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
    },
});

authMiddleware.startListening({
  actionCreator: logout,
  effect: (action, { dispatch }) => {
    if (!isBrowser) return;
    localStorage.removeItem('token');
    localStorage.removeItem('wishlist');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    delete axios.defaults.headers.common['Authorization'];
    
    // Clear wishlist from Redux store
    dispatch(setWishlistItems([]));
  }
}); 
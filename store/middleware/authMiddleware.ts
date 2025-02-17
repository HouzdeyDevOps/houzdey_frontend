import { createListenerMiddleware } from '@reduxjs/toolkit';
import { login, logout } from '../slices/userAuthSlice';
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
      axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
    },
});

authMiddleware.startListening({
  actionCreator: logout,
  effect: () => {
    if (!isBrowser) return;
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
}); 
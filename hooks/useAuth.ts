import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '@/store/slices/userAuthSlice';
import axiosInstance from '@/lib/axios';

export function useAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user data
      axiosInstance.get('/users/me')
        .then(response => {
          dispatch(login({
            user: response.data,
            token
          }));
        })
        .catch(() => {
          localStorage.removeItem('token');
        });
    }
  }, [dispatch]);
} 
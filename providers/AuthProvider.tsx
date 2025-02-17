'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '@/store/slices/userAuthSlice';
import { authApi } from '@/api/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authApi.getCurrentUser()
        .then(user => {
          dispatch(login({
            user,
            token
          }));
        })
        .catch(() => {
          localStorage.removeItem('token');
        });
    }
  }, [dispatch]);

  return <>{children}</>;
} 
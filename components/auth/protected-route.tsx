"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth'; // You'll need to create this hook
import { setCurrentModal } from '@/store/slices/authModalSlice';
import { useDispatch } from 'react-redux';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [token, setToken] = useState<string | null>(null);
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Access localStorage only on client side
    setToken(localStorage.getItem('token'));
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !token) {
      router.push('/');
      dispatch(setCurrentModal("signup"));
    }
  }, [isAuthenticated, isLoading, router, dispatch, token]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : null;
}
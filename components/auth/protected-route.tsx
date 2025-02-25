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
  const { isAuthenticated, isLoading } = useAuth();
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  useEffect(() => {
    // Check if there's a token in localStorage
    const token = localStorage.getItem('token');
    setHasCheckedStorage(true);

    // Only show signup modal if:
    // 1. We're not loading
    // 2. User is not authenticated
    // 3. There's no token in localStorage
    if (!isLoading && !isAuthenticated && !token && hasCheckedStorage) {
      router.push('/');
      dispatch(setCurrentModal("signup"));
    }
  }, [isAuthenticated, isLoading, router, dispatch, hasCheckedStorage]);

  if (isLoading || !hasCheckedStorage) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : null;
}
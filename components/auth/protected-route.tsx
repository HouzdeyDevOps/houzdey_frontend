"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { setCurrentModal } from '@/store/slices/authModalSlice';
import { useDispatch } from 'react-redux';
import ProfilePageSkeleton from '@/components/ui/profile-page-skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, isInitialized } = useAuth();

  useEffect(() => {
    // Wait for the cookie-based /users/me check before deciding the visitor is signed out.
    if (!isInitialized) return;

    if (!isAuthenticated) {
      router.push('/');
      dispatch(setCurrentModal("signup"));
    }
  }, [isAuthenticated, isInitialized, router, dispatch]);

  if (!isInitialized) {
    return <ProfilePageSkeleton />;
  }

  return isAuthenticated ? <>{children}</> : null;
}

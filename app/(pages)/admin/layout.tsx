"use client";

import { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { RootState } from "@/store/store";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, isAuthenticated, isInitialized } = useSelector((state: RootState) => state.userAuth);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !isInitialized) return;

    // Check access after auth state is initialized
    const userHasAccess = isAuthenticated && user && (user.role === "admin" || user.role === "super_admin");
    
    if (!userHasAccess) {
      router.push("/");
    } else {
      setHasAccess(true);
    }
    setIsLoading(false);
  }, [isAuthenticated, user, router, isMounted, isInitialized]);

  // Show loading state while checking authentication (avoid hydration mismatch)
  if (!isMounted || isLoading || !isInitialized) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user doesn't have access (redirect will happen)
  if (!hasAccess) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

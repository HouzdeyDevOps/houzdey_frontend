import { Metadata } from 'next';
import PropertyAnalyticsDashboard from '@/components/analytics/PropertyAnalyticsDashboard';
import Navbar from '@/components/navbar/Navbar';
import ProtectedRoute from '@/components/auth/protected-route';

export const metadata: Metadata = {
  title: 'Property Analytics - Houzdey',
  description: 'View detailed analytics and insights for your properties',
  robots: { index: false, follow: false },
};

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <main className="relative h-screen">
        <Navbar 
          showListingButton={false} 
          showSearch={false} 
          showPropertyTypeFilters={false} 
        />
        <div className="w-full mx-auto mt-24">
          <PropertyAnalyticsDashboard />
        </div>
      </main>
    </ProtectedRoute>
  );
} 
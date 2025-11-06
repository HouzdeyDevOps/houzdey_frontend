import { Metadata } from 'next';
import PropertyAnalyticsDashboard from '@/components/analytics/PropertyAnalyticsDashboard';
import Navbar from '@/components/navbar/Navbar';
import ProtectedRoute from '@/components/auth/protected-route';

export const metadata: Metadata = {
  title: 'Property Analytics - Houzdey',
  description: 'View detailed analytics and insights for your properties',
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
        <div className="max-w-7xl mx-auto px-8 py-8 mt-24">
          <PropertyAnalyticsDashboard />
        </div>
      </main>
    </ProtectedRoute>
  );
} 
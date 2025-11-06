"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Eye, 
  MessageCircle, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Target,
  Lightbulb
} from 'lucide-react';
import { analyticsApi } from '@/api/analytics';
import { OwnerDashboardStats, PropertyAnalytics, AnalyticsTimeframe } from '@/@types/analytics';
import { toast } from 'sonner';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<any>;
  color?: string;
  prefix?: string;
  suffix?: string;
}

const StatCard = ({ title, value, change, icon: Icon, color = 'blue', prefix = '', suffix = '' }: StatCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              <span>{Math.abs(change).toFixed(1)}% vs last period</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

interface ChartProps {
  title: string;
  data: Array<{ date: string; views?: number; inquiries?: number }>;
  type: 'views' | 'inquiries';
}

const SimpleChart = ({ title, data, type }: ChartProps) => {
  const maxValue = Math.max(...data.map(d => d[type] || 0));
  const color = type === 'views' ? '#3B82F6' : '#10B981';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.slice(-14).map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <div className="flex items-center gap-3 flex-1 max-w-xs">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${maxValue > 0 ? ((item[type] || 0) / maxValue) * 100 : 0}%`,
                    backgroundColor: color 
                  }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900 min-w-[2rem]">
                {item[type] || 0}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface PropertyAnalyticsDashboardProps {
  propertyId?: string;
}

export default function PropertyAnalyticsDashboard({ propertyId }: PropertyAnalyticsDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<AnalyticsTimeframe>(AnalyticsTimeframe.MONTH);
  
  // Get owner dashboard stats
  const { data: dashboardStats, isLoading: dashboardLoading, error: dashboardError } = useQuery<OwnerDashboardStats>({
    queryKey: ['owner-dashboard-stats'],
    queryFn: analyticsApi.getOwnerDashboard,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  // Get specific property analytics if propertyId is provided
  const { data: propertyAnalytics, isLoading: propertyLoading } = useQuery({
    queryKey: ['property-analytics', propertyId, selectedTimeframe],
    queryFn: () => propertyId ? analyticsApi.getPropertyAnalytics(propertyId, selectedTimeframe) : null,
    enabled: !!propertyId,
  });

  if (dashboardError) {
    toast.error('Failed to load analytics data');
  }

  if (dashboardLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Property Analytics</h1>
        </div>
        
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Property Analytics</h1>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="w-5 h-5 text-red-600 mr-3">⚠️</div>
            <div>
              <h3 className="text-sm font-medium text-red-800">Unable to Load Analytics</h3>
              <p className="text-sm text-red-700 mt-1">
                There was an issue loading your analytics data. Please try again later.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Analytics</h1>
          <p className="text-gray-600">Track your property performance and insights</p>
        </div>
        
        {propertyId && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Timeframe:</span>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as AnalyticsTimeframe)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={AnalyticsTimeframe.WEEK}>Last Week</option>
              <option value={AnalyticsTimeframe.MONTH}>Last Month</option>
              <option value={AnalyticsTimeframe.QUARTER}>Last Quarter</option>
              <option value={AnalyticsTimeframe.YEAR}>Last Year</option>
            </select>
          </div>
        )}
      </div>

      {dashboardStats && (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Properties"
              value={dashboardStats.total_properties}
              icon={Eye}
              color="blue"
            />
            <StatCard
              title="Total Views"
              value={dashboardStats.total_views}
              change={dashboardStats.views_trend}
              icon={Eye}
              color="green"
            />
            <StatCard
              title="Total Inquiries"
              value={dashboardStats.total_inquiries}
              change={dashboardStats.inquiries_trend}
              icon={MessageCircle}
              color="purple"
            />
            <StatCard
              title="Messages"
              value={dashboardStats.total_messages}
              icon={MessageCircle}
              color="orange"
            />
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Active Properties"
              value={dashboardStats.active_properties}
              icon={Users}
              color="green"
            />
            <StatCard
              title="Avg Views per Property"
              value={dashboardStats.average_views_per_property.toFixed(1)}
              icon={BarChart3}
              color="blue"
            />
            <StatCard
              title="Avg Inquiries per Property"
              value={dashboardStats.average_inquiries_per_property.toFixed(1)}
              icon={Target}
              color="purple"
            />
          </div>

          {/* Best Performing Property */}
          {dashboardStats.best_performing_property && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Best Performing Property</h3>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{dashboardStats.best_performing_property.title}</h4>
                  <p className="text-sm text-gray-600">{dashboardStats.best_performing_property.views} views</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">
                    ₦{dashboardStats.best_performing_property.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Views */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Views</h3>
              <div className="space-y-3">
                {dashboardStats.recent_views.length > 0 ? (
                  dashboardStats.recent_views.slice(0, 5).map((view, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{view.property_title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(view.viewed_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Eye className="w-4 h-4 text-gray-400" />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent views</p>
                )}
              </div>
            </div>

            {/* Recent Inquiries */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Inquiries</h3>
              <div className="space-y-3">
                {dashboardStats.recent_inquiries.length > 0 ? (
                  dashboardStats.recent_inquiries.slice(0, 5).map((inquiry, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{inquiry.property_title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(inquiry.created_at).toLocaleDateString()} • {inquiry.inquiry_type}
                        </p>
                      </div>
                      <MessageCircle className="w-4 h-4 text-gray-400" />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent inquiries</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Property-specific analytics */}
      {propertyAnalytics && !propertyLoading && (
        <>
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Analytics for "{propertyAnalytics.property_title}"
            </h2>
            
            {/* Property-specific stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatCard
                title="Total Views"
                value={propertyAnalytics.total_views}
                icon={Eye}
                color="blue"
              />
              <StatCard
                title="Unique Views"
                value={propertyAnalytics.unique_views}
                icon={Users}
                color="green"
              />
              <StatCard
                title="Inquiries"
                value={propertyAnalytics.total_inquiries}
                icon={MessageCircle}
                color="purple"
              />
              <StatCard
                title="Conversion Rate"
                value={propertyAnalytics.conversion_rate.toFixed(1)}
                suffix="%"
                icon={Target}
                color="orange"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <SimpleChart
                title="Daily Views"
                data={propertyAnalytics.daily_views}
                type="views"
              />
              <SimpleChart
                title="Daily Inquiries"
                data={propertyAnalytics.daily_inquiries}
                type="inquiries"
              />
            </div>

            {/* Recommendations */}
            {propertyAnalytics.recommendations.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start">
                  <Lightbulb className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800 mb-2">Recommendations</h3>
                    <ul className="space-y-1">
                      {propertyAnalytics.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-blue-700">• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
} 
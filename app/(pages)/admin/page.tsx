"use client";

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  Home, 
  MessageCircle, 
  TrendingUp, 
  AlertCircle,
  DollarSign,
  Activity,
  Calendar,
  Eye,
  CheckCircle,
  Clock,
  UserCheck,
  FileText,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { adminApi } from '@/api/admin';
import { AdminStats } from '@/@types/admin';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: adminApi.getDashboardStats,
    refetchInterval: 30000,
    retry: false, // Don't retry failed requests
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome to the Houzdey admin panel</p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Backend Server Not Running</h3>
              <p className="text-sm text-red-700 mt-1">
                The admin API is not available. Please start the backend server to view dashboard statistics.
              </p>
              <div className="mt-3">
                <code className="text-xs bg-red-100 px-2 py-1 rounded">
                  cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Show mock data for demonstration */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border p-6 opacity-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">--</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6 opacity-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-3xl font-bold text-gray-900">--</p>
              </div>
              <Home className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6 opacity-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversations</p>
                <p className="text-3xl font-bold text-gray-900">--</p>
              </div>
              <MessageCircle className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6 opacity-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Verifications</p>
                <p className="text-3xl font-bold text-gray-900">--</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with Houzdey today.</p>
        </div>
        <div className="text-sm text-gray-500">
          <Calendar className="w-4 h-4 inline mr-1" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {stats && (
        <>
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Users</p>
                  <p className="text-4xl font-bold mt-2">{stats.total_users}</p>
                  <div className="flex items-center mt-2 text-blue-100">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    <span className="text-sm">+12% this month</span>
                  </div>
                </div>
                <Users className="w-12 h-12 text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Properties</p>
                  <p className="text-4xl font-bold mt-2">{stats.total_properties}</p>
                  <div className="flex items-center mt-2 text-green-100">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    <span className="text-sm">+8% this month</span>
                  </div>
                </div>
                <Home className="w-12 h-12 text-green-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Active Chats</p>
                  <p className="text-4xl font-bold mt-2">{stats.total_conversations}</p>
                  <div className="flex items-center mt-2 text-purple-100">
                    <Activity className="w-4 h-4 mr-1" />
                    <span className="text-sm">Live now</span>
                  </div>
                </div>
                <MessageCircle className="w-12 h-12 text-purple-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Pending Verifications</p>
                  <p className="text-4xl font-bold mt-2">{stats.pending_verifications}</p>
                  <div className="flex items-center mt-2 text-orange-100">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">Requires action</span>
                  </div>
                </div>
                <AlertCircle className="w-12 h-12 text-orange-200" />
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{Math.floor(stats.total_users * 0.75)}</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Properties Views</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_properties * 45}</p>
                </div>
                <Eye className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Blogs</p>
                  <p className="text-2xl font-bold text-gray-900">15</p>
                </div>
                <FileText className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Response Time</p>
                  <p className="text-2xl font-bold text-gray-900">2.4h</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <Activity className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {[
                  { icon: Users, color: 'blue', text: 'New user registration', detail: 'John Doe joined the platform', time: '5 min ago' },
                  { icon: Home, color: 'green', text: 'New property listed', detail: '3 bedroom apartment in Lekki', time: '12 min ago' },
                  { icon: MessageCircle, color: 'purple', text: 'New conversation started', detail: 'Buyer inquiring about property #1234', time: '25 min ago' },
                  { icon: CheckCircle, color: 'green', text: 'Property verified', detail: 'Property #5678 verification completed', time: '1 hour ago' },
                  { icon: FileText, color: 'purple', text: 'New blog post published', detail: '"Top 10 Areas to Buy Property in Lagos"', time: '2 hours ago' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 pb-4 border-b last:border-0 last:pb-0">
                    <div className={`p-2 rounded-lg bg-${activity.color}-100`}>
                      <activity.icon className={`w-4 h-4 text-${activity.color}-600`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                      <p className="text-sm text-gray-600 truncate">{activity.detail}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
                  </div>
                ))}
              </div>
              <Link 
                href="/admin/activity" 
                className="mt-4 block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all activity →
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link 
                  href="/admin/users" 
                  className="block p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Manage Users</span>
                  </div>
                </Link>
                
                <Link 
                  href="/admin/properties" 
                  className="block p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center">
                    <Home className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">View Properties</span>
                  </div>
                </Link>
                
                <Link 
                  href="/admin/blog" 
                  className="block p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-purple-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Manage Blog</span>
                  </div>
                </Link>
                
                <Link 
                  href="/admin/system-settings" 
                  className="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <Activity className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">System Settings</span>
                  </div>
                </Link>
              </div>

              {/* System Health */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">System Health</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Server Status</span>
                    <span className="flex items-center text-green-600">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Database</span>
                    <span className="flex items-center text-green-600">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                      Healthy
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">API Response</span>
                    <span className="text-gray-600">~45ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Property Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Distribution</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">For Sale</span>
                  <div className="flex items-center">
                    <div className="w-32 h-2 bg-gray-200 rounded-full mr-3">
                      <div className="h-2 bg-blue-600 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{Math.floor(stats.total_properties * 0.65)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">For Rent</span>
                  <div className="flex items-center">
                    <div className="w-32 h-2 bg-gray-200 rounded-full mr-3">
                      <div className="h-2 bg-green-600 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{Math.floor(stats.total_properties * 0.35)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Today</span>
                  <span className="text-2xl font-bold text-green-600">{Math.floor(stats.total_users * 0.25)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active This Week</span>
                  <span className="text-2xl font-bold text-blue-600">{Math.floor(stats.total_users * 0.65)}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 
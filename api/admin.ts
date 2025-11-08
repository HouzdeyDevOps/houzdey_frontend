import axios from '@/lib/axios';
import {
  AdminStats,
  AdminUser,
  AdminProperty,
  SystemSettings,
  AdminAction,
  UserUpdateRequest,
  BulkUserAction,
  AdminFilters
} from '@/@types/admin';

export const adminApi = {
  // Dashboard
  getDashboardStats: async (): Promise<AdminStats> => {
    const response = await axios.get('/admin/dashboard/stats');
    return response.data;
  },

  // User Management
  getUsers: async (filters: AdminFilters = {}): Promise<AdminUser[]> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await axios.get(`/admin/users?${params.toString()}`);
    return response.data;
  },

  getUserDetails: async (userId: string): Promise<AdminUser> => {
    const response = await axios.get(`/admin/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId: string, userData: UserUpdateRequest): Promise<{ message: string }> => {
    const response = await axios.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  suspendUser: async (userId: string, reason: string): Promise<{ message: string }> => {
    const response = await axios.post(`/admin/users/${userId}/suspend`, { reason });
    return response.data;
  },

  activateUser: async (userId: string): Promise<{ message: string }> => {
    const response = await axios.post(`/admin/users/${userId}/activate`);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<{ message: string }> => {
    const response = await axios.delete(`/admin/users/${userId}`);
    return response.data;
  },

  bulkUserAction: async (action: BulkUserAction): Promise<{ message: string }> => {
    const response = await axios.post('/admin/users/bulk-action', action);
    return response.data;
  },

  // Property Management
  getProperties: async (filters: AdminFilters = {}): Promise<AdminProperty[]> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await axios.get(`/admin/properties?${params.toString()}`);
    return response.data;
  },

  updatePropertyStatus: async (propertyId: string, status: string): Promise<{ message: string }> => {
    const response = await axios.put(`/admin/properties/${propertyId}/status`, { status });
    return response.data;
  },

  deleteProperty: async (propertyId: string): Promise<{ message: string }> => {
    const response = await axios.delete(`/admin/properties/${propertyId}`);
    return response.data;
  },

  // System Settings
  getSystemSettings: async (): Promise<SystemSettings> => {
    const response = await axios.get('/admin/settings');
    return response.data;
  },

  updateSystemSettings: async (settings: SystemSettings): Promise<{ message: string }> => {
    const response = await axios.put('/admin/settings', settings);
    return response.data;
  },

  // Admin Actions Log
  getAdminActions: async (filters: AdminFilters = {}): Promise<AdminAction[]> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await axios.get(`/admin/actions?${params.toString()}`);
    return response.data;
  },

  // Health Check
  healthCheck: async (): Promise<{ status: string; admin: string }> => {
    const response = await axios.get('/admin/health');
    return response.data;
  },
}; 
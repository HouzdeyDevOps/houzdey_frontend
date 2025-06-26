import axios from '@/lib/axios';
import {
  NotificationPreference,
  Notification,
  NotificationTemplate,
  NotificationAnalytics,
  NotificationFilters
} from '@/@types/notifications';

export const notificationsApi = {
  // User notification preferences
  getPreferences: async (): Promise<NotificationPreference> => {
    const response = await axios.get('/api/v1/notifications/preferences');
    return response.data;
  },

  updatePreferences: async (preferences: NotificationPreference): Promise<{ message: string }> => {
    const response = await axios.put('/api/v1/notifications/preferences', preferences);
    return response.data;
  },

  // User notifications
  getMyNotifications: async (filters: NotificationFilters = {}): Promise<{
    notifications: Notification[];
    pagination: {
      current_page: number;
      total_count: number;
      has_next: boolean;
      has_prev: boolean;
    };
  }> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await axios.get(`/api/v1/notifications/my-notifications?${params.toString()}`);
    return response.data;
  },

  markAsRead: async (notificationId: string): Promise<{ message: string }> => {
    const response = await axios.post(`/api/v1/notifications/mark-read/${notificationId}`);
    return response.data;
  },

  markAllAsRead: async (): Promise<{ message: string }> => {
    const response = await axios.post('/api/v1/notifications/mark-all-read');
    return response.data;
  },

  getUnreadCount: async (): Promise<{ unread_count: number }> => {
    const response = await axios.get('/api/v1/notifications/unread-count');
    return response.data;
  },

  // Admin notification management
  getTemplates: async (filters: NotificationFilters = {}): Promise<NotificationTemplate[]> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await axios.get(`/api/v1/notifications/templates?${params.toString()}`);
    return response.data;
  },

  createTemplate: async (template: NotificationTemplate): Promise<{ message: string; template_id: string }> => {
    const response = await axios.post('/api/v1/notifications/templates', template);
    return response.data;
  },

  updateTemplate: async (templateId: string, template: NotificationTemplate): Promise<{ message: string }> => {
    const response = await axios.put(`/api/v1/notifications/templates/${templateId}`, template);
    return response.data;
  },

  deleteTemplate: async (templateId: string): Promise<{ message: string }> => {
    const response = await axios.delete(`/api/v1/notifications/templates/${templateId}`);
    return response.data;
  },

  // Send notifications
  sendNotification: async (data: {
    user_id: string;
    event: string;
    context_data?: { [key: string]: any };
    priority?: number;
    scheduled_for?: string;
  }): Promise<{ message: string; notification_id: string }> => {
    const response = await axios.post('/api/v1/notifications/send', data);
    return response.data;
  },

  broadcastNotification: async (data: {
    event: string;
    context_data?: { [key: string]: any };
    user_filters?: { [key: string]: any };
    priority?: number;
    scheduled_for?: string;
  }): Promise<{
    message: string;
    total_recipients: number;
    sent_count: number;
  }> => {
    const response = await axios.post('/api/v1/notifications/broadcast', data);
    return response.data;
  },

  // Analytics
  getAnalytics: async (filters: {
    start_date?: string;
    end_date?: string;
    event?: string;
    type?: string;
  } = {}): Promise<NotificationAnalytics> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await axios.get(`/api/v1/notifications/analytics?${params.toString()}`);
    return response.data;
  },
}; 
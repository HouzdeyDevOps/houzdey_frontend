export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app'
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  BOUNCED = 'bounced'
}

export enum NotificationCategory {
  PROPERTY = 'property',
  USER = 'user',
  SECURITY = 'security',
  MARKETING = 'marketing',
  SYSTEM = 'system'
}

export enum NotificationEvent {
  // Property events
  PROPERTY_VIEWED = 'property_viewed',
  PROPERTY_INQUIRY = 'property_inquiry',
  PROPERTY_APPROVED = 'property_approved',
  PROPERTY_REJECTED = 'property_rejected',
  PROPERTY_EXPIRED = 'property_expired',
  PROPERTY_UPDATED = 'property_updated',
  
  // User events
  USER_REGISTERED = 'user_registered',
  USER_VERIFIED = 'user_verified',
  USER_LOGIN = 'user_login',
  PASSWORD_RESET = 'password_reset',
  PROFILE_UPDATED = 'profile_updated',
  
  // Security events
  SUSPICIOUS_LOGIN = 'suspicious_login',
  ACCOUNT_LOCKED = 'account_locked',
  
  // Marketing events
  NEWSLETTER = 'newsletter',
  PROMOTIONAL = 'promotional',
  MARKET_UPDATE = 'market_update',
  
  // System events
  MAINTENANCE = 'maintenance',
  SYSTEM_UPDATE = 'system_update'
}

export interface NotificationPreference {
  id?: string;
  user_id: string;
  
  // Channel preferences
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
  
  // Category preferences
  property_notifications: boolean;
  security_notifications: boolean;
  marketing_notifications: boolean;
  system_notifications: boolean;
  
  // Frequency settings
  instant_notifications: boolean;
  daily_digest: boolean;
  weekly_digest: boolean;
  
  // Contact info
  phone_number?: string;
  preferred_time_start: string;
  preferred_time_end: string;
  timezone: string;
  
  created_at?: string;
  updated_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  template_id?: string;
  
  // Notification details
  event: NotificationEvent;
  category: NotificationCategory;
  type: NotificationType;
  
  // Content
  subject: string;
  body: string;
  html_body?: string;
  
  // Delivery info
  recipient_email?: string;
  recipient_phone?: string;
  recipient_device_token?: string;
  
  // Status tracking
  status: NotificationStatus;
  sent_at?: string;
  delivered_at?: string;
  opened_at?: string;
  clicked_at?: string;
  
  // Error handling
  error_message?: string;
  retry_count: number;
  max_retries: number;
  
  // Priority and scheduling
  priority: number;
  scheduled_for?: string;
  
  // Metadata
  context_data: { [key: string]: any };
  tracking_id?: string;
  
  created_at: string;
  updated_at: string;
}

export interface NotificationTemplate {
  id?: string;
  name: string;
  event: NotificationEvent;
  category: NotificationCategory;
  type: NotificationType;
  
  // Template content
  subject: string;
  body: string;
  html_body?: string;
  
  // Template variables
  variables: string[];
  
  // Configuration
  is_active: boolean;
  priority: number;
  
  // Scheduling
  send_immediately: boolean;
  delay_minutes: number;
  
  // Personalization
  personalized: boolean;
  
  created_at?: string;
  updated_at?: string;
}

export interface NotificationAnalytics {
  period: {
    start: string;
    end: string;
  };
  summary: {
    total_sent: number;
    total_delivered: number;
    total_failed: number;
    total_opened: number;
    delivery_rate: number;
    open_rate: number;
  };
  daily_stats: Array<{
    date: string;
    sent: number;
  }>;
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  event?: string;
  start_date?: string;
  end_date?: string;
} 
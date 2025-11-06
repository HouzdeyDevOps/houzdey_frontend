export interface AdminStats {
  total_users: number;
  total_properties: number;
  total_conversations: number;
  active_users: number;
  pending_verifications: number;
  total_revenue: number;
  properties_by_type: { [key: string]: number };
  users_by_status: { [key: string]: number };
  monthly_signups: Array<{
    month: string;
    count: number;
  }>;
  recent_activities: Array<{
    admin_name: string;
    action: string;
    time: string;
  }>;
}

export interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  status: 'pending' | 'verified' | 'suspended';
  role: 'user' | 'admin' | 'super_admin';
  is_active: boolean;
  plan: string;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
  properties_count?: number;
  conversations_count?: number;
}

export interface AdminProperty {
  id: string;
  title: string;
  type: string;
  price: number;
  rental_price?: number;
  sale_price?: number;
  listing_type: 'rent' | 'sale';
  status: string;
  address: string;
  state: string;
  lga: string;
  images: string[];
  created_at: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
}

export interface SystemSettings {
  id?: string;
  site_name: string;
  site_description: string;
  contact_email: string;
  support_phone: string;
  maintenance_mode: boolean;
  allow_new_registrations: boolean;
  email_verification_required: boolean;
  phone_verification_required: boolean;
  max_properties_per_user: number;
  max_images_per_property: number;
  max_file_size: number;
  allowed_file_types: string[];
  created_at?: string;
  updated_at?: string;
}

export interface AdminAction {
  id: string;
  admin_id: string;
  admin_name?: string;
  admin_email?: string;
  action_type: string;
  target_type: string;
  target_id?: string;
  description: string;
  metadata?: { [key: string]: any };
  created_at: string;
}

export interface UserUpdateRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  status?: string;
  role?: string;
  is_active?: boolean;
  plan?: string;
}

export interface BulkUserAction {
  user_ids: string[];
  action: 'suspend' | 'activate' | 'delete' | 'change_role';
  value?: string;
}

export interface AdminReport {
  id: string;
  report_type: string;
  reported_by: string;
  reported_content_type: string;
  reported_content_id: string;
  reason: string;
  description?: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  admin_notes?: string;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_count: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface AdminFilters {
  search?: string;
  status?: string;
  role?: string;
  listing_type?: string;
  page?: number;
  limit?: number;
} 
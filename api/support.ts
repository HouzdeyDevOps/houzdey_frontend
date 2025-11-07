import { axiosInstance as axios } from './axios-config';

export interface SupportTicketCreate {
  subject: string;
  category: 'technical' | 'billing' | 'account' | 'listing' | 'other';
  description: string;
  attachments?: string[];
}

export interface SupportTicket {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  subject: string;
  category: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: string[];
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface FeedbackCreate {
  rating: number;
  comment: string;
  page_url?: string;
  category?: string;
}

export interface Feedback {
  id: string;
  user_id?: string;
  user_email?: string;
  user_name?: string;
  rating: number;
  comment: string;
  page_url?: string;
  category?: string;
  created_at: string;
}

export interface TicketResponse {
  id: string;
  ticket_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  is_admin: boolean;
  message: string;
  attachments?: string[];
  created_at: string;
}

export interface TicketResponseCreate {
  message: string;
  attachments?: string[];
}

// Support Tickets
export const createSupportTicket = async (ticketData: SupportTicketCreate) => {
  const response = await axios.post('/support/tickets', ticketData);
  return response.data;
};

export const getUserTickets = async (status?: string) => {
  const response = await axios.get<SupportTicket[]>('/support/tickets', {
    params: status ? { ticket_status: status } : undefined,
  });
  return response.data;
};

export const getTicket = async (ticketId: string) => {
  const response = await axios.get<SupportTicket>(`/support/tickets/${ticketId}`);
  return response.data;
};

export const updateTicket = async (ticketId: string, updateData: Partial<SupportTicket>) => {
  const response = await axios.patch(`/support/tickets/${ticketId}`, updateData);
  return response.data;
};

export const addTicketResponse = async (ticketId: string, responseData: TicketResponseCreate) => {
  const response = await axios.post(`/support/tickets/${ticketId}/responses`, responseData);
  return response.data;
};

export const getTicketResponses = async (ticketId: string) => {
  const response = await axios.get<TicketResponse[]>(`/support/tickets/${ticketId}/responses`);
  return response.data;
};

// Feedback
export const submitFeedback = async (feedbackData: FeedbackCreate) => {
  const response = await axios.post('/support/feedback', feedbackData);
  return response.data;
};

export const getUserFeedback = async () => {
  const response = await axios.get<Feedback[]>('/support/feedback');
  return response.data;
};

// Admin endpoints
export const getAllTickets = async (params?: {
  ticket_status?: string;
  priority?: string;
  skip?: number;
  limit?: number;
}) => {
  const response = await axios.get<SupportTicket[]>('/support/admin/tickets', { params });
  return response.data;
};

export const getAllFeedback = async (params?: { skip?: number; limit?: number }) => {
  const response = await axios.get<Feedback[]>('/support/admin/feedback', { params });
  return response.data;
};

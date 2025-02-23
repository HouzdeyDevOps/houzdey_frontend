export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  // receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
  pending?: boolean;
}

export interface Conversation {
  id: string;
  property_id: string;
  user_id: string;
  owner_id: string;
  created_at: string;
  last_message?: string;
  last_message_time?: string;
  property?: {
    id: string;
    title: string;
    image?: string;
    price: number;
    location: string;
  };
  other_user?: {
    id: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
  };
  unread_count: number;
}

export interface TypingStatus {
  conversation_id: string;
  user_id: string;
  is_typing: boolean;
}

export interface UserStatus {
  user_id: string;
  status: 'online' | 'offline';
  last_seen: string;
}

export interface ChatState {
  activeConversation: string | null;
  conversations: Conversation[];
  messages: { [key: string]: Message[] };
  typingUsers: { [key: string]: boolean };
  userStatuses: { [key: string]: UserStatus };
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
}

export interface ChatError {
  message: string;
  code?: string;
  details?: any;
}

export interface ChatService {
  initializeConnection: (token: string) => Promise<void>;
  disconnect: () => void;
  joinConversation: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  onError: (handler: (error: ChatError) => void) => void;
  onMessageError: (handler: (error: ChatError) => void) => void;
  setTypingStatus: (conversationId: string, isTyping: boolean) => void;
  onTypingStatus: (handler: (status: TypingStatus) => void) => () => void;
  onMessage: (handler: (message: Message) => void) => () => void;
  onConnection: (handler: (connected: boolean) => void) => () => void;
  onNotification: (handler: (message: Message) => void) => () => void;
  onUserStatus: (handler: (status: UserStatus) => void) => () => void;
  isSocketConnected: () => boolean;
} 
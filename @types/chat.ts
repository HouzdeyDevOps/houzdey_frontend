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
  property: {
    id: string;
    title: string;
    image?: string;
    price: number;
    location: string;
  };
  other_user: {
    id: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
  };
  user_id: string;
  owner_id: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
  created_at: string;
}

export interface TypingStatus {
  conversation_id: string;
  user_id: string;
  is_typing: boolean;
}

export interface ChatState {
  activeConversation: string | null;
  conversations: Conversation[];
  messages: { [conversationId: string]: Message[] };
  typingUsers: { [conversationId: string]: string[] };
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
  isSocketConnected: () => boolean;
} 
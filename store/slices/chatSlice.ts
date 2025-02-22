import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message, Conversation, ChatState } from '@/@types/chat';

const initialState: ChatState = {
  activeConversation: null,
  conversations: [],
  messages: {},
  typingUsers: {},
  isLoading: false,
  error: null,
  isConnected: false
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string>) => {
      state.activeConversation = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const { conversation_id } = action.payload;
      if (!state.messages[conversation_id]) {
        state.messages[conversation_id] = [];
      }
      state.messages[conversation_id].push(action.payload);
    },
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    setMessages: (state, action: PayloadAction<{ conversationId: string, messages: Message[] }>) => {
      const { conversationId, messages } = action.payload;
      state.messages[conversationId] = messages;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    }
  }
});

export const { 
  setActiveConversation, 
  addMessage, 
  setConversations, 
  setMessages,
  setLoading,
  setError,
  setConnected
} = chatSlice.actions;

export default chatSlice; 
import { useEffect, useCallback } from 'react';
import { Message, TypingStatus } from '@/@types/chat';
import { chatService } from '@/api/chat';
import { useAuth } from '@/hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, setConversations, setMessages, setConnected, setError } from '@/store/slices/chatSlice';
import { RootState } from '@/store/store';

export function useChat(conversationId?: string) {
  const dispatch = useDispatch();
  const { messages, conversations, isLoading, error, isConnected } = useSelector((state: RootState) => state.chat);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const token = localStorage.getItem('token');
    if (token) {
      chatService.initializeConnection(token);
    }

    const unsubscribeConnection = chatService.onConnection((status) => {
      dispatch(setConnected(status));
    });

    const unsubscribeMessage = chatService.onMessage((message) => {
      if (message.conversation_id === conversationId) {
        dispatch(addMessage(message));
      }
    });

    const unsubscribeTyping = chatService.onTypingStatus((status: TypingStatus) => {
      if (status.conversation_id === conversationId) {
        // Handle typing status in Redux if needed
      }
    });

    return () => {
      unsubscribeConnection();
      unsubscribeMessage();
      unsubscribeTyping();
      chatService.disconnect();
    };
  }, [user?.id, conversationId, dispatch]);

  const sendMessage = useCallback(async (content: string) => {
    if (!conversationId || !isConnected) {
      return;
    }

    try {
      await chatService.sendMessage(conversationId, content);
    } catch (err) {
      console.error('Failed to send message:', err);
      dispatch(setError('Failed to send message'));
    }
  }, [conversationId, isConnected, dispatch]);

  const setTyping = useCallback((isTyping: boolean) => {
    if (!conversationId || !isConnected) {
      return;
    }

    chatService.setTypingStatus(conversationId, isTyping);
  }, [conversationId, isConnected]);

  return {
    messages: conversationId ? (messages[conversationId] || []) : [],
    conversations,
    isLoading,
    error,
    isConnected,
    sendMessage,
    setTyping
  };
} 
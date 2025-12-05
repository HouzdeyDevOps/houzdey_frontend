import { useState, useEffect, useCallback } from 'react';
import { chatService } from '@/api/chat';
import type { UserStatus, Message } from '@/@types/chat';

interface UseChatConnectionProps {
  conversationId: string | null;
  userId?: string;
  otherUserId?: string;
  onMessage: (message: Message) => void;
  onTyping: (isTyping: boolean) => void;
  onUserStatus?: (status: UserStatus) => void;
  onReadStatus?: (conversationId: string) => void;
}

export function useChatConnection({
  conversationId,
  userId,
  otherUserId,
  onMessage,
  onTyping,
  onUserStatus,
  onReadStatus
}: UseChatConnectionProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const initializeChat = useCallback(async () => {
    if (!userId || !conversationId) return;

    // Prevent multiple simultaneous initializations
    if (isLoading) return;

    setIsLoading(true);

    try {
      await chatService.initializeConnection(
        localStorage.getItem("token") || ""
      );

      setIsConnected(chatService.isSocketConnected());

      const unsubscribeConnection = chatService.onConnection((connected) => {
        setIsConnected(connected);
        if (connected && otherUserId) {
          chatService.getUserStatus(otherUserId);
        }
      });

      await chatService.joinConversation(conversationId);

      const unsubscribeMessage = chatService.onMessage((message: Message) => {
        if (message.sender_id === otherUserId && onUserStatus) {
          onUserStatus({
            user_id: otherUserId,
            status: "online",
            last_seen: new Date().toISOString(),
          });
        }
        onMessage(message);
      });

      const unsubscribeTyping = chatService.onTyping((status) => {
        if (
          status.user_id !== userId &&
          status.conversation_id === conversationId
        ) {
          onTyping(status.is_typing);
          if (status.is_typing && onUserStatus && otherUserId) {
            onUserStatus({
              user_id: otherUserId,
              status: "online",
              last_seen: new Date().toISOString(),
            });
          }
        }
      });

      const unsubscribeError = chatService.onError((error) => {
        console.error("Socket error:", error);
        setError(error.message);
        setTimeout(() => setError(null), 5000);
      });

      const unsubscribeReadStatus = onReadStatus 
        ? chatService.onReadStatus(onReadStatus)
        : () => {};

      return () => {
        unsubscribeConnection();
        unsubscribeMessage();
        unsubscribeTyping();
        unsubscribeError();
        unsubscribeReadStatus();
      };
    } catch (err) {
      console.error("Failed to initialize chat:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to connect to chat service. Please try refreshing."
      );
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, userId, otherUserId, onMessage, onTyping, onUserStatus, onReadStatus]);

  return {
    isConnected,
    error,
    isLoading,
    initializeChat,
    setError
  };
}

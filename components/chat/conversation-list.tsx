"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { chatApi, chatService } from "@/api/chat";
import { formatDistanceToNow } from "date-fns";
import { Message, Conversation } from "@/@types/chat";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMessageTime } from "@/utils/date";
import { useAuth } from "@/hooks/useAuth";
import { Check, CheckCheck } from 'lucide-react';
import { getOptimizedImageUrl } from "@/utils/imageUtils";

interface ConversationListProps {
  onConversationSelect: (conversationId: string) => void;
  selectedConversationId?: string;
}

function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  );
}

const formatMessagePreview = (message: string): string => {
  try {
    const parsedContent = JSON.parse(message);
    if (parsedContent.type === 'image') {
      return '📷 Image';
    } else if (parsedContent.type === 'voice') {
      return '🎤 Voice message';
    }
    return message;
  } catch (e) {
    return message;
  }
};

export default function ConversationList({
  onConversationSelect,
  selectedConversationId,
}: ConversationListProps) {
  const [conversations, setConversations] = useState<(Conversation & { 
    lastMessageRead?: boolean;
    last_sender_id?: string;
  })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await chatApi.getConversations();
        setConversations(data.map(conv => ({
          ...conv,
          lastMessageRead: false, // Initial state, will be updated when receiving messages
          last_sender_id: undefined // Will be set when receiving messages
        })));
      } catch (error) {
        console.error("Failed to load conversations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();

    // Listen for new messages to update conversation list
    const unsubscribeMessage = chatService.onMessage((message: Message) => {
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === message.conversation_id
            ? {
                ...conv,
                last_message: message.content,
                last_message_time: message.created_at,
                lastMessageRead: message.read,
                last_sender_id: message.sender_id,
                unread_count: message.sender_id !== user?.id ? conv.unread_count + 1 : conv.unread_count,
              }
            : conv
        )
      );
    });

    // Listen for read status updates
    const handleReadStatus = (conversationId: string) => {
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                unread_count: 0,
                lastMessageRead: true
              }
            : conv
        )
      );
    };

    // Subscribe to read status updates
    chatService.onReadStatus(handleReadStatus);

    return () => {
      unsubscribeMessage();
      chatService.offReadStatus(handleReadStatus);
    };
  }, [user?.id]);

  // Update unread count when conversation is selected
  useEffect(() => {
    if (selectedConversationId) {
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === selectedConversationId
            ? {
                ...conv,
                unread_count: 0,
                lastMessageRead: true
              }
            : conv
        )
      );
    }
  }, [selectedConversationId]);

  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto">
        {[1, 2, 3, 4, 5].map((i) => (
          <ConversationSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer ${
            selectedConversationId === conversation.id ? "bg-gray-200" : ""
          }`}
          onClick={() => onConversationSelect(conversation.id)}
        >
          <div className="w-10 h-10 flex-shrink-0 relative">
            <Image
              src={
                getOptimizedImageUrl(
                  conversation.other_user?.profile_picture,
                  { width: 40, height: 40, defaultImage: "avatar-placeholder" }
                )
              }
              alt={`${conversation.other_user?.first_name} ${conversation.other_user?.last_name}`}
              width={40}
              height={40}
              className="object-cover rounded-full"
              style={{
                width: '40px',
                height: '40px'
              }}
            />
            {/* Property indicator - small colored dot */}
            <div 
              className="absolute bottom-0 left-0 w-4 h-4 rounded-full border-2 border-white"
              style={{ 
                backgroundColor: `hsl(${(conversation.property_id.charCodeAt(0) * 137.508) % 360}, 70%, 60%)` 
              }}
              title={`Property: ${conversation.property?.title || conversation.property_id}`}
            />
            {conversation.unread_count > 0 && (
              <div className="absolute -top-1 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {conversation.unread_count}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <span className={`font-medium truncate ${conversation.unread_count > 0 ? 'text-indigo-600' : ''}`}>
                {`${conversation.other_user?.first_name} ${conversation.other_user?.last_name}`}
              </span>
              {conversation.last_message_time && (
                <span className={`text-sm ${conversation.unread_count > 0 ? 'text-indigo-600' : 'text-gray-500'} flex-shrink-0 ml-2`}>
                  {formatMessageTime(conversation.last_message_time)}
                </span>
              )}
            </div>
            {/* Property information - show what property this conversation is about */}
            <div className="text-xs text-gray-400 mb-1 truncate">
              {conversation.property?.title || `Property #${conversation.property_id}`}
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`text-sm truncate ${
                  conversation.unread_count > 0
                    ? "text-indigo-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                {conversation.last_message ? formatMessagePreview(conversation.last_message) : "No messages yet"}
              </span>
              {conversation.last_message && (
                <>
                  {/* Show read indicators only if the last message was sent by current user */}
                  {conversation.last_sender_id === user?.id && (
                    <span className="flex-shrink-0 text-gray-400">
                      {conversation.lastMessageRead ? (
                        <CheckCheck className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

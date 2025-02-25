"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { chatApi, chatService } from "@/api/chat";
import { formatDistanceToNow } from "date-fns";
import { Message, Conversation } from "@/@types/chat";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMessageTime } from "@/utils/date";

interface ConversationListProps {
  onConversationSelect: (conversationId: string) => void;
  selectedConversationId?: string;
}

function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4">
      <Skeleton className="w-12 h-12 rounded-full" />
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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await chatApi.getConversations();
        setConversations(data);
      } catch (error) {
        console.error("Failed to load conversations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();

    // Listen for new messages to update conversation list
    const unsubscribe = chatService.onMessage((message: Message) => {
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === message.conversation_id
            ? {
                ...conv,
                last_message: message.content,
                last_message_time: message.created_at,
                unread_count: conv.unread_count + 1,
              }
            : conv
        )
      );
    });

    return () => unsubscribe();
  }, []);

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
            selectedConversationId === conversation.id ? "bg-gray-50" : ""
          }`}
          onClick={() => onConversationSelect(conversation.id)}
        >
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={
                conversation.other_user?.profile_picture ||
                "/assets/images/avatar-placeholder.jpg"
              }
              alt={`${conversation.other_user?.first_name} ${conversation.other_user?.last_name}`}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium truncate">
                {`${conversation.other_user?.first_name} ${conversation.other_user?.last_name}`}
              </span>
              {conversation.last_message_time && (
                <span className="text-sm text-gray-500 flex-shrink-0 ml-2">
                  {formatMessageTime(conversation.last_message_time)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 min-w-0">
              {conversation.unread_count > 0 && (
                <span className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0"></span>
              )}
              <span
                className={`text-sm truncate ${
                  conversation.unread_count > 0
                    ? "text-indigo-600"
                    : "text-gray-500"
                }`}
              >
                {conversation.last_message ? formatMessagePreview(conversation.last_message) : "No messages yet"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

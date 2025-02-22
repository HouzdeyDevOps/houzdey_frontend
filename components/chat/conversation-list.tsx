"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { chatApi, chatService } from "@/api/chat";
import { formatDistanceToNow } from "date-fns";
import { Message } from "@/@types/chat";
import { Skeleton } from "@/components/ui/skeleton";

interface Conversation {
  id: string;
  property_id: string;
  user_id: string;
  owner_id: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
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

export default function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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

  const handleConversationClick = (conversationId: string) => {
    router.push(`/chat/${conversationId}`);
  };

  if (isLoading) {
    return (
      <div className="overflow-y-auto h-[calc(100vh-73px)]">
        {[1, 2, 3, 4, 5].map((i) => (
          <ConversationSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-[calc(100vh-73px)]">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => handleConversationClick(conversation.id)}
        >
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <Image
              src="/assets/images/avatar-placeholder.jpg"
              alt="User Avatar"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">
                {conversation.user_id === "CURRENT_USER_ID"
                  ? "Property Owner"
                  : "Interested Buyer"}
              </span>
              {conversation.last_message_time && (
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(conversation.last_message_time), {
                    addSuffix: true,
                  })}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {conversation.unread_count > 0 && (
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
              )}
              <span
                className={`text-sm ${
                  conversation.unread_count > 0
                    ? "text-indigo-600"
                    : "text-gray-500"
                }`}
              >
                {conversation.last_message || "No messages yet"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 
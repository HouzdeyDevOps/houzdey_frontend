"use client";

import { useState } from "react";
import ConversationList from "@/components/chat/conversation-list";
import ChatWindow from "@/components/chat/chat-window";

export default function ChatPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  return (
    <div className="flex items-center justify-center h-full text-gray-500">
      Select a conversation to start chatting
    </div>
  );
} 
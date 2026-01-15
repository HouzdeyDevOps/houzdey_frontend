"use client";

import { useState } from "react";
import ConversationList from "@/components/chat/conversation-list";
import ChatWindow from "@/components/chat/chat-window";

export default function ChatPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  return (
    <div className="flex items-center justify-center h-full text-gray-500 text-lg lg:text-xl">
      <div className="text-center p-8">
        <div className="mb-4 text-6xl">💬</div>
        <h2 className="text-2xl font-semibold mb-2 text-gray-700">Select a conversation</h2>
        <p className="text-gray-500">Choose a conversation from the list to start chatting</p>
      </div>
    </div>
  );
} 
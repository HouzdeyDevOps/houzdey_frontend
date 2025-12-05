"use client";

import ProtectedRoute from '@/components/auth/protected-route';
import ConversationList from "@/components/chat/conversation-list";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";



export default function ChatLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const conversationId = pathname.split('/').pop();
  const isInConversation = conversationId && conversationId !== 'chat';

  const handleConversationSelect = (id: string) => {
    router.push(`/chat/${id}`);
  };

  const handleBackToList = () => {
    router.push('/chat');
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen">
        <Navbar showListingButton={false} showSearch={false} showPropertyTypeFilters={false} />
        <div className="flex flex-1 overflow-hidden pt-[6rem]">
          {/* Sidebar with conversation list - Hidden on mobile when in conversation */}
          <div className={`${isInConversation ? 'hidden md:flex' : 'flex'} w-full md:w-[320px] lg:w-[360px] md:border-r bg-white flex-col flex-shrink-0`}>
            <div className="p-4 flex-shrink-0 mb-2">
              <div className="flex items-center gap-2">
                <button onClick={() => router.push('/')} className="text-gray-600 hover:text-gray-900 min-w-[44px] min-h-[44px] flex items-center justify-center">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-semibold">Chats</h1>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <ConversationList
                onConversationSelect={handleConversationSelect}
                selectedConversationId={conversationId}
              />
            </div>
          </div>

          {/* Main chat area - Full width on mobile when in conversation */}
          <div className={`${isInConversation ? 'flex' : 'hidden md:flex'} flex-1 bg-white overflow-hidden`}>
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 
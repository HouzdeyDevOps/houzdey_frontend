"use client";

import ConversationList from "@/components/chat/conversation-list";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const conversationId = pathname.split('/').pop();

  const handleConversationSelect = (id: string) => {
    router.push(`/chat/${id}`);
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar showSearch={false} showPropertyTypeFilters={false} />
      <div className="flex flex-1 overflow-hidden pt-[6rem]">
        {/* Sidebar with conversation list */}
        <div className="w-[320px] border-r bg-white flex flex-col flex-shrink-0">
          <div className="p-4 flex-shrink-0 mb-2">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                <ChevronLeft className="w-6 h-6" />
              </Link>
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

        {/* Main chat area */}
        <div className="flex-1 bg-white overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
} 
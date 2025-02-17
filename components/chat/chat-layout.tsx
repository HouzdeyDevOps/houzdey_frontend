"use client";

import { ChevronLeft, MoreVertical } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-[320px] border-r bg-white">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center text-gray-600">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-xl font-semibold">Chats</span>
            </Link>
          </div>
        </div>
        
        {/* Chat List */}
        <div className="overflow-y-auto h-[calc(100vh-73px)]">
          <ChatListItem
            name="James Mark"
            message="1 new message"
            time="10:25"
            isUnread
          />
          <ChatListItem
            name="Mary sarah"
            message="Alright, thank you"
            time="10:25"
          />
          <ChatListItem
            name="John Peterson"
            message="Draft: I would like k..."
            time="10:25"
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {children}
      </div>
    </div>
  );
}

interface ChatListItemProps {
  name: string;
  message: string;
  time: string;
  isUnread?: boolean;
}

function ChatListItem({ name, message, time, isUnread }: ChatListItemProps) {
  return (
    <div className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer">
      <div className="w-12 h-12 rounded-full overflow-hidden">
        <Image
          src="/assets/images/avatar-placeholder.jpg"
          alt={name}
          width={48}
          height={48}
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium">{name}</span>
          <span className="text-sm text-gray-500">{time}</span>
        </div>
        <div className="flex items-center gap-2">
          {isUnread && (
            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
          )}
          <span className={`text-sm ${isUnread ? 'text-indigo-600' : 'text-gray-500'}`}>
            {message}
          </span>
        </div>
      </div>
    </div>
  );
} 
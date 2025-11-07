import Image from "next/image";
import { MoreVertical } from "lucide-react";
import type { Conversation, UserStatus } from "@/@types/chat";
import { formatLastSeen } from "@/utils/date";
import ChatHeaderSkeleton from "../ui/chat-header-skeleton";
import { getOptimizedImageUrl } from "@/utils/imageUtils";

interface ChatHeaderProps {
  conversation: Conversation | null;
  otherUserStatus: UserStatus | null;
  userId?: string;
  isLoading: boolean;
  onMoreClick: () => void;
}

export default function ChatHeader({ 
  conversation, 
  otherUserStatus, 
  userId,
  isLoading,
  onMoreClick 
}: ChatHeaderProps) {
  return (
    <div className="px-4 py-3 border-b flex items-center z-10 bg-white">
      {isLoading ? (
        <ChatHeaderSkeleton />
      ) : (
        <div className="flex-1 flex items-center">
          <div className="w-10 h-10 rounded-full mr-3 relative">
            <Image
              src={
                getOptimizedImageUrl(
                  conversation?.other_user?.profile_picture,
                  { width: 40, height: 40, defaultImage: "avatar-placeholder" }
                )
              }
              alt={`${conversation?.other_user?.first_name} ${conversation?.other_user?.last_name}`}
              width={40}
              height={40}
              className="object-cover rounded-full"
              style={{
                width: '40px',
                height: '40px'
              }}
            />
            <div
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white z-50 ${
                otherUserStatus?.status === "online"
                  ? "bg-green-500"
                  : "bg-gray-400"
              }`}
              title={
                otherUserStatus?.status === "online" ? "Online" : "Offline"
              }
            />
          </div>
          <div>
            <div className="font-medium">
              {`${conversation?.other_user?.first_name} ${conversation?.other_user?.last_name}`}
            </div>
            <div className="text-sm text-gray-500">
              {userId === conversation?.owner_id
                ? "Interested Tenant"
                : conversation?.property?.title}
            </div>
            <div className="text-sm text-gray-500">
              {otherUserStatus?.status === "online"
                ? "Online"
                : otherUserStatus?.last_seen
                ? `Last seen ${formatLastSeen(otherUserStatus.last_seen)}`
                : "Offline"}
            </div>
          </div>
        </div>
      )}
      <div className="relative">
        <button
          onClick={onMoreClick}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}

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
    <div className="px-3 sm:px-4 py-3 border-b flex items-center z-10 bg-white">
      {isLoading ? (
        <ChatHeaderSkeleton />
      ) : (
        <div className="flex-1 flex items-center min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-2 sm:mr-3 relative flex-shrink-0">
            <Image
              src={
                getOptimizedImageUrl(
                  conversation?.other_user?.profile_picture,
                  { width: 48, height: 48, defaultImage: "avatar-placeholder" }
                )
              }
              alt={`${conversation?.other_user?.first_name} ${conversation?.other_user?.last_name}`}
              width={48}
              height={48}
              className="object-cover rounded-full"
              style={{
                width: '100%',
                height: '100%'
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
          <div className="min-w-0 flex-1">
            <div className="font-medium text-sm sm:text-base truncate">
              {`${conversation?.other_user?.first_name} ${conversation?.other_user?.last_name}`}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 truncate">
              {userId === conversation?.owner_id
                ? "Interested Tenant"
                : conversation?.property?.title}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 truncate">
              {otherUserStatus?.status === "online"
                ? "Online"
                : otherUserStatus?.last_seen
                ? `Last seen ${formatLastSeen(otherUserStatus.last_seen)}`
                : "Offline"}
            </div>
          </div>
        </div>
      )}
      <div className="relative flex-shrink-0">
        <button
          onClick={onMoreClick}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-100 rounded-full"
        >
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}

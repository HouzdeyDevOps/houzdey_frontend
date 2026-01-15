import Image from "next/image";
import { MoreVertical, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  return (
    <div className="px-4 sm:px-6 py-4 lg:py-5 border-b flex items-center z-10 bg-white shadow-sm w-full">
      {/* Back button - only visible on mobile */}
      <button 
        onClick={() => router.push('/chat')}
        className="md:hidden mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-gray-600" />
      </button>

      {isLoading ? (
        <ChatHeaderSkeleton />
      ) : (
        <div className="flex-1 flex items-center min-w-0">
          <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full mr-3 lg:mr-4 relative flex-shrink-0">
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
            <div className="font-semibold text-base lg:text-lg truncate text-gray-900">
              {`${conversation?.other_user?.first_name} ${conversation?.other_user?.last_name}`}
            </div>
            <div className="text-sm lg:text-base text-gray-600 truncate font-medium">
              {userId === conversation?.owner_id
                ? "Interested Tenant"
                : conversation?.property?.title}
            </div>
            <div className="text-xs lg:text-sm text-gray-500 truncate">
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

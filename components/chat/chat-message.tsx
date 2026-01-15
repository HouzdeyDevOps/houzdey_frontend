import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Check, CheckCheck } from "lucide-react";
import type { Message } from "@/@types/chat";
import { formatChatTime } from "@/utils/date";
import ImageViewerModal from './image-viewer-modal';

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
  unreadMessages: Set<string>;
  observer: React.RefObject<IntersectionObserver | null>;
  onMessageContextMenu: (e: React.MouseEvent, message: Message, fileUrl?: string) => void;
}

const ChatMessage = React.memo(({ 
  message, 
  isCurrentUser, 
  unreadMessages, 
  observer, 
  onMessageContextMenu 
}: ChatMessageProps) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");

  useEffect(() => {
    if (
      messageRef.current &&
      !isCurrentUser &&
      unreadMessages.has(message.id) &&
      observer.current
    ) {
      observer.current.observe(messageRef.current);
      return () => {
        if (messageRef.current && observer.current) {
          observer.current.unobserve(messageRef.current);
        }
      };
    }
  }, [message.id, isCurrentUser, unreadMessages, observer]);

  const handleImageClick = (fileUrl: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedImageUrl(fileUrl);
    setIsImageViewerOpen(true);
  };

  const renderMessageContent = (message: Message) => {
    try {
      const parsedContent = JSON.parse(message.content);

      if (parsedContent.type === "image") {
        return (
          <>
            <div
              className="relative w-48 h-48 lg:w-56 lg:h-56 cursor-pointer"
              onClick={(e) => handleImageClick(parsedContent.file_url, e)}
              onContextMenu={(e) =>
                onMessageContextMenu(e, message, parsedContent.file_url)
              }
            >
              <Image
                src={parsedContent.file_url || ""}
                alt="Shared image"
                width={224}
                height={224}
                className="object-cover rounded-lg"
                style={{
                  width: '100%',
                  height: '100%'
                }}
                sizes="(max-width: 1024px) 192px, 224px"
              />
            </div>
            <ImageViewerModal
              imageUrl={selectedImageUrl}
              isOpen={isImageViewerOpen}
              onClose={() => setIsImageViewerOpen(false)}
            />
          </>
        );
      } else if (parsedContent.type === "voice") {
        return (
          <div
            className="flex items-center gap-2 lg:gap-3"
            onContextMenu={(e) =>
              onMessageContextMenu(e, message, parsedContent.file_url)
            }
          >
            <audio
              controls
              src={parsedContent.file_url}
              className="max-w-[240px] lg:max-w-[280px]"
            />
            <span className="text-sm lg:text-base text-gray-500">
              {Math.floor(parsedContent.duration || 0)}s
            </span>
          </div>
        );
      }
    } catch (e) {
      // Regular text message
      return (
        <div onContextMenu={(e) => onMessageContextMenu(e, message)}>
          {message.content}
        </div>
      );
    }
  };

  return (
    <div
      ref={messageRef}
      data-message-id={message.id}
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-3 lg:mb-4`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] ${
          isCurrentUser
            ? "bg-indigo-600 text-white rounded-l-2xl rounded-tr-2xl"
            : "bg-white text-gray-900 rounded-r-2xl rounded-tl-2xl shadow-sm"
        } px-4 lg:px-5 py-3 lg:py-3.5 relative group text-base lg:text-lg`}
        onContextMenu={(e) => onMessageContextMenu(e, message)}
      >
        {renderMessageContent(message)}
        <div className="text-xs lg:text-sm mt-1.5 text-gray-400 flex items-center">
          {formatChatTime(message.created_at)}
          {isCurrentUser && (
            <span className="ml-2">
              {message.read ? (
                <CheckCheck className="w-4 h-4 text-gray-50" />
              ) : (
                <Check className="w-4 h-4 text-gray-50" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;

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
              className="relative w-32 h-32 cursor-pointer"
              onClick={(e) => handleImageClick(parsedContent.file_url, e)}
              onContextMenu={(e) =>
                onMessageContextMenu(e, message, parsedContent.file_url)
              }
            >
              <Image
                src={parsedContent.file_url || ""}
                alt="Shared image"
                width={128}
                height={128}
                className="object-cover rounded-lg"
                style={{
                  width: '128px',
                  height: '128px'
                }}
                sizes="128px"
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
            className="flex items-center gap-2"
            onContextMenu={(e) =>
              onMessageContextMenu(e, message, parsedContent.file_url)
            }
          >
            <audio
              controls
              src={parsedContent.file_url}
              className="max-w-[200px]"
            />
            <span className="text-sm text-gray-500">
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
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[70%] ${
          isCurrentUser
            ? "bg-indigo-600 text-white rounded-l-2xl rounded-tr-2xl"
            : "bg-gray-100 text-gray-900 rounded-r-2xl rounded-tl-2xl"
        } px-4 py-2 relative group`}
        onContextMenu={(e) => onMessageContextMenu(e, message)}
      >
        {renderMessageContent(message)}
        <div className="text-xs mt-1 text-gray-400 flex items-center">
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

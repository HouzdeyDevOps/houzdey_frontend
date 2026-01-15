"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import type { Message, Conversation, UserStatus } from "@/@types/chat";
import { chatApi, chatService } from "@/api/chat";
import ReportModal from "./report-modal";
import { useAuth } from "@/hooks/useAuth";
import { uploadService } from "@/services/upload";
import MessageContextMenu from "./message-context-menu";
import ChatMessage from "./chat-message";
import ChatHeader from "./chat-header";
import ChatInput from "./chat-input";
import ImagePreview from "./image-preview";
import TypingIndicator from "./typing-indicator";
import { useChatConnection } from "@/hooks/useChatConnection";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";

export default function ChatWindow() {
  const { id: conversationIdParam } = useParams();
  const conversationId = Array.isArray(conversationIdParam)
    ? conversationIdParam[0]
    : conversationIdParam;

  const { user } = useAuth();
  
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [otherUserStatus, setOtherUserStatus] = useState<UserStatus | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    messageId: string;
    showDownload: boolean;
    fileUrl?: string;
    isSender: boolean;
  } | null>(null);
  const [unreadMessages, setUnreadMessages] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Helper functions
  function handleNewMessage(message: Message) {
    setMessages((prev) => {
      const pendingIndex = prev.findIndex(
        (m) =>
          m.pending &&
          m.content === message.content &&
          m.sender_id === message.sender_id
      );

      if (pendingIndex !== -1) {
        const newMessages = [...prev];
        newMessages[pendingIndex] = message;
        return newMessages;
      }

      const existingIndex = prev.findIndex((m) => m.id === message.id);
      if (existingIndex !== -1) {
        return prev;
      }

      if (message.sender_id !== user?.id) {
        setUnreadMessages(prev => new Set(prev).add(message.id));
      }

      return [...prev, message];
    });
    scrollToBottom();
  }

  function handleReadStatus(conversationId: string) {
    if (conversationId === conversationIdParam) {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => ({
          ...msg,
          read: true,
        }))
      );
    }
  }

  async function handleSendVoice(fileUrl: string, duration: number) {
    if (!conversationId) return;
    await chatService.sendMessage(
      conversationId,
      JSON.stringify({
        type: "voice",
        file_url: fileUrl,
        duration: duration,
      })
    );
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  // Custom hooks
  const { isConnected, error, isLoading, initializeChat, setError } = useChatConnection({
    conversationId: conversationId || null,
    userId: user?.id,
    otherUserId: conversation?.other_user?.id,
    onMessage: handleNewMessage,
    onTyping: setOtherUserTyping,
    onUserStatus: setOtherUserStatus,
    onReadStatus: handleReadStatus
  });

  const {
    isRecording,
    recordingTime,
    recordingError,
    isUploading: isVoiceUploading,
    startRecording,
    stopRecording,
    formatRecordingTime
  } = useVoiceRecording({
    conversationId: conversationId || null,
    onSendVoice: handleSendVoice
  });

  const [isImageUploading, setIsImageUploading] = useState(false);

  // Callbacks
  const markMessagesAsRead = useCallback(async () => {
    if (!conversationId || unreadMessages.size === 0) return;
    
    try {
      await chatApi.markMessagesAsRead(conversationId);
      setUnreadMessages(new Set());
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  }, [conversationId, unreadMessages]);

  const handleMessageContextMenu = useCallback((
    e: React.MouseEvent,
    message: Message,
    fileUrl?: string
  ) => {
    e.preventDefault();
    const showDownload = fileUrl !== undefined;
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      messageId: message.id,
      showDownload,
      fileUrl,
      isSender: message.sender_id === user?.id,
    });
  }, [user?.id]);

  const handleDeleteMessage = useCallback(async (messageId: string) => {
    try {
      await chatApi.deleteMessage(messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      setContextMenu(null);
    } catch (error) {
      console.error("Failed to delete message:", error);
      setError("Failed to delete message. Please try again.");
    }
  }, [setError]);

  // Load conversation
  useEffect(() => {
    const loadConversation = async () => {
      if (!conversationId) return;
      try {
        const data = await chatApi.getConversation(conversationId);
        setConversation(data);
        if (data?.other_user?.id) {
          chatService.getUserStatus(data.other_user.id);
        }
      } catch (error) {
        console.error("Failed to load conversation:", error);
      }
    };
    loadConversation();
  }, [conversationId]);

  // Handle user status updates
  // Subscribe to real-time user status updates (no polling needed)
  useEffect(() => {
    if (!conversation?.other_user?.id) return;

    const handleUserStatus = (status: UserStatus) => {
      if (status.user_id === conversation.other_user?.id) {
        setOtherUserStatus(status);
      }
    };

    const unsubscribe = chatService.onUserStatus(handleUserStatus);
    
    // Request initial status only once - updates come real-time via Socket.IO
    chatService.getUserStatus(conversation.other_user.id);

    return () => {
      unsubscribe();
    };
  }, [conversation?.other_user?.id]);

  // Initialize chat connection
  useEffect(() => {
    if (!conversationId || !user?.id) return;

    const initialize = async () => {
      const cleanup = await initializeChat();
      return cleanup;
    };

    const cleanupPromise = initialize();
    return () => {
      cleanupPromise.then((cleanup) => {
        if (cleanup) cleanup();
      });
    };
  }, [conversationId, user?.id]);

  // Load initial messages
  useEffect(() => {
    const loadInitialMessages = async () => {
      if (!conversationId) return;
      try {
        const initialMessages = await chatApi.getMessages(conversationId);
        setMessages(initialMessages);
        
        const unreadIds = new Set(
          initialMessages
            .filter(msg => !msg.read && msg.sender_id !== user?.id)
            .map(msg => msg.id)
        );
        setUnreadMessages(unreadIds);
        
        if (unreadIds.size > 0) {
          markMessagesAsRead();
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
        setError("Failed to load messages");
      }
    };

    loadInitialMessages();
  }, [conversationId, user?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set up intersection observer for read receipts
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const hasUnreadInView = entries.some(entry => {
        if (entry.isIntersecting) {
          const messageId = entry.target.getAttribute('data-message-id');
          return messageId && unreadMessages.has(messageId);
        }
        return false;
      });

      if (hasUnreadInView) {
        markMessagesAsRead();
      }
    }, options);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [markMessagesAsRead]);

  // Event handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      chatService.setTypingStatus(conversationId as string, true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      chatService.setTypingStatus(conversationId as string, false);
    }, 2000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !conversationId || !isConnected) return;

    const messageContent = newMessage.trim();
    setNewMessage("");

    try {
      await chatService.sendMessage(conversationId, messageContent);
    } catch (err) {
      console.error("Failed to send message:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again."
      );
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !conversationId) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setSelectedFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async () => {
    if (!selectedFile || !conversationId || isImageUploading) return;

    setIsImageUploading(true);
    setError(null);
    try {
      const fileUrl = await uploadService.uploadFile(selectedFile, "image");
      await chatService.sendMessage(
        conversationId,
        JSON.stringify({ type: "image", file_url: fileUrl })
      );
      setImagePreview(null);
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to upload image:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload image. Please try again."
      );
    } finally {
      setIsImageUploading(false);
      setUploadProgress(0);
    }
  };

  const handleCancelPreview = () => {
    setImagePreview(null);
    setSelectedFile(null);
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleDownload = async (fileUrl: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileUrl.split("/").pop() || "download";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setContextMenu(null);
    } catch (error) {
      console.error("Failed to download file:", error);
      setError("Failed to download file. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white w-full">
      <ChatHeader
        conversation={conversation}
        otherUserStatus={otherUserStatus}
        userId={user?.id}
        isLoading={isLoading}
        onMoreClick={() => setShowDropdown(!showDropdown)}
      />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-4 sm:p-6 lg:p-8 space-y-3 lg:space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Start a conversation...
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isCurrentUser={message.sender_id === user?.id}
                unreadMessages={unreadMessages}
                observer={observerRef}
                onMessageContextMenu={handleMessageContextMenu}
              />
            ))
          )}
          {otherUserTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 text-sm">{error}</div>
      )}

      {recordingError && (
        <div className="bg-red-100 text-red-700 px-4 py-2 text-sm">
          {recordingError}
        </div>
      )}

      {imagePreview && (
        <ImagePreview
          imagePreview={imagePreview}
          isUploading={isImageUploading}
          onUpload={handleImageUpload}
          onCancel={handleCancelPreview}
        />
      )}

      <ChatInput
        newMessage={newMessage}
        isRecording={isRecording}
        recordingTime={recordingTime}
        isConnected={isConnected}
        isUploading={isImageUploading || isVoiceUploading}
        onMessageChange={handleInputChange}
        onSubmit={handleSendMessage}
        onImageSelect={handleImageSelect}
        onMicClick={handleMicClick}
        formatRecordingTime={formatRecordingTime}
      />

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        propertyTitle={conversation?.property?.title || ""}
      />

      {showDropdown && (
        <div className="absolute right-7 top-[8rem] mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
          <button
            onClick={() => {
              setShowReportModal(true);
              setShowDropdown(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Report User
          </button>
          <button
            onClick={() => setShowDropdown(false)}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Block User
          </button>
        </div>
      )}

      {(isImageUploading || isVoiceUploading) && uploadProgress > 0 && (
        <div className="mt-2">
          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-full bg-blue-500 rounded transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {contextMenu && (
        <MessageContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onDelete={() => handleDeleteMessage(contextMenu.messageId)}
          onDownload={
            contextMenu.fileUrl
              ? () => handleDownload(contextMenu.fileUrl!)
              : undefined
          }
          showDownload={contextMenu.showDownload}
          isSender={contextMenu.isSender}
        />
      )}
    </div>
  );
}

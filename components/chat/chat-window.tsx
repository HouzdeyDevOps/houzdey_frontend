"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import {
  Message,
  Conversation,
  UserStatus,
  ChatService as ChatServiceType,
} from "@/@types/chat";
import { chatApi, chatService } from "@/api/chat";
import {
  MoreVertical,
  Send,
  Mic,
  Image as ImageIcon,
  StopCircle,
} from "lucide-react";
import Image from "next/image";
import ReportModal from "./report-modal";
import { useAuth } from "@/hooks/useAuth";
import { formatChatTime, formatLastSeen } from "@/utils/date";
import ChatHeaderSkeleton from "../ui/chat-header-skeleton";
import { uploadService } from "@/services/upload";
import MessageContextMenu from "./message-context-menu";

export default function ChatWindow() {
  const { id: conversationIdParam } = useParams();
  const conversationId = Array.isArray(conversationIdParam)
    ? conversationIdParam[0]
    : conversationIdParam;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const { user } = useAuth();
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [otherUserStatus, setOtherUserStatus] = useState<UserStatus | null>(
    null
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    messageId: string;
    showDownload: boolean;
    fileUrl?: string;
    isSender: boolean;
  } | null>(null);

  useEffect(() => {
    const loadConversation = async () => {
      if (!conversationId) return;
      try {
        const data = await chatApi.getConversation(conversationId);
        setConversation(data);
        // Request initial status when conversation loads
        if (data?.other_user?.id) {
          console.log(
            "Requesting initial status for user:",
            data.other_user.id
          );
          chatService.getUserStatus(data.other_user.id);
        }
      } catch (error) {
        console.error("Failed to load conversation:", error);
      }
    };
    loadConversation();
  }, [conversationId]);

  // Add effect to handle status updates
  useEffect(() => {
    if (!conversation?.other_user?.id) return;

    const handleUserStatus = (status: UserStatus) => {
      console.log("Processing user status update:", status);
      if (status.user_id === conversation.other_user?.id) {
        console.log(
          "Updating status for user:",
          status.user_id,
          "to:",
          status.status
        );
        setOtherUserStatus(status);
      }
    };

    // Set up user status handler
    const unsubscribe = chatService.onUserStatus(handleUserStatus);

    // Request initial status
    chatService.getUserStatus(conversation.other_user.id);

    // Set up periodic status check
    const statusInterval = setInterval(() => {
      if (conversation.other_user?.id) {
        // console.log("Periodic status check for user:", conversation.other_user.id);
        chatService.getUserStatus(conversation.other_user.id);
      }
    }, 30000); // Check every 30 seconds

    return () => {
      unsubscribe();
      clearInterval(statusInterval);
    };
  }, [conversation?.other_user?.id]);

  // Add effect to handle connection changes
  useEffect(() => {
    if (!isConnected && conversation?.other_user?.id) {
      console.log("Connection lost, marking user as offline");
      setOtherUserStatus(
        (prev) =>
          ({
            ...prev,
            status: "offline",
            last_seen: new Date().toISOString(),
          } as UserStatus)
      );
    }
  }, [isConnected, conversation?.other_user?.id]);

  const initializeChat = async () => {
    if (!user?.id || !conversationId) return;

    setIsLoading(true);

    try {
      // Initialize socket connection
      await chatService.initializeConnection(
        localStorage.getItem("token") || ""
      );

      // Set connection status
      setIsConnected(chatService.isSocketConnected());

      // Set up connection status handler
      const unsubscribeConnection = chatService.onConnection((connected) => {
        console.log("Connection status changed:", connected);
        setIsConnected(connected);

        // Re-request user status when connection is restored
        if (connected && conversation?.other_user?.id) {
          console.log("Re-requesting user status after reconnection");
          chatService.getUserStatus(conversation.other_user.id);
        }
      });

      // Join the conversation room
      await chatService.joinConversation(conversationId);

      // Load initial messages
      const initialMessages = await chatApi.getMessages(conversationId);
      setMessages(initialMessages);

      // Set up message handler
      const unsubscribeMessage = chatService.onMessage((message: Message) => {
        // Also update user status when receiving a message
        if (message.sender_id === conversation?.other_user?.id) {
          setOtherUserStatus(
            (prev) =>
              ({
                ...prev,
                status: "online",
                last_seen: new Date().toISOString(),
              } as UserStatus)
          );
        }
        setMessages((prev) => {
          // Check if this is a pending message being confirmed
          const pendingIndex = prev.findIndex(
            (m) =>
              m.pending &&
              m.content === message.content &&
              m.sender_id === message.sender_id
          );

          if (pendingIndex !== -1) {
            // Replace pending message with confirmed message
            const newMessages = [...prev];
            newMessages[pendingIndex] = message;
            return newMessages;
          }

          // Check if we already have this message
          const existingIndex = prev.findIndex((m) => m.id === message.id);
          if (existingIndex !== -1) {
            return prev; // Don't add duplicate messages
          }

          // If it's a new message, add it
          return [...prev, message];
        });
        scrollToBottom();
      });

      // Set up typing status handler
      const unsubscribeTyping = chatService.onTyping((status) => {
        if (
          status.user_id !== user.id &&
          status.conversation_id === conversationId
        ) {
          setOtherUserTyping(status.is_typing);
          // Update user status when they're typing
          setOtherUserStatus(
            (prev) =>
              ({
                ...prev,
                status: "online",
                last_seen: new Date().toISOString(),
              } as UserStatus)
          );
        }
      });

      // Set up error handler
      const unsubscribeError = chatService.onError((error) => {
        console.error("Socket error:", error);
        setError(error.message);
        // Clear error after 5 seconds
        setTimeout(() => setError(null), 5000);
      });

      return () => {
        unsubscribeConnection();
        unsubscribeMessage();
        unsubscribeTyping();
        unsubscribeError();
      };
    } catch (err) {
      console.error("Failed to initialize chat:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to connect to chat service. Please try refreshing."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle input changes with typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    // Handle typing status
    if (!isTyping) {
      setIsTyping(true);
      chatService.setTypingStatus(conversationId as string, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
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
      // The socket will handle adding the message to the UI
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

  const handleRetryConnection = async () => {
    setError(null);
    // await initializeChat();
  };

  const handleMoreClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleReport = () => {
    setShowReportModal(true);
    setShowDropdown(false);
  };

  const handleBlock = () => {
    // Implement block functionality
    setShowDropdown(false);
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !conversationId) return;

    setIsUploading(true);
    setError(null);
    try {
      const fileUrl = await uploadService.uploadFile(file, "image");
      await chatService.sendMessage(
        conversationId,
        JSON.stringify({ type: "image", file_url: fileUrl })
      );
      e.target.value = ""; // Reset file input
    } catch (error) {
      console.error("Failed to upload image:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload image. Please try again."
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Start voice recording
  const startRecording = async () => {
    try {
      setRecordingError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.start(1000); // Record in 1-second chunks
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          // Stop recording if it exceeds 5 minutes
          if (prev >= 300) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Failed to start recording:", error);
      setRecordingError(
        "Failed to start recording. Please check your microphone permissions."
      );
    }
  };

  // Stop voice recording
  const stopRecording = async () => {
    if (!mediaRecorderRef.current || !conversationId) return;

    try {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setIsUploading(true);
        try {
          const fileUrl = await uploadService.uploadFile(
            new File([audioBlob], "voice-message.webm", { type: "audio/webm" }),
            "voice"
          );
          await chatService.sendMessage(
            conversationId,
            JSON.stringify({
              type: "voice",
              file_url: fileUrl,
              duration: recordingTime,
            })
          );
        } catch (error) {
          console.error("Failed to upload voice message:", error);
          setError(
            error instanceof Error
              ? error.message
              : "Failed to upload voice message. Please try again."
          );
        } finally {
          setIsUploading(false);
        }
      };

      // Stop all tracks
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    } catch (error) {
      console.error("Failed to stop recording:", error);
      setRecordingError("Failed to stop recording. Please try again.");
      setIsRecording(false);
    }
  };

  // Format recording time
  const formatRecordingTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Handle mic button click
  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Handle right click on message
  const handleMessageContextMenu = (
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
  };

  // Handle message deletion
  const handleDeleteMessage = async (messageId: string) => {
    try {
      await chatApi.deleteMessage(messageId);
      // Remove message from state
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      setContextMenu(null);
    } catch (error) {
      console.error("Failed to delete message:", error);
      setError("Failed to delete message. Please try again.");
    }
  };

  // Handle file download
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

  // Update renderMessageContent to handle right clicks
  const renderMessageContent = (message: Message) => {
    try {
      const parsedContent = JSON.parse(message.content);

      if (parsedContent.type === "image") {
        return (
          <div
            className="relative w-64 h-64"
            onContextMenu={(e) =>
              handleMessageContextMenu(e, message, parsedContent.file_url)
            }
          >
            <Image
              src={parsedContent.file_url || ""}
              alt="Shared image"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        );
      } else if (parsedContent.type === "voice") {
        return (
          <div
            className="flex items-center gap-2"
            onContextMenu={(e) =>
              handleMessageContextMenu(e, message, parsedContent.file_url)
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
        <div onContextMenu={(e) => handleMessageContextMenu(e, message)}>
          {message.content}
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header - Fixed */}
      <div className="px-4 py-3 border-b flex items-center z-10 bg-white">
        {isLoading ? (
          <ChatHeaderSkeleton />
        ) : (
          <div className="flex-1 flex items-center">
            <div className="w-10 h-10 rounded-full mr-3 relative">
              <Image
                src={
                  conversation?.other_user?.profile_picture ||
                  "/assets/images/avatar-placeholder.jpg"
                }
                alt={`${conversation?.other_user?.first_name} ${conversation?.other_user?.last_name}`}
                width={40}
                height={40}
                className="object-cover rounded-full"
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
                {user?.id === conversation?.owner_id
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
            onClick={handleMoreClick}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Messages area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Start a conversation...
            </div>
          ) : (
            messages.map((message, index) => {
              const isLastMessage = index === messages.length - 1;
              const showDate =
                index === 0 ||
                new Date(message.created_at).toDateString() !==
                  new Date(messages[index - 1].created_at).toDateString();

              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="text-center my-4 flex items-center justify-center">
                      <div className="border-t border-gray-200 w-full" />
                      <span className="text-sm text-gray-500 px-4 whitespace-nowrap">
                        {new Date(message.created_at).toDateString() ===
                        new Date().toDateString()
                          ? "Today"
                          : new Date(message.created_at).toLocaleDateString()}
                      </span>
                      <div className="border-t border-gray-200 w-full" />
                    </div>
                  )}
                  <div
                    className={`flex ${
                      message.sender_id === user?.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div className="max-w-[70%]">
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          message.sender_id === user?.id
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        } ${message.pending ? "opacity-70" : ""}`}
                      >
                        {renderMessageContent(message)}
                      </div>
                      <div
                        className={`flex items-center mt-1 text-xs text-gray-500 ${
                          message.sender_id === user?.id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        {formatChatTime(message.created_at)}
                        {message.pending && " • Sending..."}
                        {isLastMessage &&
                          message.sender_id === user?.id &&
                          message.read && (
                            <span className="ml-1 text-indigo-600">Seen</span>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {otherUserTyping && (
            <div className="flex items-start mb-4">
              <div className="max-w-[70%]">
                <div className="bg-gray-100 text-gray-900 rounded-2xl px-4 py-2 inline-flex items-center">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
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

      {/* Message Input - Fixed */}
      <div className="p-4 border-t bg-white relative">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUploading || isRecording}
              />
              <ImageIcon
                className={`w-6 h-6 ${
                  isUploading
                    ? "text-gray-400"
                    : "text-blue-500 hover:text-blue-600"
                }`}
              />
            </label>
            <input
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              placeholder={
                isRecording ? "Recording..." : "Are you open to negotiations?"
              }
              disabled={isRecording}
              className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white disabled:opacity-50"
            />
          </div>
          <button
            type="button"
            onClick={newMessage.trim() ? handleSendMessage : handleMicClick}
            disabled={!isConnected}
            className="p-2 flex  bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRecording ? (
              <>
                <StopCircle className="w-6 h-6" />
                <span className="ml-2">
                  {formatRecordingTime(recordingTime)}
                </span>
              </>
            ) : newMessage.trim() ? (
              <Send />
            ) : (
              <Mic />
            )}
          </button>
        </form>
      </div>

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        propertyTitle={conversation?.property?.title || ""}
      />

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-7 top-[8rem] mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
          <button
            onClick={handleReport}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Report User
          </button>
          <button
            onClick={handleBlock}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Block User
          </button>
        </div>
      )}

      {isUploading && (
        <div className="mt-2">
          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-full bg-blue-500 rounded transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Add context menu */}
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

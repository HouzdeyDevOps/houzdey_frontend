"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Message, Conversation } from "@/@types/chat";
import { chatApi, chatService } from "@/api/chat";
import { MoreVertical, Send } from "lucide-react";
import Image from "next/image";
import ReportModal from "./report-modal";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

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

  useEffect(() => {
    const loadConversation = async () => {
      if (!conversationId) return;
      try {
        const data = await chatApi.getConversation(conversationId);
        setConversation(data);
      } catch (error) {
        console.error("Failed to load conversation:", error);
      }
    };
    loadConversation();
  }, [conversationId]);

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
      });

      // Join the conversation room
      await chatService.joinConversation(conversationId);

      // Load initial messages
      const initialMessages = await chatApi.getMessages(conversationId);
      setMessages(initialMessages);

      chatService.onMessage((message: Message) => {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      });

   // Set up message handler
   const unsubscribeMessage = chatService.onMessage((message: Message) => {
    console.log("Received new message:", message);
    // Replace optimistic message with the actual message
    setMessages((prev) => {
      const index = prev.findIndex((m) => m.id === message.id);
      if (index !== -1) {
        const newMessages = [...prev];
        newMessages[index] = message;
        return newMessages;
      }
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

    // Optimistically add message to UI
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempId,
      conversation_id: conversationId,
      sender_id: user?.id || '',
      // receiver_id: receiverId,
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
      read: false,
      pending: true
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage("");


    try {
      console.log("Sending message:", newMessage.trim());

      await chatService.sendMessage(conversationId, newMessage.trim());

      // setNewMessage("");
      // scrollToBottom();

      // The real message will come back via the socket "new_message" event

      // and replace our temporary one in the message handler
    } catch (err) {
      console.error("Failed to send message:", err);
      // Update the optimistic message to show error
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempId 
            ? {...msg, content: msg.content + " (Failed to send)", pending: false} 
            : msg
        )
      );
      
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again."
      );

      // Clear error after 5 seconds
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


  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <p>Loading chat...</p>
  //     </div>
  //   );
  // }


  return (
    <div className="flex flex-col h-screen">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={conversation?.other_user?.profile_picture || "/assets/images/avatar-placeholder.jpg"}
                alt={`${conversation?.other_user?.first_name} ${conversation?.other_user?.last_name}`}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-semibold">
                {conversation?.other_user?.first_name} {conversation?.other_user?.last_name}
              </h2>
              <Link 
                href={`/properties/${conversation?.property_id}`}
                className="text-sm text-gray-500 hover:text-indigo-600"
              >
                {conversation?.property?.title}
              </Link>
            </div>
          </div>
          <button
            onClick={handleMoreClick}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />

              <div className="absolute right-4 top-14 mt-2 w-32 bg-white rounded-lg shadow-lg z-20 py-2 border">
                <button
                  onClick={handleReport}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  Report
                </button>
                <button
                  onClick={handleBlock}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  Block
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Connection status indicator */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
        <div className="flex items-center">
          <div
            className={`w-2 h-2 rounded-full mr-2 ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm text-gray-600">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        {error && <div className="text-sm text-red-500">{error}</div>}
        {!isConnected && !error && (
          <button
            onClick={handleRetryConnection}
            className="text-sm text-blue-500 hover:underline"
          >
            Reconnect
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Start a conversation...
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.sender_id === user?.id ? "ml-auto" : "mr-auto"
              }`}
            >
              <div
                className={`rounded-lg p-3 max-w-xs ${
                  message.sender_id === user?.id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100"
                } ${message.pending ? "opacity-70" : ""}`}
              >
                {message.content}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(message.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {message.pending && " • Sending..."}
              </div>
            </div>
          ))
        )}
        {otherUserTyping && (
          <div className="text-sm text-gray-500 mb-2">Typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <div className="relative flex-1">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type a message..."
              className="w-full px-4 py-2 pr-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button
              type="button"
              onClick={() => {/* Add emoji picker */}}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              😊
            </button>
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim() || !isConnected}
            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
        {!isConnected && (
          <div className="flex items-center gap-2 text-sm text-red-500 mt-2">
            <span>Disconnected</span>
            <button
              onClick={handleRetryConnection}
              className="text-indigo-600 hover:underline"
            >
              Retry
          </button>
        </div>
        )}
      </div>

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        propertyTitle="Furnished bedroom apartment"
      />
    </div>
  );
}

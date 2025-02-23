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
    <div className="flex flex-col h-full">
      {/* Chat Header - Fixed */}
      <div className="px-4 py-3 border-b flex items-center z-10 bg-white">
        <div className="flex-1 flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
            <Image
              src={conversation?.other_user?.profile_picture || "/assets/images/avatar-placeholder.jpg"}
              alt={`${conversation?.other_user?.first_name} ${conversation?.other_user?.last_name}`}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
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
          className="p-2 text-gray-600 hover:text-gray-800"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
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
              const showDate = index === 0 || 
                new Date(message.created_at).toDateString() !== 
                new Date(messages[index - 1].created_at).toDateString();

              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="text-center my-4 flex items-center justify-center">
                      <div className="border-t border-gray-200 w-full" />
                      <span className="text-sm text-gray-500 px-4 whitespace-nowrap">
                        {new Date(message.created_at).toDateString() === new Date().toDateString() 
                          ? 'Today'
                          : new Date(message.created_at).toLocaleDateString()}
                      </span>
                      <div className="border-t border-gray-200 w-full" />
                    </div>
                  )}
                  <div
                    className={`flex ${
                      message.sender_id === user?.id ? "justify-end" : "justify-start"
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
                        {message.content}
                      </div>
                      <div className={`flex items-center mt-1 text-xs text-gray-500 ${
                        message.sender_id === user?.id ? "justify-end" : "justify-start"
                      }`}>
                        {new Date(message.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {message.pending && " • Sending..."}
                        {isLastMessage && message.sender_id === user?.id && message.read && (
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
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input - Fixed */}
      <div className="p-4 border-t bg-white relative">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              placeholder="Are you open to negotiations?"
              className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="group relative">
              <button
                type="button"
                className="p-2 text-gray-600 hover:text-gray-800 relative"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Hoverable Dropup Menu */}
              <div className="absolute bottom-full right-0 mb-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-200">
                <div className="bg-white rounded-lg shadow-lg border p-2 space-y-2 min-w-[160px]">
                  <button 
                    type="button"
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <path d="M21 15l-5-5L5 21"/>
                    </svg>
                    <span>Image</span>
                  </button>
                  <button 
                    type="button"
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <path d="M14 2v6h6"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <line x1="10" y1="9" x2="8" y2="9"/>
                    </svg>
                    <span>Document</span>
                  </button>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim() || !isConnected}
              className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </form>
      </div>

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        propertyTitle={conversation?.property?.title || ""}
      />

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-4 top-16 w-48 bg-white rounded-lg shadow-lg z-50 py-1 border">
            <button
              onClick={handleReport}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              Report
            </button>
            <button
              onClick={handleBlock}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              Block
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

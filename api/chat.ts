import axios from "axios";
import { io, Socket } from 'socket.io-client';
import { Message, Conversation, TypingStatus, UserStatus } from "@/@types/chat";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";




export class ChatService {
  public socket: Socket | null = null;
  private messageHandlers: ((message: Message) => void)[] = [];
  private typingHandlers: ((status: TypingStatus) => void)[] = [];
  private connectionHandlers: ((connected: boolean) => void)[] = [];
  private errorHandlers: ((error: Error) => void)[] = [];
  private userStatusHandlers: ((status: UserStatus) => void)[] = [];
  private connectionPromise: Promise<void> | null = null;

  public async initializeConnection(token: string): Promise<void> {
    // If we already have a connection promise pending, return it
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // If socket is already connected, resolve immediately
    if (this.socket?.connected) {
      console.log("Socket already connected");
      return Promise.resolve();
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      console.log("Initializing socket connection with token");
      
      // Clean up existing socket if any
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
      }

      this.socket = io(API_BASE_URL, {
        auth: { token },
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
        forceNew: true
      });

      // Set up event listeners
      this.socket.on("connect", () => {
        console.log("Socket connected successfully");
        this.notifyConnectionHandlers(true);
        resolve();
      });

      this.socket.on('connect_confirmed', (data: { user_id: string }) => {
        console.log("Connection confirmed for user:", data.user_id);
        // Request status updates for all users after connection is confirmed
        if (this.socket && data.user_id) {
        this.socket.emit('get_user_status', { user_id: data.user_id });
        }
      });

      this.socket.on('new_message', (message) => {
        console.log("New message received:", message);
        this.messageHandlers.forEach(handler => handler(message));
      });
      
      this.socket.on('error', (error) => {
        console.error("Socket error:", error);
        this.errorHandlers.forEach(handler => handler(new Error(error.message || "Unknown socket error")));
      });

      this.socket.on('typing_status', (status) => {
        console.log("Typing status received:", status);
        this.typingHandlers.forEach(handler => handler(status));
      });

      this.socket.on('user_status', (status) => {
        console.log("User status update received:", status);
        if (status && status.user_id && status.status) {
          console.log(`Updating status for user ${status.user_id} to ${status.status}`);
          this.userStatusHandlers.forEach(handler => handler(status));
        } else {
          console.warn("Received invalid user status update:", status);
        }
      });

      this.socket.on('connect_error', (error) => {
        console.error("Socket connection error:", error);
        this.notifyConnectionHandlers(false);
        this.connectionPromise = null;
        reject(error);
      });

      this.socket.on('disconnect', (reason) => {
        console.log("Socket disconnected:", reason);
        this.notifyConnectionHandlers(false);
        this.connectionPromise = null;
        
        // Attempt to reconnect if not intentionally disconnected
        if (reason !== "io client disconnect") {
          console.log("Attempting to reconnect...");
          const token = localStorage.getItem("token");
          if (token) {
            setTimeout(() => {
              this.initializeConnection(token);
            }, 1000);
          }
        }
      });

      // Add timeout
      setTimeout(() => {
        if (!this.socket?.connected) {
          const error = new Error("Connection timeout");
          this.notifyConnectionHandlers(false);
          this.connectionPromise = null;
          reject(error);
        }
      }, 10000);
    });

    return this.connectionPromise;
  }



  public async joinConversation(conversationId: string): Promise<void> {
    console.log("Joining conversation:", conversationId);
    
    // Ensure socket is connected before joining
    if (!this.socket?.connected) {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      await this.initializeConnection(token);
    }

    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error("Socket not connected"));
        return;
      }

      this.socket.emit("join", { conversation_id: conversationId }, (response: any) => {
        if (response?.error) {
          reject(new Error(response.error));
        } else {
          resolve();
        }
      });
    });
  }

  public async sendMessage(
    conversationId: string,
    content: string
  ): Promise<void> {
    console.log(`Attempting to send message to conversation ${conversationId}:`, content);
    
    if (!this.socket?.connected) {
      console.warn("Socket not connected, attempting to reconnect");
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      await this.initializeConnection(token);
      
      // Join the conversation room
      await this.joinConversation(conversationId);
    }
    
    return new Promise((resolve) => {
      // Emit the message with proper structure
      this.socket?.emit("send_message", {
        conversation_id: conversationId,
        content: content
      });
      
      resolve();
    });
  }


  private notifyConnectionHandlers(status: boolean) {
    this.connectionHandlers.forEach((handler) => handler(status));
  }

  public onConnection(handler: (connected: boolean) => void) {
    this.connectionHandlers.push(handler);
    // Call handler immediately with current status
    if (this.socket) {
      handler(this.socket.connected);
    }
    return () => {
      this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler);
    };
  }

  public setTypingStatus(conversationId: string, isTyping: boolean) {
    if (!this.socket?.connected) {
      console.warn("Cannot send typing status: socket not connected");
      return;
    }

    console.log(`Sending typing status for conversation ${conversationId}:`, isTyping);
    this.socket.emit("typing_status", {
      conversation_id: conversationId,
      is_typing: isTyping
    });
  }

  public onTyping(handler: (status: TypingStatus) => void) {
    this.typingHandlers.push(handler);
    return () => {
      this.typingHandlers = this.typingHandlers.filter(h => h !== handler);
    };
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("Socket disconnected manually");
    }
  }

  public onMessage(handler: (message: Message) => void): () => void {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  public onError(handler: (error: Error) => void): () => void {
    this.errorHandlers.push(handler);
    return () => {
      this.errorHandlers = this.errorHandlers.filter(h => h !== handler);
    };
  }

  public onTypingStatus(handler: (status: TypingStatus) => void): () => void {
    if (!this.socket) return () => {};
    
    this.socket.on('typing_status', handler);
    return () => this.socket?.off('typing_status', handler);
  }

  public isSocketConnected(): boolean {
    return this.socket?.connected || false;
  }

  public onNotification(handler: (message: Message) => void): () => void {
    if (!this.socket) return () => {};
    
    this.socket.on('notification', handler);
    return () => this.socket?.off('notification', handler);
  }

  public getUserStatus(userId: string): void {
    if (!this.socket?.connected) {
      console.warn("Cannot get user status: socket not connected");
      return;
    }
    console.log("Requesting status for user:", userId);
    this.socket.emit('get_user_status', { user_id: userId });
  }

  public onUserStatus(handler: (status: UserStatus) => void): () => void {
    console.log("Registering user status handler");
    this.userStatusHandlers.push(handler);
    return () => {
      console.log("Removing user status handler");
      this.userStatusHandlers = this.userStatusHandlers.filter(h => h !== handler);
    };
  }
}

export const chatService = new ChatService();

export const chatApi = {
  async getConversations(): Promise<Conversation[]> {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/chat/conversations`
    );
    return response.data;
  },

  async getConversation(id: string): Promise<Conversation> {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/chat/conversations/${id}`
    );
    return response.data;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/chat/conversations/${conversationId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.error(`Conversation not found: ${conversationId}`);
        return []; // Return empty array for non-existent conversations
      }
      if (error.response?.status === 403) {
        console.error("Unauthorized access to conversation");
        throw new Error(
          "You do not have permission to access this conversation"
        );
      }
      console.error("Error fetching messages:", error);
      throw new Error("Failed to load messages");
    }
  },

  async createConversation(propertyId: string): Promise<Conversation> {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/chat/conversations`,
      null, // no body needed
      {
        params: { property_id: propertyId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  },

  async deleteConversation(conversationId: string): Promise<void> {
    await axios.delete(
      `${API_BASE_URL}/api/v1/chat/conversations/${conversationId}`
    );
  },

};

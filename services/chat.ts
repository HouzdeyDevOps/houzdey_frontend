import { io, Socket } from 'socket.io-client';
import { Message, UserStatus } from '@/@types/chat';
import { showSuccessToast, showErrorToast, showInfoToast } from '../utils/toast';

class ChatService {
  private socket: Socket | null = null;
  private messageHandlers: ((message: Message) => void)[] = [];
  private connectionHandlers: ((connected: boolean) => void)[] = [];
  private typingHandlers: ((status: { user_id: string; conversation_id: string; is_typing: boolean }) => void)[] = [];
  private userStatusHandlers: ((status: UserStatus) => void)[] = [];

  async initializeConnection(token: string): Promise<void> {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000', {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      this.connectionHandlers.forEach(handler => handler(true));
      showSuccessToast('Connected to chat server');
    });

    this.socket.on('disconnect', () => {
      this.connectionHandlers.forEach(handler => handler(false));
      showErrorToast('Disconnected from chat server');
    });

    this.socket.on('new_message', (message: Message) => {
      this.messageHandlers.forEach(handler => handler(message));
    });

    this.socket.on('typing_status', (status) => {
      this.typingHandlers.forEach(handler => handler(status));
    });

    this.socket.on('user_status', (status: UserStatus) => {
      this.userStatusHandlers.forEach(handler => handler(status));
    });

    return new Promise((resolve, reject) => {
      if (!this.socket) {
        showErrorToast('Failed to initialize chat');
        return reject('Socket not initialized');
      }

      this.socket.on('connect_confirmed', () => {
        showSuccessToast('Chat connection established');
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        showErrorToast('Failed to connect to chat server');
        reject(error);
      });
    });
  }

  onUserStatus(handler: (status: UserStatus) => void): () => void {
    this.userStatusHandlers.push(handler);
    return () => {
      this.userStatusHandlers = this.userStatusHandlers.filter(h => h !== handler);
    };
  }

  getUserStatus(userId: string): void {
    if (!this.socket?.connected) return;
    this.socket.emit('get_user_status', { user_id: userId });
  }

  // ... rest of existing methods ...

  isSocketConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const chatService = new ChatService(); 
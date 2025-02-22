"use client";

import { useEffect, useState } from 'react';
import { chatService } from '@/api/chat';
import { Message } from '@/@types/chat';

export default function ChatNotification() {
  const [notifications, setNotifications] = useState<Message[]>([]);

  useEffect(() => {
    const unsubscribe = chatService.onNotification((message) => {
      setNotifications(prev => [...prev, message]);
      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== message.id));
      }, 5000);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {notifications.map((notification) => (
        <div 
          key={notification.id}
          className="bg-white shadow-lg rounded-lg p-4 mb-2 animate-slide-in"
        >
          <p className="font-medium">{notification.sender_id}</p>
          <p className="text-gray-600">{notification.content}</p>
        </div>
      ))}
    </div>
  );
} 
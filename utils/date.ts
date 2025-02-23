import { format, formatDistanceToNow, isToday, parseISO } from 'date-fns';

const adjustTimezone = (dateString: string): Date => {
  // Parse the ISO string to Date
  const date = parseISO(dateString);
  
  // Get the local timezone offset in minutes
  const timezoneOffset = new Date().getTimezoneOffset();
  
  // Subtract the offset since getTimezoneOffset returns positive minutes for negative UTC
  return new Date(date.getTime() - (timezoneOffset * 60000));
};

export const formatMessageTime = (dateString: string) => {
  const date = adjustTimezone(dateString);
  
  if (isToday(date)) {
    return format(date, 'h:mm a'); // e.g., "12:40 PM"
  }
  
  return formatDistanceToNow(date, { addSuffix: true }); // e.g., "2 hours ago"
};

export const formatChatTime = (dateString: string) => {
  const date = adjustTimezone(dateString);
  return format(date, 'h:mm a');
};

export function formatLastSeen(lastSeen: string): string {
    if (!lastSeen) return 'Offline';
    
    const lastSeenDate = new Date(lastSeen);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastSeenDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return lastSeenDate.toLocaleDateString();
} 
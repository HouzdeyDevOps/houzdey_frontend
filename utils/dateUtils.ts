export function formatTimeAgo(date: string | Date): string {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  // For messages older than a week, show the actual date
  return messageDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatMessageTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function isSameDay(date1: string | Date, date2: string | Date): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function formatDateForMessages(date: string | Date): string {
  const messageDate = new Date(date);
  const today = new Date();
  
  if (isSameDay(messageDate, today)) {
    return 'Today';
  }
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(messageDate, yesterday)) {
    return 'Yesterday';
  }
  
  return messageDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDistanceToNow(date: Date | string, options?: { addSuffix?: boolean }): string {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return options?.addSuffix ? 'just now' : 'now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    const suffix = options?.addSuffix ? ' ago' : '';
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''}${suffix}`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    const suffix = options?.addSuffix ? ' ago' : '';
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''}${suffix}`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    const suffix = options?.addSuffix ? ' ago' : '';
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''}${suffix}`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    const suffix = options?.addSuffix ? ' ago' : '';
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''}${suffix}`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  const suffix = options?.addSuffix ? ' ago' : '';
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''}${suffix}`;
} 
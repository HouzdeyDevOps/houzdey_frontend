import { format, formatDistanceToNow, isToday, parseISO } from 'date-fns';

const adjustTimezone = (dateString: string): Date => {
  const date = parseISO(dateString);
  const timezoneOffset = new Date().getTimezoneOffset();
  return new Date(date.getTime() - (timezoneOffset * 60000));
};

export const formatMessageTime = (dateString: string) => {
  const date = adjustTimezone(dateString);
  if (isToday(date)) {
    return format(date, 'h:mm a');
  }
  return formatDistanceToNow(date, { addSuffix: true });
};

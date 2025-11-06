import { Metadata } from 'next';
import NotificationPreferences from '@/components/notifications/NotificationPreferences';

export const metadata: Metadata = {
  title: 'Notification Settings - Houzdey',
  description: 'Manage your notification preferences and settings',
};

export default function NotificationSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationPreferences />
    </div>
  );
} 
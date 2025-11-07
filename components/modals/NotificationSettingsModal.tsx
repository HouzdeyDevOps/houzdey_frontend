"use client";

import React, { useState, useEffect } from 'react';
import { X, Bell, Save } from 'lucide-react';
import axios from '@/lib/axios';
import { showSuccessToast, showErrorToast } from '@/utils/toast';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NotificationPreferences {
  user_id?: string;
  email_enabled: boolean;
  push_enabled: boolean;
  sms_enabled: boolean;
  in_app_enabled: boolean;
  notification_types: {
    property_updates: boolean;
    messages: boolean;
    bookings: boolean;
    reviews: boolean;
    payments: boolean;
    system_announcements: boolean;
    marketing: boolean;
  };
  quiet_hours: {
    enabled: boolean;
    start_time: string;
    end_time: string;
  };
}

const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_enabled: true,
    push_enabled: true,
    sms_enabled: false,
    in_app_enabled: true,
    notification_types: {
      property_updates: true,
      messages: true,
      bookings: true,
      reviews: true,
      payments: true,
      system_announcements: true,
      marketing: false,
    },
    quiet_hours: {
      enabled: false,
      start_time: '22:00',
      end_time: '08:00',
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchPreferences();
    }
  }, [isOpen]);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/notifications/preferences');
      setPreferences(response.data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      // Use default preferences if fetch fails
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put('/api/v1/notifications/preferences', preferences);
      showSuccessToast('Notification preferences saved successfully');
      onClose();
    } catch (error) {
      console.error('Error saving preferences:', error);
      showErrorToast('Failed to save notification preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (section: 'root' | 'types' | 'quiet_hours', key: string) => {
    setPreferences(prev => {
      if (section === 'root') {
        return { ...prev, [key]: !prev[key as keyof NotificationPreferences] };
      } else if (section === 'types') {
        return {
          ...prev,
          notification_types: {
            ...prev.notification_types,
            [key]: !prev.notification_types?.[key as keyof typeof prev.notification_types],
          },
        };
      } else if (section === 'quiet_hours') {
        return {
          ...prev,
          quiet_hours: {
            ...prev.quiet_hours,
            [key]: !prev.quiet_hours?.[key as keyof typeof prev.quiet_hours],
          },
        };
      }
      return prev;
    });
  };

  const handleTimeChange = (field: 'start_time' | 'end_time', value: string) => {
    setPreferences(prev => ({
      ...prev,
      quiet_hours: {
        ...prev.quiet_hours,
        enabled: prev.quiet_hours?.enabled || false,
        start_time: prev.quiet_hours?.start_time || '22:00',
        end_time: prev.quiet_hours?.end_time || '08:00',
        [field]: value,
      },
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Notification Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Notification Methods */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Methods</h3>
                <div className="space-y-4">
                  {[
                    { key: 'email_enabled', label: 'Email notifications', desc: 'Receive notifications via email' },
                    { key: 'push_enabled', label: 'Push notifications', desc: 'Browser and mobile push notifications' },
                    { key: 'sms_enabled', label: 'SMS notifications', desc: 'Text message notifications (charges may apply)' },
                    { key: 'in_app_enabled', label: 'In-app notifications', desc: 'Notifications within the application' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between py-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{label}</h4>
                        <p className="text-sm text-gray-500">{desc}</p>
                      </div>
                      <button
                        onClick={() => handleToggle('root', key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          preferences[key as keyof NotificationPreferences] ? 'bg-indigo-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences[key as keyof NotificationPreferences] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notification Types */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Types</h3>
                <div className="space-y-4">
                  {[
                    { key: 'property_updates', label: 'Property updates', desc: 'New listings, price changes, and availability' },
                    { key: 'messages', label: 'Messages', desc: 'New messages and chat notifications' },
                    { key: 'bookings', label: 'Bookings', desc: 'Booking confirmations and updates' },
                    { key: 'reviews', label: 'Reviews', desc: 'New reviews and ratings' },
                    { key: 'payments', label: 'Payments', desc: 'Payment confirmations and receipts' },
                    { key: 'system_announcements', label: 'System announcements', desc: 'Important platform updates and maintenance' },
                    { key: 'marketing', label: 'Marketing', desc: 'Promotional offers and newsletters' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between py-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{label}</h4>
                        <p className="text-sm text-gray-500">{desc}</p>
                      </div>
                      <button
                        onClick={() => handleToggle('types', key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          preferences.notification_types?.[key as keyof typeof preferences.notification_types]
                            ? 'bg-indigo-600'
                            : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences.notification_types?.[key as keyof typeof preferences.notification_types]
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quiet Hours */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quiet Hours</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Enable quiet hours</h4>
                      <p className="text-sm text-gray-500">Mute non-urgent notifications during specified hours</p>
                    </div>
                    <button
                      onClick={() => handleToggle('quiet_hours', 'enabled')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.quiet_hours?.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.quiet_hours?.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {preferences.quiet_hours?.enabled && (
                    <div className="grid grid-cols-2 gap-4 pl-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start time</label>
                        <input
                          type="time"
                          value={preferences.quiet_hours?.start_time || '22:00'}
                          onChange={(e) => handleTimeChange('start_time', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End time</label>
                        <input
                          type="time"
                          value={preferences.quiet_hours?.end_time || '08:00'}
                          onChange={(e) => handleTimeChange('end_time', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsModal;

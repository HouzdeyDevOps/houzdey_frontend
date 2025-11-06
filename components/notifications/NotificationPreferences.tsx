"use client";

import React, { useState } from 'react';
import { Bell, Settings } from 'lucide-react';

const NotificationPreferences: React.FC = () => {
  const [preferences, setPreferences] = useState({
    emailEnabled: true,
    pushEnabled: true,
    smsEnabled: false,
    propertyAlerts: true,
    chatMessages: true,
    systemUpdates: false,
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 pt-20">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl font-semibold text-gray-900">Notification Settings</h1>
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Methods</h2>
            <div className="space-y-4">
              {[
                { key: 'emailEnabled', label: 'Email notifications', desc: 'Receive notifications via email' },
                { key: 'pushEnabled', label: 'Push notifications', desc: 'Browser and mobile push notifications' },
                { key: 'smsEnabled', label: 'SMS notifications', desc: 'Text message notifications' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{label}</h3>
                    <p className="text-sm text-gray-500">{desc}</p>
                  </div>
                  <button
                    onClick={() => handleToggle(key as keyof typeof preferences)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences[key as keyof typeof preferences] ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences[key as keyof typeof preferences] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Types</h2>
            <div className="space-y-4">
              {[
                { key: 'propertyAlerts', label: 'Property alerts', desc: 'New listings and price changes' },
                { key: 'chatMessages', label: 'Chat messages', desc: 'New messages and conversations' },
                { key: 'systemUpdates', label: 'System updates', desc: 'App updates and maintenance notices' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{label}</h3>
                    <p className="text-sm text-gray-500">{desc}</p>
                  </div>
                  <button
                    onClick={() => handleToggle(key as keyof typeof preferences)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences[key as keyof typeof preferences] ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences[key as keyof typeof preferences] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences; 
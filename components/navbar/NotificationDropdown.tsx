import React, { useState, useRef, useEffect } from "react";
import { Bell, ChevronRight, EllipsisVertical, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Notificationsdata } from "@/components/Notification_Item/Notifications";

interface NotificationDropdownProps {
  className?: string;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = isClient ? Notificationsdata.length : 0;
  
  // Show limited notifications initially, all when "View All" is clicked
  const visibleNotifications = showAll ? Notificationsdata : Notificationsdata.slice(0, 5);
  const hasMoreNotifications = Notificationsdata.length > 5;

  const handleClearAll = () => {
    // TODO: Implement clear all functionality
    console.log("Clear all notifications");
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    setSettingsOpen(false);
  };

  const handleViewAll = () => {
    setShowAll(true); // Show all notifications in dropdown
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Notification Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Modal */}
      {isClient && isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 w-80 lg:w-96 bg-white rounded-lg shadow-xl border z-50 max-h-[32rem] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setSettingsOpen(!settingsOpen)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <EllipsisVertical className="w-5 h-5 text-gray-500" />
                  </button>
                  
                  {/* Settings Dropdown - moved outside button */}
                  {settingsOpen && (
                    <div className="absolute right-0 top-8 w-48 bg-white border rounded-lg shadow-lg z-10">
                      <button
                        onClick={handleToggleNotifications}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                      >
                        {notificationsEnabled ? "Turn off notifications" : "Turn on notifications"}
                      </button>
                      <button
                        onClick={handleClearAll}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-red-600"
                      >
                        Clear all notifications
                      </button>
                      <Link
                        href="/notification-settings"
                        className="block w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                        onClick={() => {
                          setIsOpen(false);
                          setSettingsOpen(false);
                        }}
                      >
                        Notification settings
                      </Link>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors lg:hidden"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {!notificationsEnabled ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Notifications are turned off</h4>
                  <p className="text-gray-500 text-sm">
                    You will not receive notifications until they are enabled
                  </p>
                </div>
              ) : Notificationsdata.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h4>
                  <p className="text-gray-500 text-sm">
                    You currently have no notifications
                  </p>
                </div>
                             ) : (
                 <div className="divide-y divide-gray-100">
                   {visibleNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative flex-shrink-0">
                          <Image
                            src={notification.image}
                            alt="Notification"
                            width={48}
                            height={48}
                            className="rounded-lg object-cover"
                          />
                          {/* Unread indicator */}
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                              {notification.title}
                            </h4>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {notification.time || notification.date}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.description}
                          </p>
                        </div>
                        
                        <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - View All / Show Less */}
            {Notificationsdata.length > 0 && notificationsEnabled && (
              <div className="border-t p-3">
                {!showAll && hasMoreNotifications ? (
                  <button
                    onClick={handleViewAll}
                    className="block w-full text-center py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors"
                  >
                    View all notifications ({Notificationsdata.length})
                  </button>
                ) : showAll ? (
                  <button
                    onClick={() => setShowAll(false)}
                    className="block w-full text-center py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    Show less
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown; 
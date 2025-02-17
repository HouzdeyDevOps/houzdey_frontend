"use client";
import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const declineNonEssential = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    // <div className="fixed bottom-0 left-0 right-0 bg-white text-black dark:bg-background dark:text-white border-t shadow-lg p-4 z-50">
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-4 z-50 ">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <p>
            We use cookies and other technologies to personalize content and provide an optimized experience. 
            Some cookies are required for the site to function.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={declineNonEssential}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300"
          >
            Essential Only
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
} 
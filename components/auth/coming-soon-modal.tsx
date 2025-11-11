"use client";

import React from "react";
import { X, Clock } from "lucide-react";

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: "Facebook" | "Apple";
}

export default function ComingSoonModal({
  isOpen,
  onClose,
  provider,
}: ComingSoonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
            <Clock className="h-8 w-8 text-indigo-600" />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Coming Soon!
          </h3>

          <p className="text-gray-600 mb-6">
            {provider} login is currently under development. We're working hard
            to bring you more sign-in options soon.
          </p>

          <div className="bg-indigo-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-indigo-700">
              In the meantime, you can sign up with:
            </p>
            <ul className="mt-2 text-sm text-indigo-600 space-y-1">
              <li>✓ Email & Password</li>
              <li>✓ Google Account</li>
            </ul>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

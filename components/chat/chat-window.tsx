"use client";

import { MoreVertical, Plus, Send } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ReportModal from "./report-modal";

export default function ChatWindow() {
  const [message, setMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleMoreClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleReport = () => {
    setShowReportModal(true);
    setShowDropdown(false);
  };

  const handleBlock = () => {
    // Implement block functionality
    setShowDropdown(false);
  };

  return (
    <>
      {/* Chat Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src="/assets/images/avatar-placeholder.jpg"
                alt="James Mark"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-semibold">James Mark</h2>
              <p className="text-sm text-gray-500">
                Furnished bedroom apartment
              </p>
            </div>
          </div>
          <button
            onClick={handleMoreClick}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              {/* Overlay to close dropdown when clicking outside */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />

              <div className="absolute right-4 top-14 mt-2 w-32 bg-white rounded-lg shadow-lg z-20 py-2 border">
                <button
                  onClick={handleReport}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  Report
                </button>
                <button
                  onClick={handleBlock}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  Block
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex justify-end">
          <div className="bg-indigo-600 text-white rounded-lg p-3 max-w-[70%]">
            <p>Good day Mark, I need more information on the property</p>
            <span className="text-xs text-gray-300 block text-right mt-1">
              11:47am
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src="/assets/images/avatar-placeholder.jpg"
              alt="James Mark"
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <div className="space-y-2">
            <div className="bg-white rounded-lg p-3 max-w-[70%]">
              <p>Feel free to ask me any questions</p>
            </div>
            <div className="bg-white rounded-lg p-3 max-w-[70%]">
              <p>Feel free to ask me any questions</p>
            </div>
            <div className="bg-white rounded-lg p-3 max-w-[70%]">
              <p>Feel free to ask me any questions</p>
              <span className="text-xs text-gray-500 block mt-1">11:56am</span>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">Today</div>

        <div className="flex justify-end">
          <div className="bg-indigo-600 text-white rounded-lg p-3 max-w-[70%]">
            <p>Good day Mark, I need more information on the property</p>
          </div>
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white border-t">
        <form className="flex items-center gap-2">
          <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
            <Plus className="w-5 h-5" />
          </button>
          <input
            type="text"
            placeholder="Are you open to negotiations?"
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        propertyTitle="Furnished bedroom apartment"
      />
    </>
  );
}

"use client";

import { X } from "lucide-react";
import { useState } from "react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
}

export default function ReportModal({ isOpen, onClose, propertyTitle }: ReportModalProps) {
  const [reportReason, setReportReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [charCount, setCharCount] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle report submission
    onClose();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= 100) {
      setOtherReason(text);
      setCharCount(text.length);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Report for {propertyTitle}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-gray-800 mb-2">Report reason</label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="">None</option>
              <option value="spam">Spam</option>
              <option value="inappropriate">Inappropriate content</option>
              <option value="scam">Potential scam</option>
              <option value="fake">Fake listing</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-800 mb-2">Other reason</label>
            <textarea
              placeholder="Please enter your report"
              value={otherReason}
              onChange={handleTextChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none h-32"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {charCount}/100
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Send report
          </button>
        </form>
      </div>
    </div>
  );
} 
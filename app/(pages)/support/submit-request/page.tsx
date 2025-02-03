"use client";

import { useState } from 'react';

export default function SubmitRequestPage() {
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    description: '',
    attachments: [] as File[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...Array.from(e.target.files || [])]
      }));
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-8">Submit a Request</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Subject</label>
          <input
            type="text"
            value={formData.subject}
            onChange={e => setFormData({...formData, subject: e.target.value})}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            placeholder="Brief description of your issue"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Category</label>
          <select
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            required
          >
            <option value="">Select a category</option>
            <option value="technical">Technical Issue</option>
            <option value="billing">Billing</option>
            <option value="account">Account</option>
            <option value="listing">Listing</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 min-h-[150px]"
            placeholder="Detailed description of your issue"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Attachments</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full"
          />
          <p className="text-sm text-gray-500 mt-1">
            Max file size: 10MB. Supported formats: jpg, png, pdf
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
} 
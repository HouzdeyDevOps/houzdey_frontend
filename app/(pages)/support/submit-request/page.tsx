"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupportTicket } from '@/api/support';
import { Check, AlertCircle, Loader2, Upload, X } from 'lucide-react';

export default function SubmitRequestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    description: '',
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      // Validate file size (max 10MB per file)
      const validFiles = newFiles.filter(file => {
        if (file.size > 10 * 1024 * 1024) {
          setError(`File ${file.name} exceeds 10MB limit`);
          return false;
        }
        return true;
      });
      setAttachments(prev => [...prev, ...validFiles]);
      setError('');
    }
  };

  const removeFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      // TODO: Upload attachments first and get URLs
      // For now, we'll submit without attachments or with placeholder URLs
      const attachmentUrls: string[] = [];
      
      // If you have an upload service, upload files here
      // for (const file of attachments) {
      //   const url = await uploadFile(file);
      //   attachmentUrls.push(url);
      // }

      await createSupportTicket({
        subject: formData.subject,
        category: formData.category as any,
        description: formData.description,
        attachments: attachmentUrls.length > 0 ? attachmentUrls : undefined,
      });

      setSuccess(true);
      setFormData({ subject: '', category: '', description: '' });
      setAttachments([]);

      // Redirect to tickets page after 2 seconds
      setTimeout(() => {
        router.push('/profile?tab=support');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-2">Submit a Request</h2>
      <p className="text-gray-600 mb-8">
        Need help? Submit a support ticket and our team will get back to you as soon as possible.
      </p>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-900">Request submitted successfully!</p>
            <p className="text-sm text-green-700 mt-1">
              We've received your support ticket. You'll be redirected to your support tickets shortly.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={e => setFormData({...formData, subject: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            placeholder="Brief description of your issue"
            required
            disabled={isSubmitting || success}
            minLength={3}
            maxLength={200}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.subject.length}/200 characters
          </p>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            required
            disabled={isSubmitting || success}
          >
            <option value="">Select a category</option>
            <option value="technical">Technical Issue</option>
            <option value="billing">Billing & Payments</option>
            <option value="account">Account Management</option>
            <option value="listing">Property Listing</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent min-h-[150px] resize-y"
            placeholder="Please provide detailed information about your issue. Include any relevant details such as error messages, steps to reproduce, etc."
            required
            disabled={isSubmitting || success}
            minLength={10}
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum 10 characters. Be as detailed as possible.
          </p>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Attachments (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <label className="cursor-pointer">
              <span className="text-indigo-600 hover:text-indigo-700 font-medium">
                Click to upload
              </span>
              <span className="text-gray-600"> or drag and drop</span>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                disabled={isSubmitting || success}
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              JPG, PNG, PDF, DOC up to 10MB each
            </p>
          </div>

          {attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded flex items-center justify-center">
                      <Upload className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="p-1 hover:bg-gray-200 rounded"
                    disabled={isSubmitting || success}
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || success}
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : success ? (
            <>
              <Check className="w-5 h-5" />
              Submitted
            </>
          ) : (
            'Submit Request'
          )}
        </button>

        <p className="text-sm text-gray-600 text-center">
          Expected response time: <strong>24-48 hours</strong>
        </p>
      </form>
    </div>
  );
} 
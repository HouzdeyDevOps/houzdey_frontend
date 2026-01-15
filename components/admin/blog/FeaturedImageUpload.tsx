"use client";

import { useState } from 'react';
import { Link2, Upload, ImageIcon, Loader2, X } from 'lucide-react';
import { uploadService } from '@/services/upload';
import { toast } from 'sonner';

interface FeaturedImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function FeaturedImageUpload({ value, onChange }: FeaturedImageUploadProps) {
  const [uploadType, setUploadType] = useState<'url' | 'upload'>('url');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should not exceed 10MB');
      return;
    }

    setSelectedFile(file);
    
    // Upload immediately
    setIsUploading(true);
    try {
      const imageUrl = await uploadService.uploadFile(file, 'image', 'blog');
      onChange(imageUrl);
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    setSelectedFile(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Featured Image
      </label>
      
      {/* Toggle between URL and Upload */}
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setUploadType('url')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            uploadType === 'url'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Link2 size={16} className="inline mr-2" />
          Image URL
        </button>
        <button
          type="button"
          onClick={() => setUploadType('upload')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            uploadType === 'upload'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Upload size={16} className="inline mr-2" />
          Upload Image
        </button>
      </div>

      {/* URL Input */}
      {uploadType === 'url' && (
        <div>
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      )}

      {/* File Upload */}
      {uploadType === 'upload' && (
        <div>
          <div className="flex items-center gap-3">
            <label
              htmlFor="featured-image-upload"
              className={`flex-1 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors text-center ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <input
                id="featured-image-upload"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />
              {isUploading ? (
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Loader2 size={20} className="animate-spin" />
                  <span>Uploading...</span>
                </div>
              ) : selectedFile ? (
                <div className="flex items-center justify-center gap-2 text-gray-700">
                  <ImageIcon size={20} />
                  <span className="truncate max-w-xs">{selectedFile.name}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <Upload size={20} />
                  <span>Click to upload or drag and drop</span>
                </div>
              )}
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: JPEG, PNG, GIF, WebP (Max 10MB)
          </p>
        </div>
      )}

      {/* Image Preview */}
      {value && (
        <div className="mt-3 relative inline-block">
          <img 
            src={value} 
            alt="Preview" 
            className="h-40 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 min-w-[44px] min-h-[44px] flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            title="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

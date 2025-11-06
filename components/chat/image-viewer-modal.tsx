import React, { useState } from 'react';
import Image from 'next/image';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageViewerModalProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageViewerModal({ imageUrl, isOpen, onClose }: ImageViewerModalProps) {
  const [scale, setScale] = useState(1);

  if (!isOpen) return null;

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.max(prev - 0.5, 1));
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div className="relative w-[90vw] h-[90vh]">
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={handleZoomOut}
            className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
          >
            <ZoomOut className="w-6 h-6" />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
          >
            <ZoomIn className="w-6 h-6" />
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div 
          className="w-full h-full flex items-center justify-center overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="relative transition-transform duration-200 ease-in-out"
            style={{ 
              transform: `scale(${scale})`,
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          >
            <Image
              src={imageUrl}
              alt="Full size image"
              className="object-contain"
              width={1200}
              height={800}
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                width: 'auto',
                height: 'auto'
              }}
              quality={100}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
} 
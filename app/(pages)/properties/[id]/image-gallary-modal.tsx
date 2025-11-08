"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

interface MediaItem {
  type: 'video' | 'image';
  url: string;
}

interface ImageGalleryModalProps {
  images: string[];
  video?: string;
  initialIndex: number;
  onClose: () => void;
}

export default function ImageGalleryModal({ images, video, initialIndex, onClose }: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Create media array with video first if it exists
  const mediaItems: MediaItem[] = useMemo(() => {
    const items: MediaItem[] = [];
    
    // Add video first if it exists
    if (video) {
      items.push({ type: 'video', url: video });
    }
    
    // Add all images
    images.forEach(img => {
      items.push({ type: 'image', url: img });
    });
    
    return items;
  }, [video, images]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  };

  const previousImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") previousImage();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const currentMedia = mediaItems[currentIndex];

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
      >
        <X className="w-6 h-6" />
      </button>

      <button 
        onClick={previousImage}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <div className="relative max-w-full mx-auto px-4">
        {currentMedia.type === 'video' ? (
          <motion.video
            key={currentMedia.url}
            src={currentMedia.url}
            controls
            autoPlay
            className="max-h-[85vh] max-w-full rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Your browser does not support the video tag.
          </motion.video>
        ) : (
          <motion.img
            key={currentMedia.url}
            src={currentMedia.url}
            alt={`Image ${currentIndex + 1}`}
            className="max-h-[85vh] object-contain rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        )}
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <span className="text-white text-sm">
            {currentIndex + 1} / {mediaItems.length}
          </span>
          <div className="flex gap-1">
            {mediaItems.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <motion.button 
        onClick={nextImage}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ChevronRight className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
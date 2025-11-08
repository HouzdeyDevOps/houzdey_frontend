"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import ImageGalleryModal from "@/app/(pages)/properties/[id]/image-gallary-modal";

interface PropertyImageGalleryProps {
  images: string[];
  title: string;
  video?: string;
}

interface MediaItem {
  type: 'video' | 'image';
  url: string;
}

export default function PropertyImageGallery({
  images,
  title,
  video,
}: PropertyImageGalleryProps) {
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  const renderMediaItem = (item: MediaItem, index: number, isMain: boolean = false) => {
    if (item.type === 'video') {
      return (
        <motion.div
          className={`${isMain ? 'col-span-1' : 'relative'} aspect-[4/3] cursor-pointer relative overflow-hidden rounded-lg bg-black`}
          onClick={() => {
            setSelectedImageIndex(index);
            setShowGallery(true);
          }}
        >
          <video
            src={item.url}
            className="w-full h-full object-cover"
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
            <div className="bg-white/90 rounded-full p-4">
              <Play className="w-8 h-8 text-gray-900" fill="currentColor" />
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <Image
        src={item.url}
        alt={isMain ? title : `${title} ${index + 1}`}
        fill
        className="object-cover hover:opacity-95 transition-opacity"
        priority={isMain}
        sizes={isMain ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
      />
    );
  };

  return (
    <>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Main Media (Video or First Image) */}
        {mediaItems.length > 0 && (
          <motion.div
            className="col-span-1 aspect-[4/3] cursor-pointer relative overflow-hidden rounded-lg"
            onClick={() => {
              setSelectedImageIndex(0);
              setShowGallery(true);
            }}
          >
            {renderMediaItem(mediaItems[0], 0, true)}
          </motion.div>
        )}

        {/* Thumbnail Grid */}
        <motion.div
          className="col-span-1 grid grid-cols-2 gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {mediaItems.slice(1, 5).map((item, index) => (
            <motion.div
              key={index}
              className="relative aspect-[4/3] cursor-pointer group overflow-hidden rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={() => {
                setSelectedImageIndex(index + 1);
                setShowGallery(true);
              }}
            >
              {renderMediaItem(item, index + 1)}
              {index === 3 && mediaItems.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg group-hover:bg-black/60 transition-colors">
                  <span className="text-white text-lg font-medium">
                    +{mediaItems.length - 5} more
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Image Gallery Modal */}
      {showGallery && (
        <ImageGalleryModal
          images={images}
          video={video}
          initialIndex={selectedImageIndex}
          onClose={() => setShowGallery(false)}
        />
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ImageGalleryModal from "@/app/(pages)/properties/[id]/image-gallary-modal";

interface PropertyImageGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyImageGallery({
  images,
  title,
}: PropertyImageGalleryProps) {
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Main Image */}
        <motion.div
          className="col-span-1 aspect-[4/3] cursor-pointer relative overflow-hidden rounded-lg"
          onClick={() => {
            setSelectedImageIndex(0);
            setShowGallery(true);
          }}
        >
          <Image
            src={images[0]}
            alt={title}
            fill
            className="object-cover hover:opacity-95 transition-opacity"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>

        {/* Thumbnail Grid */}
        <motion.div
          className="col-span-1 grid grid-cols-2 gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {images.slice(1, 5).map((image, index) => (
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
              <Image
                src={image}
                alt={`${title} ${index + 2}`}
                fill
                className="object-cover hover:opacity-95 transition-opacity"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              {index === 3 && images.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg group-hover:bg-black/60 transition-colors">
                  <span className="text-white text-lg font-medium">
                    +{images.length - 5} more
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
          initialIndex={selectedImageIndex}
          onClose={() => setShowGallery(false)}
        />
      )}
    </>
  );
}

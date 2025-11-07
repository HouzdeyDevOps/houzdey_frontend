"use client";
import { ChevronLeft, ChevronRight, EllipsisVertical, Heart } from "lucide-react";
import React, { useState } from "react";
import Modal from "@/components/favoriteproperties/Modal"


interface FavoriteCardProps {
  id: number;
  title: string;
  location: string;
  beds: number;
  baths: number;
  price: number;
  images: string[];
}

export default function FavouriteCard({ property }: { property: FavoriteCardProps }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [dropDownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | "delete" | null>(null);
  const [note, setNote] = useState("");

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  const previousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const openModal = (type: "add" | "edit" | "delete") => {
    setModalType(type);
    setModalOpen(true);
  };

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <div
          className="w-full h-full transition-transform duration-500 ease-out flex"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {property.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${property.title} - Image ${index + 1}`}
              className="object-cover w-full h-full transition-transform duration-300 flex-shrink-0"
            />
          ))}
        </div>

        {property.images.length > 1 && isHovered && (
          <>
            <button
              onClick={previousImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
            >
              <ChevronLeft className="w-4 h-4 text-neutral-600" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
            >
              <ChevronRight className="w-4 h-4 text-neutral-600" />
            </button>
          </>
        )}

        <button className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors">
          <Heart className="w-5 h-5 text-neutral-600" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold">{property.title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{property.location}</p>
        <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400 mt-2">
          <span>{property.beds} bed</span>
          <span>•</span>
          <span>{property.baths} bath</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semibold mt-2">₦ {property.price.toLocaleString()}</p>
          <div className="relative">
            <EllipsisVertical className="cursor-pointer" onClick={() => setDropdownOpen(!dropDownOpen)} />
            {dropDownOpen && (
              <> 
              <div
              className="fixed inset-0 bg-black bg-opacity-25 z-10"
              onClick={() => setDropdownOpen(false)} // Close dropdown when overlay is clicked
              >
              </div>
              <div className="absolute right-0 mt-2 w-60 bg-white border rounded-3xl shadow-md z-20">
                <ul className="py-2 text-gray-700">
                  <li key="add-note" className="px-2 py-2 m-2 bg-gray-100 cursor-pointer rounded-lg" onClick={() => openModal("add")}>Add Note</li>
                  <li key="edit-note" className="px-2 py-2 m-2 bg-gray-100 cursor-pointer rounded-lg" onClick={() => openModal("edit")}>Edit Note</li>
                  <li key="delete-listing" className="px-2 py-2 m-2 bg-gray-100 cursor-pointer rounded-lg" onClick={() => openModal("delete")}>Delete Listing</li>
                </ul>
              </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal  */}
      <Modal 
      modalOpen={modalOpen} 
      modalType={modalType} 
      note ={note}
      setNote={setNote}
      setModalOpen={setModalOpen}
      />
        
    </div>
  );
}

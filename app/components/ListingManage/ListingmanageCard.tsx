"use client";
import { Property } from "@/@types/property";
import {
  ChevronLeft,
  ChevronRight,
  Dot,
  EllipsisVertical,
  Heart,
  X,
} from "lucide-react";
import { useState } from "react";
import Map from "./Map";
import UploadImages from "./UploadImages";
import { propertyApi } from "@/api/properties";
import { toast } from "sonner";
import { formatLocation } from "@/utils/formatLocation";

interface ListingManageCardProps {
  property: Property;
  onDelete: (id: string) => void;
  onEdit: (property: Property) => void;
}

export default function ListingManageCard({
  property,
  onDelete,
  onEdit,
}: ListingManageCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [dropDownOpen, setDropdownOpen] = useState(false);
  const [openModal, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const isAvailable = property.status.toLowerCase() === "available";

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await propertyApi.updatePropertyStatus(property.id, newStatus);
      toast.success("Property status updated successfully");
      // Refresh the page to get updated data
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Failed to update property status");
    } finally {
      setDropdownOpen(false);
    }
  };

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <div
          className="w-full h-full transition-transform duration-500 ease-out "
          style={{
            transform: `translateX(-${currentImageIndex * 100}%)`,
            display: "flex",
          }}
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

        {/* Navigation Arrows - Only show when there are multiple images */}
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

        {/* Status Indicator */}
        <div className="absolute bottom-2 right-2 px-8 rounded-xl bg-white flex items-center justify-between">
          <p className="text-black font-medium text-base capitalize">
            {property.status}
          </p>
          <Dot
            className={`${
              isAvailable ? "text-green-600" : "text-yellow-500"
            } h-10 w-10`}
          />
        </div>

        {/* Image Dots Indicator - Only show when there are multiple images */}
        {property.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {property.images.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between p-4">
        <div className="">
          <h3 className="font-semibold">{property.title}</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {formatLocation(property.address)}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            PID: {property.id.slice(0, 6)}
          </p>
        </div>

        <div className="relative">
          <EllipsisVertical
            className="cursor-pointer"
            onClick={() => setDropdownOpen(!dropDownOpen)}
          />
          {dropDownOpen && (
            <>
              <div
                className="fixed inset-0 bg-black bg-opacity-25 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-[330px] bg-white border rounded-3xl shadow-md z-20">
                <ul className="py-2 px-2 text-gray-700">
                  <li
                    className="px-2 py-2 m-2 hover:bg-gray-100 cursor-pointer rounded-lg font-semibold text-base"
                    onClick={() => {
                      onEdit(property);
                      setDropdownOpen(false);
                    }}
                  >
                    Edit listing
                  </li>
                  <li className="px-2 py-2 m-2 hover:bg-gray-100 cursor-pointer rounded-lg pb-5 font-semibold text-base">
                    View details
                  </li>
                  <div className="w-[300px] h-[1px] bg-gray-300 px-2" />
                  <li
                    className="px-2 py-2 m-2 hover:bg-gray-100 cursor-pointer rounded-lg font-semibold text-base"
                    onClick={() => handleStatusUpdate("available")}
                  >
                    Mark as available
                  </li>
                  <li
                    className="px-2 py-2 m-2 hover:bg-gray-100 cursor-pointer rounded-lg font-semibold text-base"
                    onClick={() => handleStatusUpdate("unavailable")}
                  >
                    Mark as unavailable
                  </li>
                  <div className="w-[300px] h-[1px] bg-gray-300 px-2 my-4" />
                  <li
                    className="px-2 py-2 m-2 hover:bg-gray-100 cursor-pointer rounded-lg font-semibold text-base text-red-600"
                    onClick={() => setDeleteOpen(true)}
                  >
                    Delete
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteOpen && (
          <div
            className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-50 min-w-[680px] min-h-[287px]"
            onClick={() => setDeleteOpen(false)}
          >
            <div
              className="bg-white rounded-3xl shadow-lg relative w-[680px] px-11"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-end justify-end pt-11 pl-4 pb-3">
                <button onClick={() => setDeleteOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="pb-10">
                <h1 className="font-semibold text-3xl pb-4">Delete</h1>
                <p className="text-gray-600 font-normal text-base">
                  This will delete{" "}
                  <span className="text-black font-normal text-base">
                    "{property.title}"
                  </span>{" "}
                  from your listings permanently
                </p>
              </div>
              <div className="flex border-t-2 py-10 px-11 gap-4">
                <button
                  className="py-3 px-4 bg-gray-400 w-[291px] h-[44px] rounded-lg"
                  onClick={() => setDeleteOpen(false)}
                >
                  <span className="font-medium text-base">Cancel</span>
                </button>
                <button
                  className="py-3 px-4 bg-red-600 w-[291px] h-[44px] rounded-lg"
                  onClick={() => {
                    onDelete(property.id);
                    setDeleteOpen(false);
                  }}
                >
                  <span className="font-medium text-base text-white">
                    Delete
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

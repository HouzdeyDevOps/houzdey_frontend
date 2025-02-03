"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { getAmenityIcon } from "@/utils/iconUtils";

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PropertyType = "Apartment" | "Bungalow" | "Duplex" | "Mansion" | "Office Space" | "Penthouse";

const propertyTypes: PropertyType[] = [
  "Apartment",
  "Bungalow",
  "Duplex",
  "Mansion",
  "Office Space",
  "Penthouse"
];

const amenities = [
  { name: "Kitchen", icon: "CookingPot" },
  { name: "Garden view", icon: "garden" },
  { name: "Pets allowed", icon: "pets" },
  { name: "Central air conditioning", icon: "ac" },
  { name: "Water heater", icon: "water" },
  { name: "Refrigerator", icon: "fridge" },
  { name: "Security cameras", icon: "security" }
];

export default function CreateListingModal({ isOpen, onClose }: CreateListingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    type: "" as PropertyType,
    price: "",
    amenities: [] as string[],
    description: "",
    images: [] as string[],
    location: "",
    beds: "",
    baths: "",
  });

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-xl mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Create a listing</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pt-4">
          <div className="h-1 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
          <div className="text-sm text-gray-600 mt-1">{step}/4</div>
        </div>

        <div className="p-4">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Property details</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Fill in the highlights of your listing and a captivating description to showcase the property at its best
                </p>
              </div>

              <div>
                <label className="block font-medium mb-1">Property title</label>
                <input
                  type="text"
                  placeholder="Enter property title"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  value={formData.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Property type</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  value={formData.type}
                  onChange={(e) => updateForm("type", e.target.value)}
                >
                  <option value="">Select property type</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Property price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">₦</span>
                  <input
                    type="text"
                    placeholder="Enter price"
                    className="w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    value={formData.price}
                    onChange={(e) => updateForm("price", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Location and Features</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Add the property location and key features
                </p>
              </div>

              <div>
                <label className="block font-medium mb-1">Location</label>
                <input
                  type="text"
                  placeholder="Enter property location"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  value={formData.location}
                  onChange={(e) => updateForm("location", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Bedrooms</label>
                  <input
                    type="number"
                    placeholder="Number of beds"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    value={formData.beds}
                    onChange={(e) => updateForm("beds", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Bathrooms</label>
                  <input
                    type="number"
                    placeholder="Number of baths"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    value={formData.baths}
                    onChange={(e) => updateForm("baths", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Amenities</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Select the amenities available in your property
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {amenities.map((amenity) => (
                  <label
                    key={amenity.name}
                    className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.amenities.includes(amenity.name)
                        ? "border-indigo-600 bg-indigo-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={formData.amenities.includes(amenity.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateForm("amenities", [...formData.amenities, amenity.name]);
                        } else {
                          updateForm(
                            "amenities",
                            formData.amenities.filter((a) => a !== amenity.name)
                          );
                        }
                      }}
                    />
                    {getAmenityIcon(amenity.icon)}
                    <span>{amenity.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Property Description</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Write a detailed description of your property
                </p>
              </div>

              <div>
                <textarea
                  placeholder="Describe your property..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 min-h-[200px] resize-none"
                  value={formData.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  maxLength={100}
                />
                <div className="text-sm text-gray-600 text-right mt-1">
                  {formData.description.length}/100
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Upload Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const imageUrls = files.map(file => URL.createObjectURL(file));
                      updateForm("images", [...formData.images, ...imageUrls]);
                    }}
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer text-gray-600 hover:text-indigo-600"
                  >
                    <div className="space-y-2">
                      <div className="mx-auto w-12 h-12 border-2 border-current rounded-full flex items-center justify-center">
                        <span className="text-2xl">+</span>
                      </div>
                      <div>Click to upload images</div>
                      <div className="text-sm">or drag and drop</div>
                    </div>
                  </label>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          onClick={() => {
                            updateForm(
                              "images",
                              formData.images.filter((_, i) => i !== index)
                            );
                          }}
                          className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Back
            </button>
          )}
          <button
            onClick={step === 4 ? onClose : handleNext}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {step === 4 ? "Create listing" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
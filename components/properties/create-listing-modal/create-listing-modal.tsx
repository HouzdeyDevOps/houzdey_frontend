"use client";

import { useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import {
  PropertyDetailsStep,
  LocationFeaturesStep,
  ReviewStep,
  ImagesStep,
} from "./steps";

import { FormData, PropertyType, StepProps } from "@/@types/create-listing";
import ExitModal from "./exit-modal";
import LoadingModal from "./loading-modal";
import SuccessModal from "./success-modal";

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOTAL_STEPS = 4;

export default function CreateListingModal({
  isOpen,
  onClose,
}: CreateListingModalProps) {
  const [step, setStep] = useState(1);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    type: "" as PropertyType,
    price: "",
    amenities: [
      { name: "Kitchen", icon: "CookingPot" },
      { name: "Garden view", icon: "garden" },
      { name: "Pets allowed", icon: "pets" },
      { name: "Central air conditioning", icon: "ac" },
      { name: "Water heater", icon: "water" },
      { name: "Refrigerator", icon: "fridge" },
      { name: "Security cameras", icon: "security" },
    ],
    description: "",
    images: [],
    location: "",
    beds: "",
    baths: "",
    address: "",
    state: "",
    lga: "",
    ward: "",
    coverImage: null,
    estate: "",
    size: "",
  });

  const updateForm = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // if (validateStep(step)) {
    setStep((prev) => prev + 1);
    // }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return (
          !!formData.title &&
          !!formData.type &&
          !!formData.price &&
          !!formData.amenities &&
          !!formData.description
        );
      case 2:
        return !!formData.location && !!formData.beds && !!formData.baths;
      case 3:
        return formData.amenities.length > 0;
      case 4:
        return !!formData.description && formData.images.length > 0;
      default:
        return false;
    }
  };

  const handleSaveAsDraft = async () => {
    try {
      // Save as draft logic here
      // await saveDraft(formData);
      onClose();
    } catch (error) {
      console.error("Failed to save draft:", error);
    }
  };

  // const handleSubmit = async () => {
  //   // Combine cover image and other images into a single array
  //   const allImages = [
  //     ...(formData.coverImage ? [formData.coverImage] : []),
  //     ...formData.images,
  //   ];

  //   // Create the final property data
  //   const propertyData = {
  //     ...formData,
  //     images: allImages,
  //     // Remove the coverImage field since it's now part of images array
  //     coverImage: undefined,
  //   };

  //   try {
  //     // Make your API call here
  //     // await createProperty(propertyData);

  //     // Close the modal
  //     onClose();

  //     // Optionally show a success message
  //     // toast.success("Property listed successfully!");
  //   } catch (error) {
  //     // Handle error
  //     console.error("Failed to create listing:", error);
  //     // Optionally show an error message
  //     // toast.error("Failed to create listing");
  //   }
  // };

  const handleSubmit = async () => {
    setIsPosting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Your actual API call here
      // await createProperty(formData);

      setIsPosting(false);
      setShowSuccessModal(true);
    } catch (error) {
      setIsPosting(false);
      console.error("Failed to create listing:", error);
    }
  };

  if (!isOpen) return null;

  const stepComponents: Record<number, React.ComponentType<StepProps>> = {
    1: LocationFeaturesStep,
    2: PropertyDetailsStep,
    3: ImagesStep,
    4: (props) => <ReviewStep {...props} setStep={setStep} />,
  };

  const CurrentStep = stepComponents[step];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-center px-5 py-7 border-b relative">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-full absolute left-5"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-xl font-semibold">Create a listing</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full absolute right-5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-8 pt-10">
            <div className="h-1 bg-gray-200 rounded-full">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              />
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {step}/{TOTAL_STEPS}
            </div>
          </div>

          {/* Step Content */}
          <div className="p-8 flex-1 overflow-y-auto">
            <CurrentStep formData={formData} updateForm={updateForm} />
          </div>

          {/* Footer */}
          <div className="px-4 py-7 border-t flex justify-end gap-2">
            {step === TOTAL_STEPS ? (
              <div className="flex justify-between w-full gap-2">
                <button
                  onClick={() => setShowExitModal(true)}
                  className="px-4 py-2 bg-[#F2F2F2] hover:bg-[#E5E5E5] text-gray-600 rounded-lg w-full"
                >
                  Save as draft
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 w-full"
                >
                  Post listing
                </button>
              </div>
            ) : (
              <button
                onClick={handleNext}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      <ExitModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirm={handleSaveAsDraft}
      />
      <LoadingModal isOpen={isPosting} />
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          onClose();
        }}
      />
    </>
  );
}

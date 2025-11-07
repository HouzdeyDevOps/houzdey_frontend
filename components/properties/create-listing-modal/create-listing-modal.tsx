"use client";

import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, X } from "lucide-react";
import {
  PropertyDetailsStep,
  LocationFeaturesStep,
  ReviewStep,
  ImagesStep,
} from "./steps";

import { CreateListingFormData as FormData, PropertyType, StepProps, ListingType } from "@/@types/create-listing";
import { Property } from "@/@types/property";
import ExitModal from "./exit-modal";
import LoadingModal from "./loading-modal";
import SuccessModal from "./success-modal";
import { propertyApi } from "@/api/properties";

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property | null; // Optional property for editing
  mode?: 'create' | 'edit';
}

const TOTAL_STEPS = 4;

export default function CreateListingModal({
  isOpen,
  onClose,
  property = null,
  mode = 'create'
}: CreateListingModalProps) {
  const [step, setStep] = useState(1);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const getInitialFormData = useCallback((): FormData => {
    if (property && mode === 'edit') {
      // Cast property to any to access fields that might exist in the database but not in the type
      const prop = property as any;
      
      return {
        title: property.title || "",
        type: property.type as PropertyType,
        price: property.price?.toString() || "",
        listing_type: property.listing_type || ListingType.RENT,
        rental_price: property.rental_price?.toString() || "",
        sale_price: property.sale_price?.toString() || "",
        agency_fee: property.agency_fee?.toString() || "",
        legal_fee: property.legal_fee?.toString() || "",
        other_fees: property.other_fees?.toString() || "",
        amenities: property.amenities || [],
        description: property.description || "",
        images: property.images || [],
        coverImage: property.images?.[0] || null,
        video: property.video || null,
        beds: property.beds?.toString() || "",
        baths: property.baths?.toString() || "",
        toilets: prop.toilets?.toString() || "",
        condition: prop.condition || "",
        furnishing: prop.furnishing || "",
        address: property.address || "",
        state: property.state || "",
        lga: property.lga || "",
        ward: property.ward || "",
        estate: property.estate || "",
        size: property.size || "",
      };
    }

    return {
      title: "",
      type: PropertyType.Apartment,
      price: "",
      listing_type: ListingType.RENT,
      rental_price: "",
      sale_price: "",
      agency_fee: "",
      legal_fee: "",
      other_fees: "",
      amenities: [],
      description: "",
      images: [],
      coverImage: null,
      video: null,
      beds: "",
      baths: "",
      toilets: "",
      condition: "",
      furnishing: "",
      address: "",
      state: "",
      lga: "",
      ward: "",
      estate: "",
      size: "",
    };
  }, [property, mode]);

  const [formData, setFormData] = useState<FormData>(() => getInitialFormData());

  const updateForm = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear validation error when user makes changes
    setValidationError(null);
  }, []);

  const validateStep = useCallback((currentStep: number): boolean => {
    switch (currentStep) {
      case 1: // Location Features Step
        return !!(formData.state && formData.lga && formData.ward && formData.address);

      case 2: // Property Details Step
        const priceValid = formData.listing_type === ListingType.RENT 
          ? !!(formData.rental_price || formData.price)
          : !!(formData.sale_price || formData.price);
        
        return !!(
          formData.type && 
          priceValid &&
          formData.beds && 
          formData.baths && 
          formData.toilets && 
          formData.condition && 
          formData.furnishing && 
          formData.description &&
          formData.amenities.length > 0
        );

      case 3: // Images Step
        return !!(formData.coverImage && formData.images.length > 0);

      case 4: // Review Step
        return true;

      default:
        return false;
    }
  }, [formData]);

  const handleNext = useCallback(() => {
    const isValid = validateStep(step);
    if (isValid) {
      setValidationError(null);
      setStep(prev => prev + 1);
    } else {
      let errorMessage = "Please fill in all required fields";
      if (step === 2 && formData.amenities.length === 0) {
        errorMessage = "Please select at least one amenity";
      } else if (step === 3) {
        errorMessage = !formData.coverImage 
          ? "Please upload a cover image" 
          : "Please upload at least one additional image";
      }
      setValidationError(errorMessage);
    }
  }, [step, validateStep, formData]);

  const handleBack = useCallback(() => {
    setStep(prev => prev - 1);
    setValidationError(null);
  }, []);

  const handleSaveAsDraft = useCallback(async () => {
    try {
      // Save as draft logic here
      // await saveDraft(formData);
      onClose();
    } catch (error) {
      console.error("Failed to save draft:", error);
    }
  }, [onClose]);

  const handleSubmit = useCallback(async () => {
    setIsPosting(true);
    try {
      // Validate all steps before submission
      for (let currentStep = 1; currentStep <= TOTAL_STEPS; currentStep++) {
        if (!validateStep(currentStep)) {
          setStep(currentStep);
          setIsPosting(false);
          setValidationError("Please complete all required fields");
          return;
        }
      }

      if (mode === 'edit' && property) {
        await propertyApi.updateProperty(property.id, formData);
      } else {
        await propertyApi.createProperty(formData);
      }
      
      setIsPosting(false);
      setShowSuccessModal(true);
      
      // Use a ref for timeout to avoid memory leaks
      // const timeoutId = setTimeout(() => {
      //   onClose();
      //   window.location.reload();
      // }, 2000);

      // return () => clearTimeout(timeoutId);
    } catch (error) {
      setIsPosting(false);
      console.error(`Failed to ${mode === 'edit' ? 'update' : 'create'} listing:`, error);
      setValidationError(`Failed to ${mode === 'edit' ? 'update' : 'create'} listing. Please try again.`);
    }
  }, [formData, validateStep, onClose, mode, property]);

  // Reset form when modal is opened/closed or property changes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setValidationError(null);
      setShowExitModal(false);
      setIsPosting(false);
      setShowSuccessModal(false);
    } else {
      // When modal opens, reset form data based on mode
      setFormData(getInitialFormData());
    }
  }, [isOpen, property, getInitialFormData]);

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
            <h2 className="text-xl font-semibold">
              {mode === 'edit' ? 'Edit listing' : 'Create a listing'}
            </h2>
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
                  {mode === 'edit' ? 'Update listing' : 'Post listing'}
                </button>
              </div>
            ) : (
              <button
                onClick={handleNext}
                disabled={!validateStep(step)}
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
        mode={mode}
        onClose={() => {
          setShowSuccessModal(false);
          // refresh page
          window.location.reload();
          onClose();
        }}
      />
    </>
  );
}


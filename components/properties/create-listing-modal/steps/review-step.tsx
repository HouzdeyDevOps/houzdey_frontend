import React from "react";
import { StepProps, CreateListingFormData as FormData } from "@/@types/create-listing";
import { ChevronRight } from "lucide-react";
import { getAmenityIcon } from "@/utils/iconUtils";
import { generatePropertyTitle } from "@/utils/generatePropertyTitle";

interface ReviewStepProps extends StepProps {
  formData: FormData;
  setStep: (step: number) => void;
}

const ReviewStep = ({ formData, setStep }: ReviewStepProps) => {
  const handleEdit = (step: number) => {
    setStep(step);
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(Number(price));
  };

  const reviewSections = [
    {
      title: "Property title",
      value: generatePropertyTitle(formData),
      step: 2,
    },
    {
      title: "Property type",
      value: formData.type,
      step: 2,
    },
    {
      title: "Property price",
      value: formatPrice(formData.price),
      step: 2,
    },
    {
      title: "Estate name",
      value: formData.estate,
      step: 2,
    },
    {
      title: "Property size",
      value: formData.size ? `${formData.size} sqm` : null,
      step: 2,
    },
    ...(formData.agency_fee ? [{
      title: "Agency Fee",
      value: formatPrice(formData.agency_fee),
      step: 2,
    }] : []),
    ...(formData.legal_fee ? [{
      title: "Legal Fee",
      value: formatPrice(formData.legal_fee),
      step: 2,
    }] : []),
    ...(formData.other_fees ? [{
      title: "Other Fees",
      value: formatPrice(formData.other_fees),
      step: 2,
    }] : []),
    {
      title: "Amenities",
      value: formData.amenities.map((a) => a.name).join(", "),
      step: 2,
    },
    {
      title: "Property description",
      value: formData.description,
      step: 2,
    },
    {
      title: "State",
      value: formData.state,
      step: 1,
    },
    {
      title: "LGA",
      value: formData.lga,
      step: 1,
    },
    {
      title: "Street",
      value: formData.address,
      step: 1,
    },
  ];

  const renderAmenities = () => (
    <div className="flex flex-wrap gap-2">
      {formData.amenities.map((amenity, index) => (
        <div
          key={index}
          className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg"
        >
          {getAmenityIcon(amenity.icon)}
          <span className="text-sm">{amenity.name}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Review listing</h3>
        <p className="text-gray-600 text-sm">This is how your post will look</p>
      </div>

      {/* Preview Image */}
      <div className="relative aspect-square rounded-lg overflow-hidden">
        <img
          src={formData.coverImage || formData.images[0]}
          alt="Property"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Property Details */}
      <div className="space-y-4">
        {reviewSections.map((section, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <div className="flex-1">
              <p className="text-gray-500 text-sm">{section.title}</p>
              {section.title === "Amenities" ? (
                renderAmenities()
              ) : (
                <p className="font-medium">{section.value || "Not specified"}</p>
              )}
            </div>
            <button
              onClick={() => handleEdit(section.step)}
              className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg flex items-center gap-1 ml-4"
            >
              Edit
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Other Images */}
      <div className="space-y-2">
        <h4 className="font-medium">Other images</h4>
        <div className="grid grid-cols-4 gap-2">
          {formData.images.map((image, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg overflow-hidden"
            >
              <img
                src={image}
                alt={`Property ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;

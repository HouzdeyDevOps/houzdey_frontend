import React, { useState, useEffect } from "react";
import { StepProps, CreateListingFormData as FormData } from "@/@types/create-listing";
import { ChevronDown } from "lucide-react";
import { generatePropertyTitle } from "@/utils/generatePropertyTitle";
import { useLGAs, useStates, useWards } from "@/hooks/useLocations";

interface LocationFeaturesStepProps extends StepProps {
  formData: FormData;
  updateForm: (field: string, value: any) => void;
}

const LocationFeaturesStep = ({
  formData,
  updateForm,
}: LocationFeaturesStepProps) => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedLGA, setSelectedLGA] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { data: states = [], isLoading: statesLoading } = useStates();
  const { data: lgas = [] } = useLGAs(selectedState);
  const { data: wards = [] } = useWards(selectedState, selectedLGA);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedLGA("");
    setSelectedWard("");
    updateForm("state", state);
  };

  const handleLGAChange = (lga: string) => {
    setSelectedLGA(lga);
    setSelectedWard("");
    updateForm("lga", lga);
  };

  const handleWardChange = (ward: string) => {
    setSelectedWard(ward);
    updateForm("ward", ward);
    updateForm("lga", selectedLGA);
    updateForm("state", selectedState);

    // Generate and update title
    const updatedFormData = {
      ...formData,
      ward,
      lga: selectedLGA,
      state: selectedState,
    };
    const generatedTitle = generatePropertyTitle(updatedFormData);
    updateForm("title", generatedTitle);
  };

  const markAsTouched = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field: keyof FormData) => {
    if (touched[field] && !formData[field]) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">Location and Features</h3>
        <p className="text-gray-600 text-sm mb-4">
          Add the property location and key features
        </p>
      </div>

      <div className="space-y-4">
        {/* State Selection */}
        <div>
          <label className="block font-medium mb-1">
            State
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => {
                handleStateChange(e.target.value);
                markAsTouched("state");
              }}
              onBlur={() => markAsTouched("state")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 appearance-none ${
                touched["state"] && !formData.state ? "border-red-300" : "border-gray-300"
              }`}
            >
              <option value="">Select State</option>
              {states?.map((state: string) => (
                <option key={state} value={state}>
                  {state.charAt(0).toUpperCase() + state.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            {getFieldError("state") && (
              <p className="text-red-600 text-xs mt-1">{getFieldError("state")}</p>
            )}
          </div>
        </div>

        {/* LGA Selection */}
        <div>
          <label className="block font-medium mb-1">
            Local Government Area
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <select
              value={selectedLGA}
              onChange={(e) => {
                handleLGAChange(e.target.value);
                markAsTouched("lga");
              }}
              onBlur={() => markAsTouched("lga")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 appearance-none ${
                touched["lga"] && !formData.lga ? "border-red-300" : "border-gray-300"
              }`}
              disabled={!selectedState}
            >
              <option value="">Select LGA</option>
              {lgas?.map((lga: string) => (
                <option key={lga} value={lga}>
                  {lga
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            {getFieldError("lga") && (
              <p className="text-red-600 text-xs mt-1">{getFieldError("lga")}</p>
            )}
          </div>
        </div>

        {/* Ward Selection */}
        <div>
          <label className="block font-medium mb-1">
            Area
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <select
              value={selectedWard}
              onChange={(e) => {
                handleWardChange(e.target.value);
                markAsTouched("ward");
              }}
              onBlur={() => markAsTouched("ward")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 appearance-none ${
                touched["ward"] && !formData.ward ? "border-red-300" : "border-gray-300"
              }`}
              disabled={!selectedLGA}
            >
              <option value="">Select Area</option>
              {wards.map((ward: string) => (
                <option key={ward} value={ward}>
                  {ward
                    .split("-")
                    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            {getFieldError("ward") && (
              <p className="text-red-600 text-xs mt-1">{getFieldError("ward")}</p>
            )}
          </div>
        </div>

        {/* Property Address */}
        <div>
          <label className="block font-medium mb-1">
            Property Address
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter detailed Property address"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
              touched["address"] && !formData.address ? "border-red-300" : "border-gray-300"
            }`}
            value={formData.address || ""}
            onChange={(e) => {
              updateForm("address", e.target.value);
              markAsTouched("address");
            }}
            onBlur={() => markAsTouched("address")}
          />
          {getFieldError("address") && (
            <p className="text-red-600 text-xs mt-1">{getFieldError("address")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationFeaturesStep;

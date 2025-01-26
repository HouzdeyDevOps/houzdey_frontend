import React, { useState, useEffect } from "react";
import { StepProps, FormData } from "@/@types/create-listing";
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

  const { data: states = [], isLoading: statesLoading } = useStates();
  const { data: lgas = [] } = useLGAs(selectedState);
  const { data: wards = [] } = useWards(selectedState, selectedLGA);



  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedLGA("");
    setSelectedWard("");
  };

  const handleLGAChange = (lga: string) => {
    setSelectedLGA(lga);
    setSelectedWard("");
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


  // if (statesLoading) {
  //   return <div>Loading locations...</div>;
  // }


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
          <label className="block font-medium mb-1">State</label>
          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 appearance-none"
            >
              <option value="">Select State</option>
              {states?.map((state: string) => (
                <option key={state} value={state}>
                  {state.charAt(0).toUpperCase() + state.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* LGA Selection */}
        <div>
          <label className="block font-medium mb-1">
            Local Government Area
          </label>
          <div className="relative">
            <select
              value={selectedLGA}
              onChange={(e) => handleLGAChange(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 appearance-none"
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
          </div>
        </div>

        {/* Ward Selection */}
        <div>
          <label className="block font-medium mb-1">Area</label>
          <div className="relative">
            <select
              value={selectedWard}
              onChange={(e) => handleWardChange(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 appearance-none"
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
          </div>
        </div>

        {/* Property Address */}
        <div>
          <label className="block font-medium mb-1">Property Address</label>
          <input
            type="text"
            placeholder="Enter detailed Property address"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            value={formData.address || ""}
            onChange={(e) => updateForm("address", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default LocationFeaturesStep;

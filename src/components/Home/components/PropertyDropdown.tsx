import React, { useEffect, useState } from "react";
import { Button, Flex, Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { ChevronDownIcon } from "lucide-react";
import {
  bathroomOptions,
  bedroomOptions,
  conditionList,
  facilitiesList,
  furnishingList,
  propertytypes,
} from "../../../contents/data";

interface PropertyDropdownProps {
  title: string;
  handlePriceChange?: (type: "min" | "max", value: string) => void;
  priceRange?: { min: string; max: string };
  handlePropertyTypeChange?: (value: string) => void;
  selectedPropertyType?: string;
  handleBedsAndBathsChange?: (
    type: "bedrooms" | "bathrooms",
    value: string
  ) => void;
  bedrooms?: string;
  bathrooms?: string;
  handleMoreFiltersChange?: (
    type: "furnishing" | "condition",
    value: string
  ) => void;
  handleFacilitiesChange?: (facilities: string[]) => void;
  furnishing?: string;
  condition?: string;
  facilities?: string[];
  handleApply: () => void;
}

const PropertyDropdown: React.FC<PropertyDropdownProps> = ({
  title,
  handlePriceChange,
  priceRange,
  handlePropertyTypeChange,
  selectedPropertyType,
  handleBedsAndBathsChange,
  bedrooms,
  bathrooms,
  handleMoreFiltersChange,
  handleFacilitiesChange,
  furnishing,
  condition,
  facilities,
  handleApply,
}) => {
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);
  const [localPropertyType, setLocalPropertyType] =
    useState(selectedPropertyType);
  const [localBedrooms, setLocalBedrooms] = useState(bedrooms);
  const [localBathrooms, setLocalBathrooms] = useState(bathrooms);
  const [localFurnishing, setLocalFurnishing] = useState(furnishing);
  const [localCondition, setLocalCondition] = useState(condition);
  const [localFacilities, setLocalFacilities] = useState<string[]>(
    facilities || []
  );

  useEffect(() => {
    setLocalPriceRange(priceRange);
    setLocalPropertyType(selectedPropertyType);
    setLocalBedrooms(bedrooms);
    setLocalBathrooms(bathrooms);
    setLocalFurnishing(furnishing);
    setLocalCondition(condition);
    setLocalFacilities(facilities || []);
  }, [
    priceRange,
    selectedPropertyType,
    bedrooms,
    bathrooms,
    furnishing,
    condition,
    facilities,
  ]);

  const handleLocalApply = () => {
    if (title === "Price" && handlePriceChange) {
      handlePriceChange("min", localPriceRange?.min || "");
      handlePriceChange("max", localPriceRange?.max || "");
    } else if (title === "Property Type" && handlePropertyTypeChange) {
      handlePropertyTypeChange(localPropertyType || "");
    } else if (title === "Beds & Baths" && handleBedsAndBathsChange) {
      handleBedsAndBathsChange("bedrooms", localBedrooms || "");
      handleBedsAndBathsChange("bathrooms", localBathrooms || "");
    } else if (title === "More") {
      if (handleMoreFiltersChange) {
        handleMoreFiltersChange("furnishing", localFurnishing || "");
        handleMoreFiltersChange("condition", localCondition || "");
      }
      if (handleFacilitiesChange) {
        handleFacilitiesChange(localFacilities);
      }
    }
    handleApply();
  };
  const handleFacilityChange = (facility: string) => {
    setLocalFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility]
    );
  };

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            isActive={isOpen}
            as={Button}
            variant="outline"
            colorScheme="#4f46e5"
            _hover={{
              background: "white",
              color: "#4f46e5",
            }}
          >
            <Flex gap="2" alignItems="center">
              {title}
              <ChevronDownIcon
                size={16}
                className={isOpen ? "rotate-180" : "rotate-0"}
              />
            </Flex>
          </MenuButton>
          <MenuList
            bg="white"
            border="1px"
            borderColor="gray.200"
            boxShadow="md"
            borderRadius="md"
            p={4}
          >
            {title === "Price" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Price Range</h3>
                <div className="flex items-center space-x-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Minimum</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="input input-bordered w-full max-w-xs"
                      value={localPriceRange?.min}
                      onChange={(e) =>
                        setLocalPriceRange((prev) => ({
                          ...prev,
                          min: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Maximum</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="input input-bordered w-full max-w-xs"
                      value={localPriceRange?.max}
                      onChange={(e) =>
                        setLocalPriceRange((prev) => ({
                          ...prev,
                          max: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <button
                  className="btn btn-primary w-full"
                  onClick={handleLocalApply}
                >
                  Apply
                </button>
              </div>
            )}

            {title === "Property Type" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Home Type</h3>
                <div className="grid grid-cols-2 gap-4">
                  {propertytypes.map((propertyType) => (
                    <Checkbox
                      key={propertyType}
                      label={propertyType}
                      checked={localPropertyType === propertyType}
                      onChange={() => setLocalPropertyType(propertyType)}
                    />
                  ))}
                </div>
                <button
                  className="btn btn-primary w-full"
                  onClick={handleLocalApply}
                >
                  Apply
                </button>
              </div>
            )}

            {title === "Beds & Baths" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Bedrooms</h3>
                  <div className="flex space-x-2">
                    {bedroomOptions.map((option) => (
                      <CustomButton
                        key={option}
                        onClick={() => setLocalBedrooms(option)}
                        primary={localBedrooms === option}
                      >
                        {option}
                      </CustomButton>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Bathrooms</h3>
                  <div className="flex space-x-2">
                    {bathroomOptions.map((option) => (
                      <CustomButton
                        key={option}
                        onClick={() => setLocalBathrooms(option)}
                        primary={localBathrooms === option}
                      >
                        {option}
                      </CustomButton>
                    ))}
                  </div>
                </div>
                <button
                  className="btn btn-primary w-full"
                  onClick={handleLocalApply}
                >
                  Apply
                </button>
              </div>
            )}

            {title === "More" && (
              <div className="space-y-4">
                <div className="flex space-x-14 mb-2">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Condition</h3>
                    {conditionList.map((conditionOption) => (
                      <Checkbox
                        key={conditionOption}
                        label={conditionOption}
                        checked={localCondition === conditionOption}
                        onChange={() => setLocalCondition(conditionOption)}
                      />
                    ))}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Furnishing</h3>
                    {furnishingList.map((furnishingOption) => (
                      <Checkbox
                        key={furnishingOption}
                        label={furnishingOption}
                        checked={localFurnishing === furnishingOption}
                        onChange={() => setLocalFurnishing(furnishingOption)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Facilities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {facilitiesList.map((facility) => (
                      <Checkbox key={facility} label={facility} 
                      checked={localFacilities.includes(facility)}
                      onChange={() => handleFacilityChange(facility)}
                      
                      
                      />
                    ))}
                  </div>
                </div>
                <button
                  className="btn btn-primary w-full"
                  onClick={handleLocalApply}
                >
                  Apply
                </button>
              </div>
            )}
          </MenuList>
        </>
      )}
    </Menu>
  );
};

const Checkbox: React.FC<{
  label: string;
  checked: boolean;
}> = ({ label, checked }) => (
  <label className="flex items-center space-x-2 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      className="form-checkbox h-5 w-5 text-blue-600"
    />
    <span className="text-gray-700">{label}</span>
  </label>
);

const CustomButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
}> = ({ children, onClick, primary = false }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded ${
      primary ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
    }`}
  >
    {children}
  </button>
);

export default PropertyDropdown;

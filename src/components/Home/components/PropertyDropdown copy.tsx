import { Button, Flex, Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

interface PropertyDropdownProps {
  handlePriceChange: (type: "min" | "max", value: string) => void;
  priceRange: {
    min: string;
    max: string;
  };
  title: string;
}

const propertytypes = [
  "Apartment",
  "House",
  "Bungalow",
  "Duplex",
  "Room & Parlour",
  "Shared Apartment",
  "Block of Flats",
  "Mini Flat",
  "Bedsitter",
  "Chalet",
  "Condo",
  "Farm House",
  "Maisonette",
  "Mansion",
  "Penthouse",
  "Studio Apartment",
  "Townhouse / Terrace",
  "Villa",
];

const conditionList = ["Fairly Used", "Newly-Built", "Old", "Renovated"];

const furnishingList = ["Furnished", "Partly Furnished", "Unfurnished"];

const facilitiesList = [
  "Balcony",
  "Kitchen Cabinets",
  "Pop Ceiling",
  "Tiled Floor",
  "Wardrobe",
  "24-hour Electricity",
  "Air Conditioning",
  "Running water",
  "Apartment",
  "Chandelier",
  "Dining Area",
  "Dishwasher",
  "Hot Water",
  "Kitchen Shelf",
  "Microwave",
  "Pre-Paid Meter",
  "Refrigerator",
  "TV",
  "Wi-Fi",
];

const bedroomOptions = ["1", "2", "3", "4", "5", "6"];

const bathroomOptions = ["1", "2", "3", "4", "5", "6"];

const PropertyDropdown = ({
  title,
  handlePriceChange,
  priceRange,
}: PropertyDropdownProps) => {
  const [propertyTypes, setPropertyTypes] = useState("");

  const handlePropertyTypeChange = (key) => {
    setPropertyTypes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [bedrooms, setBedrooms] = useState("Any");
  const [bathrooms, setBathrooms] = useState("Any");

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
            <Flex gap="2" alignItems={"center"}>
              {isOpen ? title : title}
              {isOpen ? (
                <ChevronDownIcon size={16} className="rotate-180" />
              ) : (
                <ChevronDownIcon size={16} className="rotate-0" />
              )}
            </Flex>
          </MenuButton>
          <MenuList
            bg="none"
            border={"none"}
            outline={"none"}
            boxShadow="none"
            // width={"100%"}
            // height={32}
          >
            <section className="dropdown-content card card-compact bg-white z-[1] h-auto p-4 drop-shadow-lg">
              {/* Price */}
              {title === "Price" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Price Range</h3>
                  <div className="flex items-center space-x-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Minimum</span>
                      </label>
                      <select
                        value={priceRange.min}
                        onChange={(e) =>
                          handlePriceChange("min", e.target.value)
                        }
                        className="select select-bordered w-full"
                      >
                        <option>No Min</option>
                        <option>$500</option>
                        <option>$1000</option>
                        <option>$1500</option>
                        <option>$1500</option>
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Maximum</span>
                      </label>
                      <select
                        value={priceRange.max}
                        onChange={(e) =>
                          handlePriceChange("max", e.target.value)
                        }
                        className="select select-bordered w-full"
                      >
                        <option>No Max</option>
                        <option>$1000</option>
                        <option>$2000</option>
                        <option>$3000</option>
                      </select>
                    </div>
                  </div>
                  <button className="btn btn-primary mt-4 w-full">Apply</button>
                </div>
              )}

              {/* Property Type */}
              {title === "Property Type" && (
                <div className="space-y-4">
                  <div className="w-56">
                    <h2 className="text-lg font-semibold">Home Type</h2>
                    {propertytypes.map((propertytype) => (
                      <Checkbox
                        key={propertytype}
                        label={propertytype}
                        // checked={propertyTypes[propertytype.toLowerCase()]}
                        onChange={() =>
                          handlePropertyTypeChange(propertytype.toLowerCase())
                        }
                      />
                    ))}
                  </div>
                  <button className="btn btn-primary mt-4 w-full">Apply</button>
                </div>
              )}
              {/* Beds & Baths */}
              {title === "Beds & Baths" && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Number of Bedrooms
                    </h2>
                    <div className="flex space-x-2 mt-2">
                      {bedroomOptions.map((option) => (
                        <CustomButton
                          key={option}
                          onClick={() => setBedrooms(option)}
                          primary={bedrooms === option}
                        >
                          {option}
                        </CustomButton>
                      ))}
                      <input
                        type="text"
                        placeholder="bedrooms"
                        className="input input-bordered w-32 max-w-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">
                      Number of Bathrooms
                    </h2>
                    <div className="flex space-x-2 mt-2">
                      {bathroomOptions.map((option) => (
                        <CustomButton
                          key={option}
                          onClick={() => setBathrooms(option)}
                          primary={bathrooms === option}
                        >
                          {option}
                        </CustomButton>
                      ))}
                      <input
                        type="text"
                        placeholder="bedrooms"
                        className="input input-bordered w-32 max-w-xs"
                      />
                    </div>
                  </div>
                  <button className="btn btn-primary mt-4">Apply</button>
                </div>
              )}

              {/* More */}
              {title === "More" && (
                <div className="w-80">
                  <div className="flex space-x-10 mb-5 w-full">
                    {/* condition */}
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-lg font-semibold">Condition</h2>

                        {conditionList.map((condition) => (
                          <Checkbox
                            key={condition}
                            label={condition}
                            checked={false}
                            onChange={() => {}}
                          />
                        ))}
                      </div>
                    </div>
                    {/* Furnishing */}
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-lg font-semibold">Furnishing</h2>
                        {furnishingList.map((furnishing) => (
                          <Checkbox
                            key={furnishing}
                            label={furnishing}
                            checked={false}
                            onChange={() => {}}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div className="space-y-4 ">
                    <div className="">
                      <h2 className="text-lg font-semibold">Facilities</h2>

                      {facilitiesList.map((facility) => (
                        <Checkbox
                          key={facility}
                          label={facility}
                          checked={false}
                          onChange={() => {}}
                        />
                      ))}
                    </div>
                  </div>
                  <button className="btn btn-primary mt-4 w-full">Apply</button>
                </div>
              )}
            </section>
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export default PropertyDropdown;

// Checkbox component
const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex items-center space-x-2 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="form-checkbox h-5 w-5 text-blue-600"
    />
    <span className="text-gray-700">{label}</span>
  </label>
);

// Button component
const CustomButton = ({ children, onClick, primary = false }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded ${
      primary ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
    }`}
  >
    {children}
  </button>
);

import React from "react";
// import { PropertyTypeArray } from "@/@types/create-listing";
import { getAmenityIcon } from "@/utils/iconUtils";
import { amenities } from "@/constants/amenities";
import { PropertyType, PropertyTypeArray, CreateListingFormData, ListingType } from "@/@types/create-listing";

interface PropertyDetailsStepProps {
  formData: CreateListingFormData;
  updateForm: (field: string, value: any) => void;
}

// Helper function to format number with thousand separators
const formatNumberWithCommas = (value: string | number): string => {
  if (!value) return "";
  // Remove all non-digit characters
  const numericValue = value.toString().replace(/\D/g, "");
  // Add thousand separators
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Helper function to parse formatted number back to plain number
const parseFormattedNumber = (value: string): string => {
  return value.replace(/,/g, "");
};

export default function PropertyDetailsStep({
  formData,
  updateForm,
}: PropertyDetailsStepProps) {
  return (
    <div className="space-y-4">
      <div className="mb-14">
        <h3 className="text-lg font-bold mb-2">Property details</h3>
        <p className="text-gray-600 text-sm">
          Fill in the highlights of your listing and a captivating description
          to showcase the property at its best
        </p>
      </div>

      {/* Listing Type Selection */}
      <div className="mb-6">
        <label className="block font-medium mb-3">Listing Type</label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => updateForm("listing_type", ListingType.RENT)}
            className={`flex-1 p-4 border-2 rounded-lg transition-colors ${
              formData.listing_type === ListingType.RENT
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="text-center">
              <div className="text-lg font-semibold">For Rent</div>
              <div className="text-sm text-gray-600">Annual rental</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => updateForm("listing_type", ListingType.SALE)}
            className={`flex-1 p-4 border-2 rounded-lg transition-colors ${
              formData.listing_type === ListingType.SALE
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="text-center">
              <div className="text-lg font-semibold">For Sale</div>
              <div className="text-sm text-gray-600">One-time purchase</div>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Estate Name  */}
        <div>
          <label className="block font-medium mb-1">Estate name</label>
          <input
            type="text"
            placeholder="Enter estate name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            value={formData.estate || ""}
            onChange={(e) => updateForm("estate", e.target.value)}
          />
        </div>

        {/* Property Price - Dynamic based on listing type */}
        <div className="">
          <label className="block font-medium mb-1">
            {formData.listing_type === ListingType.RENT ? "Annual Rent" : "Sale Price"}
          </label>
          <div className="relative mb-5">
            <span className="absolute left-3 top-[50%] -translate-y-1/2">
              ₦
            </span>
            <input
              type="text"
              placeholder={formData.listing_type === ListingType.RENT ? "Enter annual rent" : "Enter sale price"}
              className="w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={formatNumberWithCommas(formData.listing_type === ListingType.RENT ? formData.rental_price : formData.sale_price)}
              onChange={(e) => {
                const rawValue = parseFormattedNumber(e.target.value);
                if (formData.listing_type === ListingType.RENT) {
                  updateForm("rental_price", rawValue);
                  updateForm("price", rawValue); // For backward compatibility
                } else {
                  updateForm("sale_price", rawValue);
                  updateForm("price", rawValue); // For backward compatibility
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Additional Fees Section - Show for both rentals and sales */}
      <div className="mt-6">
        <h3 className="font-medium mb-4">Additional Fees</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Agency Fee */}
          <div>
            <label className="block text-sm mb-1">Agency Fee</label>
            <div className="relative">
              <span className="absolute left-3 top-[50%] -translate-y-1/2">₦</span>
              <input
                type="text"
                placeholder="Enter agency fee"
                className="w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={formatNumberWithCommas(formData.agency_fee || "")}
                onChange={(e) => updateForm("agency_fee", parseFormattedNumber(e.target.value))}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formData.listing_type === ListingType.RENT 
                ? "Usually 10% of annual rent"
                : "Agency commission for sale"}
            </p>
          </div>

          {/* Legal Fee */}
          <div>
            <label className="block text-sm mb-1">Legal Fee</label>
            <div className="relative">
              <span className="absolute left-3 top-[50%] -translate-y-1/2">₦</span>
              <input
                type="text"
                placeholder="Enter legal fee"
                className="w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={formatNumberWithCommas(formData.legal_fee || "")}
                onChange={(e) => updateForm("legal_fee", parseFormattedNumber(e.target.value))}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formData.listing_type === ListingType.RENT 
                ? "Legal/Tenancy Agreement Fee"
                : "Legal documentation fee"}
            </p>
          </div>

          {/* Other Fees */}
          <div className="col-span-2">
            <label className="block text-sm mb-1">Other Fees</label>
            <div className="relative">
              <span className="absolute left-3 top-[50%] -translate-y-1/2">₦</span>
              <input
                type="text"
                placeholder="Enter other fees"
                className="w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={formatNumberWithCommas(formData.other_fees || "")}
                onChange={(e) => updateForm("other_fees", parseFormattedNumber(e.target.value))}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formData.listing_type === ListingType.RENT 
                ? "Additional fees like caution fee, service charge, etc."
                : "Additional charges or fees"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Property size (sqm) */}
        <div>
          <label className="block font-medium mb-1">
            Property size (sqm) <span className="text-gray-500 text-sm font-normal">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="Enter property size"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-3"
            value={formData.size || ""}
            onChange={(e) => updateForm("size", e.target.value)}
          />
        </div>

        {/* Property Type */}
        <div>
          <label className="block font-medium mb-1">Property type</label>
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-3"
            value={formData.type}
            onChange={(e) => updateForm("type", e.target.value as PropertyType)}
          >
            <option value="">Select property type</option>
            {PropertyTypeArray.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Property Condition (New-built, Old, Renovated)  */}
        <div>
          <label className="block font-medium mb-1">Property condition</label>
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-3"
            value={formData.condition}
            onChange={(e) => updateForm("condition", e.target.value)}
          >
            <option value="">Select property condition</option>
            {["New-built", "Old", "Renovated"].map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </div>

        {/* Property furnished (furnished, semi-furnished, unfurnished) */}
        <div>
          <label className="block font-medium mb-1">Property furnishing</label>
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-3"
            value={formData.furnishing}
            onChange={(e) => updateForm("furnishing", e.target.value)}
          >
            <option value="">Select property furnishing</option>
            {["Furnished", "Semi-furnished", "Unfurnished"].map(
              (furnishing) => (
                <option key={furnishing} value={furnishing}>
                  {furnishing}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Bedrooms */}
        <div>
          <label className="block font-medium mb-1">Bedrooms</label>
          <input
            type="number"
            value={formData.beds || ""}
            onChange={(e) => updateForm("beds", e.target.value)}
            min="0"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-3"
          />
        </div>

        {/* Bathrooms */}
        <div>
          <label className="block font-medium mb-1">Bathrooms</label>
          <input
            type="number"
            value={formData.baths || ""}
            onChange={(e) => updateForm("baths", e.target.value)}
            min="0"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-3"
          />
        </div>

        {/* Toilets */}
        <div>
          <label className="block font-medium mb-1">Toilets</label>
          <input
            type="number"
            value={formData.toilets || ""}
            onChange={(e) => updateForm("toilets", e.target.value)}
            min="0"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-3"
          />
        </div>
      </div>

      {/* Property amenities  */}
      <div className="">
        <h3 className="text-lg font-semibold mb-1">Amenities</h3>
        <p className="text-gray-600 text-sm mb-4">
          Select the amenities available in your property
        </p>
        <div className="grid grid-cols-2 gap-4">
          {amenities.map(
            (amenity: { name: string; icon: string }, index: number) => (
              <label
                key={index}
                className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.amenities.some((a: { name: string; icon: string }) => a.name === amenity.name)
                    ? "border-indigo-600 bg-indigo-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.amenities.some((a: { name: string; icon: string }) => a.name === amenity.name)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateForm("amenities", [
                        ...formData.amenities,
                        { name: amenity.name, icon: amenity.icon }
                      ]);
                    } else {
                      updateForm(
                        "amenities",
                        formData.amenities.filter(
                          (a: { name: string; icon: string }) => a.name !== amenity.name
                        )
                      );
                    }
                  }}
                />
                {getAmenityIcon(amenity.icon)}
                <span>{amenity.name}</span>
              </label>
            )
          )}
        </div>
      </div>

      {/* Property Description */}
      <div>
        <label className="block font-medium mb-1">Property description</label>
        <textarea
          className="h-[150px] max-h-[150px] min-h-[150px] w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          value={formData.description}
          onChange={(e) => updateForm("description", e.target.value)}
          placeholder="Enter the best description of your property"
        />
      </div>
    </div>
  );
}

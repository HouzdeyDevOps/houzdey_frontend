import React from "react";
// import { PropertyTypeArray } from "@/@types/create-listing";
import { getAmenityIcon } from "@/utils/iconUtils";
import { amenities } from "@/constants/amenities";
import { PropertyType, PropertyTypeArray } from "@/@types/create-listing";

interface PropertyDetailsStepProps {
  formData: any;
  updateForm: (field: string, value: any) => void;
}

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

      <div className="grid grid-cols-2 gap-4">
        {/* Estate Name  */}
        <div>
          <label className="block font-medium mb-1">Estate name</label>
          <input
            type="text"
            placeholder="Enter estate name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            value={formData.estateName}
            onChange={(e) => updateForm("estateName", e.target.value)}
          />
        </div>

        {/* Property Price */}
        <div className="">
          <label className="block font-medium mb-1">Property price</label>
          <div className="relative mb-5">
            <span className="absolute left-3 top-[50%] -translate-y-1/2">
              ₦
            </span>
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

      <div className="grid grid-cols-2 gap-4">
        {/* Property size (sqm) */}
        <div>
          <label className="block font-medium mb-1">Property size (sqm)</label>
          <input
            type="text"
            placeholder="Enter property size"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-3"
            value={formData.size}
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
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-3"
          />
        </div>

        {/* Bathrooms */}
        <div>
          <label className="block font-medium mb-1">Bathrooms</label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-3"
          />
        </div>

        {/* Toilets */}
        <div>
          <label className="block font-medium mb-1">Toilets</label>
          <input
            type="number"
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
                      updateForm("amenities", [
                        ...formData.amenities,
                        amenity.name,
                      ]);
                    } else {
                      updateForm(
                        "amenities",
                        formData.amenities.filter(
                          (a: string) => a !== amenity.name
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

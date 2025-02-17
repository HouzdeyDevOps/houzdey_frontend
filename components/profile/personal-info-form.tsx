"use client";

import { useState } from "react";
import Image from "next/image";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function PersonalInfoForm() {
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1984-12-08",
    email: "johndoe68@gmail.com",
    phoneNumber: "+234834567891",
    profilePicture: "/assets/images/avatar-placeholder.jpg",
  });

  const [fileError, setFileError] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setFileError("The file format is not supported. Please upload a JPEG, PNG, or GIF image");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFileError("File size must be less than 10MB");
      return;
    }

    setFileError("");
    // Handle file upload logic here
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-8">Personal information</h2>

      <form className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">First name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Last name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Date of birth</label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Email address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Phone number</label>
          <PhoneInput
            country="ng"
            value={formData.phoneNumber}
            onChange={(phone) => setFormData({ ...formData, phoneNumber: phone })}
            inputClass="!w-full !py-6 !px-4 !border !rounded-lg focus:!outline-none focus:!ring-2 focus:!ring-indigo-600"
            containerClass="!w-full"
            buttonClass="!border-0 !bg-transparent"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Profile picture</label>
          <p className="text-gray-500 text-sm mb-4">
            Upload a clear facial photo of yourself for verification. This step is crucial for confirming your identity and maintaining the security of your account
          </p>
          
          <div className="flex items-center justify-center">
            <div className="relative w-24 h-24">
              <Image
                src={formData.profilePicture}
                alt="Profile"
                fill
                className="rounded-full object-cover"
              />
            </div>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => document.getElementById("profile-upload")?.click()}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Change profile picture
            </button>
            <input
              id="profile-upload"
              type="file"
              accept="image/jpeg,image/png,image/gif"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          
          <p className="text-sm text-gray-500 text-center mt-2">
            *png, *jpeg files up to 10MB at least 400px by 400px
          </p>
          {fileError && (
            <p className="text-red-500 text-sm text-center mt-2">{fileError}</p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
} 
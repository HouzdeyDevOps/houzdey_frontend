"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { authApi } from "@/api/auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getOptimizedImageUrl } from "@/utils/imageUtils";
import { useDispatch } from "react-redux";
import { updateUser } from "@/store/slices/userAuthSlice";

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  date_of_birth?: string;
  profile_picture?: string;
  status: string;
}

export default function PersonalInfoForm() {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [imageError, setImageError] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    phoneNumber: "",
    profilePicture: "/assets/images/avatar-placeholder.jpg",
  });

  // Add custom input for DatePicker
  const CustomInput = ({ value, onClick }: { value?: string; onClick?: () => void }) => (
    <div className="relative">
      <input
        type="text"
        value={value}
        onClick={onClick}
        readOnly
        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
        placeholder="Select date of birth"
      />
    </div>
  );

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = await authApi.getCurrentUser();
      setUserData(user);
      setFormData({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        dateOfBirth: user.date_of_birth ? user.date_of_birth.split('T')[0] : "",
        email: user.email || "",
        phoneNumber: user.phone_number || "",
        profilePicture: user.profile_picture || "/assets/images/avatar-placeholder.jpg",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setFileError("Please upload a valid image file (JPEG, PNG, or GIF)");
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setFileError("File size must be less than 10MB");
      return;
    }

    // Clear any previous errors
    setFileError("");
    setImageError(false);
    
    // Set the file for upload
    setProfilePictureFile(file);
    
    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, profilePicture: previewUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("First name and last name are required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setIsSaving(true);
      
      // Create FormData for multipart/form-data
      const submitData = new FormData();
      submitData.append("first_name", formData.firstName);
      submitData.append("last_name", formData.lastName);
      submitData.append("phone_number", formData.phoneNumber);
      submitData.append("date_of_birth", formData.dateOfBirth);
      
      // Add profile picture if a new one was selected
      if (profilePictureFile) {
        submitData.append("profile_picture", profilePictureFile);
      }

      const response = await authApi.updatePersonalInfo(submitData);
      
      // Update the profile picture URL if a new one was uploaded
      if (response.profile_picture_url) {
        setFormData(prev => ({
          ...prev,
          profilePicture: response.profile_picture_url
        }));
      }
      
      // Update Redux store with the new user data
      if (userData) {
        dispatch(updateUser({
          ...userData,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phoneNumber,
          profile_picture: response.profile_picture_url || userData.profile_picture
        }));
      }
      
      toast.success("Personal information updated successfully!");
      
      // Reset the profile picture file state
      setProfilePictureFile(null);
      
    } catch (error: any) {
      console.error("Error updating personal info:", error);
      toast.error(error.message || "Failed to update personal information");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    // Reset to original user data from the fetched data
    if (userData) {
      setFormData({
        firstName: userData.first_name || "",
        lastName: userData.last_name || "",
        dateOfBirth: "", // User type doesn't have date_of_birth, so keep empty
        email: userData.email || "",
        phoneNumber: userData.phone_number || "",
        profilePicture: userData.profile_picture || "/assets/images/avatar-placeholder.jpg",
      });
      setProfilePictureFile(null);
      setFileError("");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm flex justify-center items-center">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="ml-2 text-gray-600">Loading your information...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-8">Personal information</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">First name *</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Last name *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Date of birth</label>
          <DatePicker
            selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
            onChange={(date: Date | null) => {
              if (date) {
                setFormData({ ...formData, dateOfBirth: date.toISOString().split('T')[0] })
              }
            }}
            customInput={<CustomInput />}
            dateFormat="MMMM d, yyyy"
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={100}
            maxDate={new Date()}
            placeholderText="Select date of birth"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            calendarClassName="!bg-white !border !border-gray-200 !rounded-lg !shadow-lg !font-sans"
            wrapperClassName="w-full"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Email address *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-gray-50"
            required
            readOnly
            title="Email cannot be changed. Please contact support if you need to update your email."
          />
          <p className="text-sm text-gray-500 mt-1">
            Email cannot be changed. Contact support if needed.
          </p>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Phone number</label>
          <PhoneInput
            country="ng"
            value={formData.phoneNumber}
            onChange={(phone) => setFormData({ ...formData, phoneNumber: phone })}
            inputClass="!w-full !py-6 !pr-4 !pl-11 !border !rounded-lg focus:!outline-none focus:!ring-2 focus:!ring-indigo-600"
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
              {imageError ? (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">?</span>
                </div>
              ) : (
                <Image
                  src={getOptimizedImageUrl(formData.profilePicture, {
                    width: 96,
                    height: 96,
                    defaultImage: 'avatar-placeholder'
                  })}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="rounded-full object-cover"
                  style={{
                    width: '96px',
                    height: '96px'
                  }}
                  onError={() => setImageError(true)}
                  priority={true}
                  unoptimized={formData.profilePicture.startsWith('blob:')}
                />
              )}
            </div>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => document.getElementById("profile-upload")?.click()}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
            onClick={handleReset}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            disabled={isSaving}
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}


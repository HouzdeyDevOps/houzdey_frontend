"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { authApi } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/store/slices/userAuthSlice";
import ErrorModal from "./error-modal";
import LoadingModal from "./loading-modal";
import { personalInfoSchema } from "@/utils/validationSchema";
import { z } from "zod";
import { closeModal, setCurrentModal } from "@/store/slices/authModalSlice";
import ExitModal from "./exit-modal";
import { RootState } from "@/store/store";
import SuccessModal from "./success-modal";

interface PersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export default function PersonalInfoModal({
  isOpen,
  onClose,
  email,
}: PersonalInfoModalProps) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phoneNumber: "",
    profilePicture: null as File | null,
  });
  const [fileError, setFileError] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const currentModal = useSelector(
    (state: RootState) => state.authModal.currentModal
  );
  const [showExitModal, setShowExitModal] = useState(false);

  // Update the handleClose function
  const handleClose = () => {
    setShowExitModal(true); // Show exit confirmation instead of directly closing
  };

  // Add a handleExit function to handle actual closing
  const handleExit = () => {
    setShowExitModal(false);
    dispatch(closeModal()); // This will reset the modal state to 'none'
    onClose && onClose(); // Only call onClose if it exists
  };

  // Add a handleContinue function to resume editing
  const handleContinue = () => {
    setShowExitModal(false);
  };

  const { mutate: updatePersonalInfo, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await authApi.updatePersonalInfo(data);
      return response;
    },
    onSuccess: (data) => {
      dispatch(setCurrentModal("success"));
      onClose();
    },
    onError: (error: Error) => {
      setErrorMessage(error.message);
      setShowError(true);
      console.error("Failed to update personal info:", error);
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      setFileError(
        "The file format is not supported. Please upload a JPEG, PNG, or GIF image"
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB
      setFileError("File size must be less than 10MB");
      return;
    }

    setFileError("");
    setFormData({ ...formData, profilePicture: file });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data
      personalInfoSchema.parse(formData);

      const form = new FormData();
      form.append("first_name", formData.firstName);
      form.append("last_name", formData.lastName);
      // Format date to YYYY-MM-DD
      const formattedDate = new Date(formData.dateOfBirth)
        .toISOString()
        .split("T")[0];
      form.append("date_of_birth", formattedDate);
      form.append("phone_number", formData.phoneNumber);
      form.append("email", email);

      if (formData.profilePicture) {
        form.append("profile_picture", formData.profilePicture);
      }

      updatePersonalInfo(form);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrorMessage(error.errors[0].message);
        setShowError(true);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold">Personal information</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">First name</label>
              <input
                type="text"
                placeholder="First name"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Last name</label>
              <input
                type="text"
                placeholder="Last name"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
              <p className="text-gray-500 text-sm mt-2">
                Make sure this matches the name on your government ID. If you go
                by another name, you can add a preferred first name.
              </p>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Date of birth</label>
              <input
                type="date"
                placeholder="DD/MM/YYYY"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Phone number</label>
              <PhoneInput
                country={"ng"}
                value={formData.phoneNumber}
                onChange={(phone) =>
                  setFormData({ ...formData, phoneNumber: phone })
                }
                inputClass="!w-full !pl-[4.2rem] !py-6 !border !rounded-lg focus:!outline-none focus:!ring-2 focus:!ring-indigo-600"
                containerClass="!w-full"
                buttonClass="!border !rounded-l-lg !p-1 focus:!outline-none focus:!ring-2 focus:!ring-indigo-600"
                dropdownClass="!rounded-lg"
                searchClass="!rounded-lg"
                enableSearch
                disableSearchIcon
                countryCodeEditable={false}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Profile picture
              </label>
              <p className="text-gray-500 text-sm mb-4">
                Upload a clear facial photo of yourself for verification. This
                step is crucial for confirming your identity and maintaining the
                security of your account
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {formData.profilePicture ? (
                  <div className="relative w-24 h-24 mx-auto">
                    <img
                      src={URL.createObjectURL(formData.profilePicture)}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                    <span className="text-gray-400">
                      <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("profile-upload")?.click()
                  }
                  className="mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Upload image
                </button>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <p className="text-sm text-gray-500 mt-2">
                  *png, *jpeg files up to 10MB at least 400px by 400px
                </p>
                {fileError && (
                  <p className="text-red-500 text-sm mt-2">{fileError}</p>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-600">
              By selecting Agree and Continue, I agree to Houzdey's{" "}
              <Link href="/terms" className="text-indigo-600 hover:underline">
                Terms of Service
              </Link>
              ,{" "}
              <Link
                href="/payment-terms"
                className="text-indigo-600 hover:underline"
              >
                Payment Terms of Service
              </Link>
              , and{" "}
              <Link
                href="/non-discrimination"
                className="text-indigo-600 hover:underline"
              >
                Non-discrimination Policy
              </Link>{" "}
              and acknowledge the{" "}
              <Link href="/privacy" className="text-indigo-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Agree and continue
            </button>
          </form>
        </div>
      </div>
      <LoadingModal isOpen={isPending} />
      <ErrorModal
        isOpen={showError}
        onClose={() => setShowError(false)}
        message={errorMessage}
      />

      <ExitModal
        isOpen={showExitModal}
        onClose={handleContinue}
        onConfirm={handleExit}
      />

      {currentModal === "success" && (
        <SuccessModal
          isOpen={true}
          onClose={() => {
            dispatch(closeModal());
            // router.push("/");
          }}
          title="Welcome to Houzdey!"
          message="Your account has been created successfully. You can now start exploring properties."
          buttonText="Get Started"
        />
      )}
    </>
  );
}

// Add this styled component after your imports and before the component
const StyledPhoneInput = styled.div`
  .react-phone-input-2 {
    width: 100% !important;
  }

  .react-phone-input-2 .form-control {
    width: 100% !important;
    height: 48px !important;
    border-radius: 0.5rem !important;
    border: 1px solid #e5e7eb !important;
    padding: 0.75rem 1rem !important;
    padding-left: 3rem !important;
  }

  .react-phone-input-2 .flag-dropdown {
    border: 1px solid #e5e7eb !important;
    border-right: none !important;
    border-radius: 0.5rem 0 0 0.5rem !important;
    background: transparent !important;
  }

  .react-phone-input-2 .flag-dropdown.open {
    border-radius: 0.5rem 0 0 0 !important;
  }

  .react-phone-input-2 .selected-flag {
    border-radius: 0.5rem 0 0 0.5rem !important;
    padding: 0 0.75rem !important;
  }

  .react-phone-input-2 .country-list {
    border-radius: 0.5rem !important;
    border: 1px solid #e5e7eb !important;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
    margin-top: 4px !important;
  }

  .react-phone-input-2 .country-list .search {
    padding: 10px !important;
  }

  .react-phone-input-2 .country-list .search-box {
    padding: 8px !important;
    border-radius: 0.375rem !important;
    border: 1px solid #e5e7eb !important;
    margin: 0 !important;
  }

  .react-phone-input-2 .form-control:focus {
    border-color: #4f46e5 !important;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2) !important;
  }
`;

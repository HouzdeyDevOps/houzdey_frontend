"use client";

import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SuccessModal from "./success-modal";
import LoadingModal from "./loading-modal";
import ExitModal from "./exit-modal";
import ErrorModal from "./error-modal";
import { PersonalInfoData } from "@/@types/auth";
import SignInModal from "./signin-modal";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/store/slices/userAuthSlice";
import { z } from "zod";
import { authApi } from "@/api/auth";
import VerificationCodeModal from "./verification-code-modal";
import PersonalInfoModal from "./personal-info-modal";
import { signupSchema } from "@/utils/validationSchema";
import { RootState } from "@/store/store";
import { setCurrentModal, closeModal, setMode } from "@/store/slices/authModalSlice";
import GoogleAuthButton from "./GoogleAuthButton";
import { showSuccessToast, showErrorToast, showInfoToast } from "@/utils/toast";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const dispatch = useDispatch();
  const currentModal = useSelector(
    (state: RootState) => state.authModal.currentModal
  );
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  const { mutate: signup, isPending } = useMutation({
    mutationFn: authApi.signup,
    onSuccess: () => {
      dispatch(setCurrentModal("verification"));
      showSuccessToast("Account created successfully! Please check your email for verification.");
    },
    onError: (error: Error) => {
      setErrorMessage(error.message);
      showErrorToast(error.message);
      setShowError(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = signupSchema.parse(formData);
      signup(validatedData);
      dispatch(setMode("signup"));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors[0].message;
        setErrorMessage(errorMessage);
        showErrorToast(errorMessage);
        setShowError(true);
      }
    }
  };


  const handleSwitchToSignIn = () => {
    dispatch(setCurrentModal("signin"));
  };


  const handleCloseModal = () => {
    if (currentModal === "signup") {
      dispatch(closeModal());
      onClose();
    }
  };

  if (!isOpen && currentModal === "signup") return null;

  return (
    <>
      {currentModal === "signup" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-lg mx-4 p-6">
            <div className="flex items-center justify-center mb-8 relative">
              <h2 className="text-2xl font-semibold">Sign up</h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full absolute right-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="Enter Email address"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Create password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="relative text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative">
                  <span className="px-2 text-gray-500 bg-white">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="flex justify-center gap-4 my-5">
                <button
                  type="button"
                  className="p-3 border rounded-full hover:bg-gray-50"
                >
                  <Image
                    src="/assets/icons/facebook_icon.png"
                    alt="Facebook"
                    width={24}
                    height={24}
                    style={{ width: "24px", height: "24px", objectFit: "contain" }}
                  />
                </button>
                <button
                  type="button"
                  className="p-3 border rounded-full hover:bg-gray-50"
                >
                  <Image
                    src="/assets/icons/apple.png"
                    alt="Apple"
                    width={24}
                    height={24}
                    style={{ width: "24px", height: "24px", objectFit: "contain" }}
                  />
                </button>
                <GoogleAuthButton 
                  onError={(message) => {
                    setErrorMessage(message);
                    setShowError(true);
                  }}
                />
              </div>

              <div className="text-center text-sm my-5">
                <span className="text-gray-600">Already have an account?</span>{" "}
                <button
                  onClick={handleSwitchToSignIn}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Login
                </button>
              </div>

              {/* divider */}
              <div className="border-b border-gray-300" />

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                disabled={isPending}
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      )}

      <SignInModal
        isOpen={currentModal === "signin"}
        onClose={() => {
          dispatch(closeModal());
        }}
      />

      <VerificationCodeModal
        isOpen={currentModal === "verification"}
        onBack={() => dispatch(setCurrentModal("signup"))}
        onClose={() => dispatch(closeModal())}
        email={formData.email}
        // onVerify={handleVerification}
        handleSwitchToSignIn={handleSwitchToSignIn}
        showSocialLogin = {true}
        showSignInLink = {true}
      />

      <PersonalInfoModal
        isOpen={currentModal === "personalInfo"}
        onClose={() => {
          dispatch(closeModal()); 
        }}
        email={formData.email}
      />

    

      <LoadingModal
        isOpen={isPending}
        title="Creating your account"
        message="Please wait while we set up your account"
        spinnerSize="lg"
      />
      <ErrorModal
        isOpen={showError}
        onClose={() => setShowError(false)}
        message={errorMessage}
      />
    </>
  );
}

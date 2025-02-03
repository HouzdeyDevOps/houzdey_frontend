"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SuccessModal from "./success-modal";
import LoadingModal from "./loading-modal";
import ExitModal from "./exit-modal";
import ErrorModal from "./error-modal";
import { Eye, EyeOff } from "lucide-react";
import PersonalInfoModal from "./personal-info-modal";
import VerificationCodeModal from "./verification-code-modal";
import { PersonalInfoData } from "@/@types/auth";
import SignInModal from "./signin-modal";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(1);
  const [showVerification, setShowVerification] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call to send verification code
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
      setShowVerification(true);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage("Failed to send verification code. Please try again.");
      setShowError(true);
    }
  };

  const handleVerification = async (code: string) => {
    setIsLoading(true);
    try {
      // Verify code
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
      setShowVerification(false);
      setShowPersonalInfo(true);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage("Invalid verification code. Please try again.");
      setShowError(true);
    }
  };

  const handlePersonalInfo = async (data: PersonalInfoData) => {
    setIsLoading(true);
    try {
      // Submit personal info
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
      setShowSuccess(true);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage("Failed to save personal information. Please try again.");
      setShowError(true);
    }
  };

  const handleSwitchToSignIn = () => {
    setShowSignIn(true);
  };

  const handleSwitchToSignUp = () => {
    setShowSignIn(false);
  };

  return (
    <>
      {showSignIn ? (
        <SignInModal
          isOpen={showSignIn}
          onClose={onClose}
          onSwitchToSignUp={handleSwitchToSignUp}
        />
      ) : (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-lg mx-4 p-6">
            <div className="flex items-center justify-center mb-8 relative">
              <h2 className="text-2xl font-semibold">Sign up</h2>
              <button
                onClick={onClose}
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

              <div className="text-center">
                <p className="text-gray-600 mb-6">Or continue with</p>
                <div className="flex justify-center gap-4">
                  <button
                    type="button"
                    className="p-3 border rounded-full hover:bg-gray-50"
                  >
                    <Image
                      src="/assets/icons/facebook.png"
                      alt="Facebook"
                      width={24}
                      height={24}
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
                    />
                  </button>
                  <button
                    type="button"
                    className="p-3 border rounded-full hover:bg-gray-50"
                  >
                    <Image
                      src="/assets/icons/google.png"
                      alt="Google"
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              </div>

              <div className="text-center text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={handleSwitchToSignIn}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  Login
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      <LoadingModal isOpen={isLoading} />
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          onClose();
        }}
      />
      <ErrorModal
        isOpen={showError}
        onClose={() => setShowError(false)}
        message={errorMessage}
      />
      <ExitModal
        isOpen={showExit}
        onClose={() => setShowExit(false)}
        onConfirm={onClose}
      />
      <VerificationCodeModal
        isOpen={showVerification}
        onClose={onClose}
        onBack={() => setShowVerification(false)}
        email={formData.email}
        onVerify={handleVerification}
      />
      <PersonalInfoModal
        isOpen={showPersonalInfo}
        onClose={onClose}
        // onBack={() => setShowPersonalInfo(false)}
        // onSubmit={handlePersonalInfo}
      />
    </>
  );
}

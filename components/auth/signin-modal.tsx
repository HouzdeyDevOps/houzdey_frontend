"use client";

import { useState } from "react";
import { X, ChevronLeft, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import ForgotPasswordModal from "./forgot-password-modal";
import { login } from "@/store/slices/userAuthSlice";
import { z } from "zod";
import { authApi } from "@/api/auth";
import { signinSchema } from "@/utils/validationSchema";
import { closeModal, setCurrentModal } from "@/store/slices/authModalSlice";
import LoadingModal from "./loading-modal";
import ErrorModal from "./error-modal";
import { AuthError } from "@/@types/auth";
import GoogleAuthButton from "./GoogleAuthButton";
import LoginVerificationModal from "./login-verification-modal";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import ComingSoonModal from "./coming-soon-modal";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({
  isOpen,
  onClose,
}: SignInModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [showLoginVerificationModal, setShowLoginVerificationModal] =
    useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<"Facebook" | "Apple">("Facebook");

  const dispatch = useDispatch();

  const { mutate: signin, isPending } = useMutation({
    mutationFn: authApi.signin,
    onSuccess: (data: {
      access_token: string;
      token_type: string;
      user: any;
    }) => {
      dispatch(login({ token: data.access_token, user: data.user }));
      dispatch(closeModal());
      showSuccessToast("Successfully signed in!");
    },
    onError: (error: Error & Partial<AuthError>) => {
      setErrorMessage(error.message);
      if (error.type === "UNVERIFIED_EMAIL") {
        setError({
          type: "UNVERIFIED_EMAIL",
          message: error.message,
          email: error.email || formData.email,
        });
        // Automatically show login verification modal
        setShowLoginVerificationModal(true);
        showSuccessToast("Verification code sent to your email!");
      } else {
        setError({
          type: error.type || "GENERAL_ERROR",
          message: error.message,
        });
        showErrorToast(error.message || "Failed to sign in");
      }
      setShowError(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const validatedData = signinSchema.parse(formData);
      signin(validatedData);
    } catch (err: any) {
      if (err.type === "UNVERIFIED_EMAIL") {
        setError({
          type: "UNVERIFIED_EMAIL",
          message:
            "Please verify your email before signing in. Check your inbox for the verification code.",
          email: formData.email,
        });
        setErrorMessage(
          "Please verify your email before signing in. Check your inbox for the verification code."
        );
        showErrorToast("Please verify your email before signing in");
      } else {
        const message = err.message || "An error occurred during sign in";
        setError({
          type: "GENERAL_ERROR",
          message: message,
        });
        setErrorMessage(message);
        showErrorToast(message);
      }
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToSignUp = () => {
    dispatch(setCurrentModal("signup"));
  };

  if (!isOpen) return null;


  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl w-full max-w-lg mx-4 p-6">
          <div className="flex items-center justify-between mb-8">
            {/* Back button */}
            <button
              onClick={handleSwitchToSignUp}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-semibold">Sign in</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 mb-2">Email address</label>
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
              <label className="block text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
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

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => dispatch(setCurrentModal('forgotPassword'))}
                className="text-indigo-600 text-sm hover:underline"
              >
                Forgot password?
              </button>
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

            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setSelectedProvider("Facebook");
                  setShowComingSoon(true);
                }}
                className="p-3 border rounded-full hover:bg-gray-50 transition-colors"
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
                onClick={() => {
                  setSelectedProvider("Apple");
                  setShowComingSoon(true);
                }}
                className="p-3 border rounded-full hover:bg-gray-50 transition-colors"
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

            <div className="text-center text-gray-600 text-sm my-5">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={handleSwitchToSignUp}
                className="text-indigo-600 hover:text-indigo-700"
              >
                Sign up
              </button>
            </div>

            {/* divider */}
            <div className="border-b border-gray-300" />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
      <LoadingModal
        isOpen={isPending}
        title="Signing in"
        message="Please wait while we verify your credentials"
      />
      <ErrorModal
        isOpen={showError}
        onClose={() => setShowError(false)}
        message={errorMessage}
      />
      {showLoginVerificationModal && (
        <LoginVerificationModal
          isOpen={showLoginVerificationModal}
          onClose={() => setShowLoginVerificationModal(false)}
          email={formData.email}
          password={formData.password}
        />
      )}
      <ComingSoonModal
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
        provider={selectedProvider}
      />
    </>
  );
}

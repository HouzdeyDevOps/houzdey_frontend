"use client";

import { useState } from "react";
import { X, CheckCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth";
import LoadingModal from "./loading-modal";
import ErrorModal from "./error-modal";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/userAuthSlice";
import { closeModal } from "@/store/slices/authModalSlice";

interface LoginVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  password: string;
}

export default function LoginVerificationModal({
  isOpen,
  onClose,
  email,
  password,
}: LoginVerificationModalProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const dispatch = useDispatch();

  const { mutate: verifyAndLogin, isPending } = useMutation({
    mutationFn: async () => {
      // First verify the email
      await authApi.verifyCode(email, verificationCode);
      // Then automatically login
      return authApi.signin({ email, password });
    },
    onSuccess: (data) => {
      setShowSuccess(true);
      showSuccessToast("Email verified! Logging you in...");
      
      setTimeout(() => {
        // Login user
        dispatch(login({ token: data.access_token, user: data.user }));
        dispatch(closeModal());
        showSuccessToast("Successfully signed in!");
      }, 1500);
    },
    onError: (error: Error) => {
      setErrorMessage(error.message);
      showErrorToast(error.message);
      setShowError(true);
    },
  });

  const { mutate: resendCode, isPending: isResending } = useMutation({
    mutationFn: () => authApi.resendCode(email),
    onSuccess: () => {
      showSuccessToast("Verification code resent successfully");
    },
    onError: (error: Error) => {
      setErrorMessage(error.message);
      showErrorToast(error.message);
      setShowError(true);
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyAndLogin();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl w-full max-w-lg mx-4 p-6">
          {showSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Verified!</h3>
              <p className="text-gray-600">
                Logging you in now...
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold">Verify Your Email</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <p className="text-gray-600 mb-6">
                    Your account isn't verified yet. We've sent a verification code to{" "}
                    <span className="font-semibold">{email}</span>. 
                    Enter the code below to verify and login.
                  </p>
                  <label className="block text-gray-700 mb-2">
                    Verification code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>

                <button
                  type="button"
                  onClick={() => resendCode()}
                  disabled={isResending}
                  className="text-indigo-600 hover:text-indigo-700 text-sm"
                >
                  {isResending ? "Resending..." : "Didn't receive the code? Resend"}
                </button>

                <div className="border-b border-gray-300" />

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                  disabled={isPending}
                >
                  {isPending ? "Verifying..." : "Verify & Login"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <LoadingModal
        isOpen={isPending}
        title="Verifying"
        message="Please wait while we verify your email and log you in"
        spinnerSize="sm"
        spinnerColor="green-600"
      />
      <ErrorModal
        isOpen={showError}
        onClose={() => setShowError(false)}
        message={errorMessage}
      />
    </>
  );
}

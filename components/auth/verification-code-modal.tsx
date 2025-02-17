"use client";

import { useState } from "react";
import { ChevronLeft, CheckCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth";
import LoadingModal from "./loading-modal";
import ErrorModal from "./error-modal";
import Image from "next/image";

interface VerificationCodeModalProps {
  isOpen: boolean;
  onBack: () => void;
  onClose: () => void;
  email: string;
  onVerify: (code: string) => void;
  handleSwitchToSignIn?: () => void;
}

export default function VerificationCodeModal({
  isOpen,
  onBack,
  onClose,
  email,
  onVerify,
  handleSwitchToSignIn,
}: VerificationCodeModalProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const { mutate: verifyCode, isPending } = useMutation({
    mutationFn: () => authApi.verifyCode(email, verificationCode),
    onSuccess: () => {
      setShowSuccess(true);
      // Wait for 2 seconds to show success message before closing
      setTimeout(() => {
        onVerify(verificationCode);
      }, 2000);
    },
    onError: (error: Error) => {
      setErrorMessage(error.message);
      setShowError(true);
    },
  });

  const { mutate: resendCode, isPending: isResending } = useMutation({
    mutationFn: () => authApi.resendCode(email),
    onError: (error: Error) => {
      setErrorMessage(error.message);
      setShowError(true);
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyCode();
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
                Your email has been successfully verified. Redirecting...
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-semibold">Verification code</h2>
                <div className="w-9" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <p className="text-gray-600 mb-6">
                    Check your email inbox for a verification code we just sent.
                    Copy the code and paste it here to verify your identity and
                    continue.
                  </p>
                  <label className="block text-gray-700 mb-2">
                    Verification code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter verification code"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="button"
                  onClick={() => resendCode()}
                  disabled={isResending}
                  className="text-indigo-600 hover:text-indigo-700 text-sm"
                >
                  {isResending ? "Resending..." : "Resend code"}
                </button>

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
                  {isPending ? "Verifying..." : "Continue"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <LoadingModal
        isOpen={isPending || isResending}
        title="Verifying"
        message="Please wait while we verify your email"
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

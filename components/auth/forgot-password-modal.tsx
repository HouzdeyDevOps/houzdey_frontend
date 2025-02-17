"use client";

import { useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import VerificationCodeModal from "./verification-code-modal";
import LoadingModal from "./loading-modal";
import ErrorModal from "./error-modal";
import ResetPasswordModal from "./reset-password-modal";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  onBack,
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
      setShowResetPassword(true);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage("Invalid verification code. Please try again.");
      setShowError(true);
    }
  };

  

  return (
    <>
      {showResetPassword ? (
        <ResetPasswordModal
          isOpen={showResetPassword}
          onClose={onClose}
          onBack={() => setShowResetPassword(false)}
        />
      ) : (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-lg mx-4 p-6">
            <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-semibold">Forget password</h2>
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
                In order to reset your password, we need to verify your email. Please enter the
                email associated with your Houzdey account
              </p>
              <label className="block text-gray-700 mb-2">Email address</label>
              <input
                type="email"
                placeholder="Enter Email address"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <p className="text-gray-600 text-sm">
              By clicking "Submit," you consent to receiving a verification code from Houzdey to
              proceed with resetting your password.
            </p>

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

      <VerificationCodeModal
        isOpen={showVerification}
        onClose={onClose}
        onBack={() => setShowVerification(false)}
        email={email}
        onVerify={handleVerification}
      />
      <LoadingModal isOpen={isLoading} />
      <ErrorModal
        isOpen={showError}
        onClose={() => setShowError(false)}
        message={errorMessage}
      />
      <ResetPasswordModal
        isOpen={showResetPassword}
        onClose={onClose}
        onBack={() => setShowResetPassword(false)}
      />
    </>
  );
} 
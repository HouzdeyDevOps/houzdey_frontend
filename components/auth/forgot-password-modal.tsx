"use client";

import { useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import { authApi } from "@/api/auth";
import VerificationCodeModal from "./verification-code-modal";
import LoadingModal from "./loading-modal";
import ErrorModal from "./error-modal";
import ResetPasswordModal from "./reset-password-modal";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setCurrentModal, setMode } from "@/store/slices/authModalSlice";
import { setEmail } from "@/store/slices/userAuthSlice";

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
  const [newEmail, setNewEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const currentModal = useSelector(
    (state: RootState) => state.authModal.currentModal
  );
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authApi.forgotPassword(newEmail);
      dispatch(setCurrentModal("verification"));
      dispatch(setEmail(newEmail));
      dispatch(setMode('forgotPassword'));
      setIsLoading(false);
      showSuccessToast("Reset code sent to your email");
    } catch (error: any) {
      setIsLoading(false);
      const message =
        error.message || "Failed to send reset code. Please try again.";
      setErrorMessage(message);
      showErrorToast(message);
      setShowError(true);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl w-full max-w-lg mx-4 p-6">
          <div className="flex items-center justify-between mb-8">
            <button
              type="button"
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-semibold">Forget password</h2>
            <button
              type="button"
              onClick={() => {
                onClose();
              }}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <p className="text-gray-600 mb-5">
                Please enter your email address to receive a verification code.
              </p>
              <label className="block text-gray-700 mb-2">Email address</label>
              <input
                type="email"
                placeholder="Enter Email address"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>

            <p className="text-gray-600 text-xs mt-7">
              By clicking "Continue," you consent to receiving a reset code from
              Houzdey to proceed with resetting your password.
            </p>

            <button
              type="submit"
              disabled={isLoading || !newEmail}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Continue"}
            </button>
          </form>
        </div>
      </div>

      <VerificationCodeModal
        isOpen={currentModal === "verification"}
        onClose={onClose}
        onBack={() => dispatch(setCurrentModal("forgotPassword"))}
        email={newEmail}
      />
      <LoadingModal isOpen={isLoading} />
      <ErrorModal
        isOpen={showError}
        onClose={() => setShowError(false)}
        message={errorMessage}
      />
    </>
  );
}

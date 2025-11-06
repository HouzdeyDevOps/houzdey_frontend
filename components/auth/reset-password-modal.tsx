"use client";

import { useState } from "react";
import { ChevronLeft, X, Eye, EyeOff } from "lucide-react";
import { authApi } from "@/api/auth";
import LoadingModal from "./loading-modal";
import ErrorModal from "./error-modal";
import SuccessModal from "./success-modal";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { useDispatch } from "react-redux";
import { setCurrentModal } from "@/store/slices/authModalSlice";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  email: string;
}

export default function ResetPasswordModal({
  isOpen,
  onClose,
  onBack,
  email,
}: ResetPasswordModalProps) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      showErrorToast("Passwords do not match");
      setShowError(true);
      return;
    }

    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      setIsLoading(false);
      setShowSuccess(true);
      showSuccessToast("Password reset successfully!");
    } catch (error: any) {
      setIsLoading(false);
      const message =
        error.message || "Failed to reset password. Please try again.";
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
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-semibold">Create new password</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">New password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  minLength={8}
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
                  title="Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
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
              <p className="text-sm text-gray-500 mt-1">
                Password must be at least 8 characters long and contain at least
                one uppercase letter, one lowercase letter, and one number
              </p>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Confirm new password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                isLoading || !formData.password || !formData.confirmPassword
              }
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Resetting password..." : "Reset password"}
            </button>
          </form>
        </div>
      </div>

      <LoadingModal isOpen={isLoading} />
      <ErrorModal
        isOpen={showError}
        onClose={() => setShowError(false)}
        message={errorMessage}
      />
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          dispatch(setCurrentModal("signin"));
          onClose();
        }}
        title="Password Reset Successful"
        message="Your password has been successfully reset. You can now sign in with your new password."
        buttonText="Sign In"
      />
    </>
  );
}

"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";

interface VerificationCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  email: string;
  onVerify: (code: string) => void;
}

export default function VerificationCodeModal({
  isOpen,
  onClose,
  onBack,
  email,
  onVerify,
}: VerificationCodeModalProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [isResending, setIsResending] = useState(false);

  if (!isOpen) return null;

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      // Simulate API call to resend code
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Add your actual resend code logic here
    } catch (error) {
      console.error("Failed to resend code:", error);
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(verificationCode);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-semibold">Verification code</h2>
          <div className="w-9" /> {/* Spacer for alignment */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="text-gray-600 mb-6">
              Check your email inbox for a verification code we just sent. Copy the
              code and paste it here to verify your identity and continue.
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
            onClick={handleResendCode}
            disabled={isResending}
            className="text-indigo-600 hover:text-indigo-700 text-sm"
          >
            {isResending ? "Resending..." : "Resend code"}
          </button>

          <div className="text-center">
            <p className="text-gray-600 mb-6">Or continue with</p>
            <div className="flex justify-center gap-4">
              <button type="button" className="p-3 border rounded-full hover:bg-gray-50">
                <Image src="/assets/icons/facebook.png" alt="Facebook" width={24} height={24} />
              </button>
              <button type="button" className="p-3 border rounded-full hover:bg-gray-50">
                <Image src="/assets/icons/apple.png" alt="Apple" width={24} height={24} />
              </button>
              <button type="button" className="p-3 border rounded-full hover:bg-gray-50">
                <Image src="/assets/icons/google.png" alt="Google" width={24} height={24} />
              </button>
            </div>
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
  );
} 
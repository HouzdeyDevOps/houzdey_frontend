import { useState } from "react";
import { X } from "lucide-react";
import { authApi } from "@/api/auth";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import styled from "styled-components";

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (phoneNumber: string) => void;
}

export default function PhoneVerificationModal({
  isOpen,
  onClose,
  onVerified,
}: PhoneVerificationModalProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authApi.sendPhoneVerificationOTP(phoneNumber);
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authApi.verifyPhoneNumber(phoneNumber, otp);
      onVerified(phoneNumber);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="relative bg-white rounded-lg w-full max-w-md p-6">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold mb-4">
              {step === "phone" ? "Add Phone Number" : "Verify Phone Number"}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {step === "phone" ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div>
                  <StyledPhoneInput>
                    <PhoneInput
                      country={"ng"}
                      value={phoneNumber}
                      onChange={(phone) => setPhoneNumber(phone)}
                      inputClass="!w-full !pl-[4.2rem] !py-6 !border !rounded-lg focus:!outline-none focus:!ring-2 focus:!ring-indigo-600"
                      containerClass="!w-full"
                      buttonClass="!border !rounded-l-lg !p-1 focus:!outline-none focus:!ring-2 focus:!ring-indigo-600"
                      dropdownClass="!rounded-lg"
                      searchClass="!rounded-lg"
                      enableSearch
                      disableSearchIcon
                      countryCodeEditable={false}
                    />
                  </StyledPhoneInput>
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !phoneNumber}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                    maxLength={6}
                    pattern="\d{6}"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="w-full text-indigo-600 text-sm hover:underline"
                >
                  Change phone number
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

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

import React, { useState } from "react";
import axios from "axios";
import { endpoint } from "../hooks/config";
import { toast } from "react-toastify";

const ForgotPassword = ({ onClose, email }) => {
  const [emailInput, setEmailInput] = useState(email);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${endpoint}/api/password-recovery/${emailInput}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Password reset email sent. Check your inbox.");
      toast.success("Password reset email sent. Check your inbox.");
      handleClose()

    } catch (error) {
      console.error("Failed to send password reset email:", error);
      setMessage("Failed to send password reset email.");
      toast.error("Password reset email sent. Check your inbox.");
      handleClose()
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
        <p className="text-sm mb-4">
          Enter your email address to reset your password.
        </p>
        <input
          type="email"
          placeholder="Enter your email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          className="w-full px-4 py-2 border rounded-md mb-4"
        />
        <button
          onClick={handleForgotPassword}
          disabled={loading}
          className="w-full bg-[#575DFB] hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md"
        >
          {loading ? "Sending..." : "Send"}
        </button>
        <p className="text-base mt-4 font-bold text-green-600">{message}</p>
      </div>
    </div>
  );
};

export default ForgotPassword;

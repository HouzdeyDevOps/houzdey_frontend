"use client";

import { useState } from "react";
import { X, ChevronLeft, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import ForgotPasswordModal from "./forgot-password-modal";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

export default function SignInModal({
  isOpen,
  onClose,
  onSwitchToSignUp,
}: SignInModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const dispatch = useDispatch();

  const { mutate: signIn, isPending } = useMutation({
    mutationFn: async (credentials: typeof formData) => {
      // Your API call here
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Handle successful sign in
      dispatch({ type: "auth/setUser", payload: data.user });
      onClose();
    },
    onError: (error) => {
      // Handle error
      console.error("Sign in failed:", error);
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(formData);
  };

  if (showForgotPassword) {
    return (
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => {
          setShowForgotPassword(false);
          onClose();
        }}
        onBack={() => setShowForgotPassword(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-8">
          {/* Back button */}
          <button
            onClick={onSwitchToSignUp}
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

        <form onSubmit={handleSubmit} className="space-y-6">
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
            <button
              onClick={() => setShowForgotPassword(true)}
              className="text-indigo-600 text-sm block mt-2 hover:underline"
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

          <div className="text-center text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-indigo-600 hover:text-indigo-700"
            >
              Sign up
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useGoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/userAuthSlice";
import { closeModal } from "@/store/slices/authModalSlice";
import { authApi } from "@/api/auth";
import { useState } from "react";

interface GoogleAuthButtonProps {
  onError: (message: string) => void;
}

export default function GoogleAuthButton({ onError }: GoogleAuthButtonProps) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGoogleLogin = useGoogleLogin({
    flow: 'auth-code',
    // popup: true,
    onSuccess: async (codeResponse) => {
      try {
        setIsLoading(true);
        
        // Exchange code for tokens
        const result = await authApi.googleSignIn({
          code: codeResponse.code,
        });

        dispatch(login({
          user: result.user,
          token: result.access_token,
        }));

        dispatch(closeModal());
        
      } catch (error: any) {
        onError(error.message || "Google sign in failed");
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errorResponse) => {
      onError("Google sign in failed");
      setIsLoading(false);
    }
  });

  return (
    <button
      type="button"
      className="p-3 border rounded-full hover:bg-gray-50 disabled:opacity-50"
      onClick={() => handleGoogleLogin()}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="w-6 h-6 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
      ) : (
        <Image
          src="/assets/icons/google.png"
          alt="Google"
          width={24}
          height={24}
        />
      )}
    </button>
  );
} 
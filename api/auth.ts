import axios from "axios";
import axiosInstance from "@/lib/axios";
import { AuthError, SignInResponse, UserSignInParams } from "@/@types/auth";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface GoogleAuthUrlResponse {
  auth_url: string;
  state: string;
  code_verifier: string;
}

interface GoogleSignInParams {
  code: string;
}

export const authApi = {
  async signup(data: UserSignInParams) {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/register`, {
        email: data.email,
        password: data.password,
        phone_number: "", // Will be updated in personal info step
        name: "", // Will be updated in personal info step
      });
      return response.data;
    } catch (error: any) {
      if (error?.response?.data?.error) {
        throw new Error(error?.response?.data?.error?.message);
      }
      throw new Error("Registration failed. Please try again.");
    }
  },
  // async signin(data: UserSignInParams) {
  async signin(data: UserSignInParams): Promise<SignInResponse> {
    try {
      // The backend sets the httpOnly access/refresh cookies on this response.
      const response = await axios.post(
        `${API_BASE_URL}/users/login`,
        {
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }
      );

      return response.data;
    } catch (error: any) {
      // Backend returns error in error.response.data.error format
      const errorData = error.response?.data?.error || error.response?.data?.detail;
      
      // Check if errorData is an object with message and email (unverified account)
      if (typeof errorData === 'object' && errorData?.message && errorData?.email) {
        const err = new Error(errorData.message) as Error & AuthError;
        err.type = "UNVERIFIED_EMAIL";
        err.email = errorData.email;
        throw err;
      }
      
      // Check if message indicates unverified email
      if (errorData?.message && errorData.message.includes("verify your email")) {
        const err = new Error(errorData.message) as Error & AuthError;
        err.type = "UNVERIFIED_EMAIL";
        err.email = data.email;
        throw err;
      }
      
      // Check if errorData is a string with the unverified message
      if (typeof errorData === 'string' && errorData.includes("verify your email")) {
        const err = new Error(errorData) as Error & AuthError;
        err.type = "UNVERIFIED_EMAIL";
        err.email = data.email;
        throw err;
      }
      
      // Other errors with message
      if (errorData?.message) {
        const err = new Error(errorData.message) as Error & AuthError;
        err.type = "INVALID_CREDENTIALS";
        throw err;
      }
      
      // Fallback error
      const err = new Error(
        typeof errorData === 'string' ? errorData : "Sign in failed. Please check your credentials."
      ) as Error & AuthError;
      err.type = "GENERAL_ERROR";
      throw err;
    }
  },
  
  async resendVerificationEmail(email: string): Promise<void> {
    try {
      await axios.post(
        `${API_BASE_URL}/users/resend-verification?email=${encodeURIComponent(
          email
        )}`
      );
    } catch (error: any) {
      if (error?.response?.data?.error?.[0]?.msg) {
        throw new Error(error?.response?.data?.error?.message[0].msg);
      }
      throw new Error(
        error?.response?.data?.error || "Failed to resend verification email"
      );
    }
  },

  async getCurrentUser() {
    try {
      const response = await axiosInstance.get(`/users/me`);
      return response.data;
    } catch (error: any) {
      // Keep the HTTP status so callers can tell "not signed in" (401/403) from a temporary failure.
      throw Object.assign(new Error("Failed to fetch user data"), {
        status: error?.response?.status as number | undefined,
      });
    }
  },

  async verifyEmail(token: string) {
    // The token comes from the page URL; it must never be able to change the request path
    // (e.g. "../logout" would otherwise POST to another endpoint with the user's cookies).
    if (!/^[A-Za-z0-9_.-]{1,512}$/.test(token) || /^\.+$/.test(token)) {
      throw new Error("Invalid verification link.");
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/verify-email/${encodeURIComponent(token)}`,
        undefined,
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      if (error?.response?.data?.error) {
        throw new Error(error?.response?.data?.error?.message);
      }
      throw new Error("Email verification failed. Please try again.");
    }
  },

  async updatePersonalInfo(formData: FormData) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/me`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to update personal information.");
    }
  },

  async verifyCode(email: string, code: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/verify-code`, {
        email,
        code,
      });
      return response.data;
    } catch (error: any) {
      if (error?.response?.data?.error) {
        throw new Error(error?.response?.data?.error?.message);
      }
      throw new Error("Verification failed. Please try again.");
    }
  },

  async resendCode(email: string) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/resend-code?email=${encodeURIComponent(email)}`
      );
      return response.data;
    } catch (error: any) {
      if (error?.response?.data?.error) {
        throw new Error(error?.response?.data?.error?.message);
      }
      throw new Error("Failed to resend code. Please try again.");
    }
  },

  async getGoogleAuthUrl(): Promise<GoogleAuthUrlResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/social/google/auth`);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Failed to get auth URL");
    }
  },

  async googleSignIn({ code }: GoogleSignInParams): Promise<SignInResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/social/google/callback`,
        { code: code },
        { withCredentials: true }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Google sign in failed");
    }
  },

  async facebookSignIn(token: string): Promise<SignInResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/social/facebook`,
        {},
        {
          headers: {
            Authorization: token,
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error: any) {
      if (error?.response?.data?.error) {
        throw new Error(error?.response?.data?.error?.message);
      }
      throw new Error("Facebook sign in failed. Please try again.");
    }
  },

  async getAppleAuthUrl(): Promise<string> {
    const state = crypto.randomUUID();
    const nonce = crypto.randomUUID();
    
    // Store state and nonce in localStorage for verification
    localStorage.setItem('appleAuthState', state);
    localStorage.setItem('appleAuthNonce', nonce);
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI!,
      state: state,
      nonce: nonce,
      response_mode: 'form_post',
      scope: 'name email'
    });

    return `https://appleid.apple.com/auth/authorize?${params.toString()}`;
  },

  async appleSignIn(code: string): Promise<SignInResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/social/apple/callback`,
        { code },
        { withCredentials: true }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Apple sign in failed");
    }
  },

  async sendPhoneVerificationOTP(phoneNumber: string) {
    try {
      const formData = new FormData();
      formData.append('phone_number', phoneNumber);

      const response = await axios.post(
        `${API_BASE_URL}/users/phone/send-otp`,
        formData
      );
      return response.data;
    } catch (error: any) {
      const errorMsg = error?.response?.data?.error?.message || error?.response?.data?.error || "Failed to send OTP";
      throw new Error(errorMsg);
    }
  },

  async verifyPhoneNumber(phoneNumber: string, otp: string) {
    try {
      const formData = new FormData();
      formData.append('phone_number', phoneNumber);
      formData.append('otp', otp);

      const response = await axios.post(
        `${API_BASE_URL}/users/phone/verify`,
        formData
      );
      return response.data;
    } catch (error: any) {
      const errorMsg = error?.response?.data?.error?.message || error?.response?.data?.error || "Failed to verify phone number";
      throw new Error(errorMsg);
    }
  },

  async forgotPassword(email: string) {
    try {
      const formData = new FormData();
      formData.append('email', email);

      const response = await axios.post(
        `${API_BASE_URL}/users/forgot-password`,
        formData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Failed to send reset code");
    }
  },

  async resetPassword(email: string, code: string, newPassword: string) {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('reset_code', code);
      formData.append('new_password', newPassword);

      const response = await axios.post(
        `${API_BASE_URL}/users/reset-password`,
        formData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Failed to reset password");
    }
  },

  async changePassword(currentPassword: string, newPassword: string) {
    try {
      const formData = new FormData();
      formData.append('current_password', currentPassword);
      formData.append('new_password', newPassword);

      const response = await axios.post(
        `${API_BASE_URL}/users/change-password`,
        formData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Failed to change password");
    }
  },

  async disconnectSocialAccount(provider: string) {
    try {
      const formData = new FormData();
      formData.append('provider', provider);

      const response = await axios.post(
        `${API_BASE_URL}/users/disconnect-social-account`,
        formData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Failed to disconnect social account");
    }
  },

  async deactivateAccount(password: string) {
    try {
      const formData = new FormData();
      formData.append('password', password);

      const response = await axios.post(
        `${API_BASE_URL}/users/deactivate-account`,
        formData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error || "Failed to deactivate account");
    }
  },

  async refreshAccessToken(): Promise<string> {
    try {
      // The refresh_token cookie is sent automatically; the response sets a fresh access_token cookie.
      const response = await axios.post(
        `${API_BASE_URL}/users/refresh`,
        {},
        { withCredentials: true }
      );

      return response.data.access_token;
    } catch (error: any) {
      throw new Error("Session expired. Please login again.");
    }
  },

  async logout(): Promise<void> {
    try {
      // The backend blacklists the access token and clears the httpOnly cookies.
      await axios.post(
        `${API_BASE_URL}/users/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
};

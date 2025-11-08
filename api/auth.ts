import axios from "axios";
import axiosInstance from "@/lib/axios";
import { AuthError, SignInResponse, UserSignInParams } from "@/@types/auth";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

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
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error("Registration failed. Please try again.");
    }
  },
  // async signin(data: UserSignInParams) {
  async signin(data: UserSignInParams): Promise<SignInResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        email: data.email,
        password: data.password,
      });

      // Store both access and refresh tokens
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);

      // Set default authorization header
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.access_token}`;

      return response.data;
    } catch (error: any) {
      if (
        error.response?.data?.detail?.message ===
        "Please verify your email before signing in"
      ) {
        const err = new Error(error.response.data.detail.message) as Error &
          AuthError;
        err.type = "UNVERIFIED_EMAIL";
        err.email = error.response.data.detail.email;
        throw err;
      }
      if (error.response?.data?.detail?.message) {
        const err = new Error(error.response.data.detail.message) as Error &
          AuthError;
        err.type = "INVALID_CREDENTIALS";
        throw err;
      }
      const err = new Error(
        "Sign in failed. Please check your credentials."
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
      if (error.response?.data?.detail?.[0]?.msg) {
        throw new Error(error.response.data.detail[0].msg);
      }
      throw new Error(
        error.response?.data?.detail || "Failed to resend verification email"
      );
    }
  },

  async getCurrentUser() {
    try {
      const response = await axiosInstance.get(`/users/me`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch user data");
    }
  },

  async verifyEmail(token: string) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/verify-email/${token}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error("Email verification failed. Please try again.");
    }
  },

  async updatePersonalInfo(formData: FormData) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/users/me`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          },
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
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
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
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error("Failed to resend code. Please try again.");
    }
  },

  async getGoogleAuthUrl(): Promise<GoogleAuthUrlResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/social/google/auth`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to get auth URL");
    }
  },

  async googleSignIn({ code }: GoogleSignInParams): Promise<SignInResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/social/google/callback`,
        { code: code }
      );

      // Store both access and refresh tokens
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      
      // Set token in axios defaults
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access_token}`;

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Google sign in failed");
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
        }
      );

      // Store both access and refresh tokens
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.access_token}`;

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
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
        { code }
      );

      // Store both access and refresh tokens
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      
      // Set token in axios defaults
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access_token}`;

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Apple sign in failed");
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
      throw new Error(error.response?.data?.detail || "Failed to send OTP");
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
      throw new Error(error.response?.data?.detail || "Failed to verify phone number");
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
      throw new Error(error.response?.data?.detail || "Failed to send reset code");
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
      throw new Error(error.response?.data?.detail || "Failed to reset password");
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
      throw new Error(error.response?.data?.detail || "Failed to change password");
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
      throw new Error(error.response?.data?.detail || "Failed to disconnect social account");
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
      throw new Error(error.response?.data?.detail || "Failed to deactivate account");
    }
  },

  async refreshAccessToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await axios.post(
        `${API_BASE_URL}/users/refresh`,
        { refresh_token: refreshToken }
      );

      // Store new access token
      localStorage.setItem("token", response.data.access_token);
      
      // Update axios default header
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access_token}`;

      return response.data.access_token;
    } catch (error: any) {
      // If refresh fails, clear tokens and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      delete axios.defaults.headers.common["Authorization"];
      
      throw new Error("Session expired. Please login again.");
    }
  },

  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem("token");
      
      if (token) {
        // Call backend logout to blacklist the token
        await axios.post(
          `${API_BASE_URL}/users/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }
    } catch (error) {
      // Even if backend call fails, still clear local storage
      console.error("Logout error:", error);
    } finally {
      // Clear tokens from storage
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      
      // Remove authorization header
      delete axios.defaults.headers.common["Authorization"];
    }
  },
};

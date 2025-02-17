import axios from "axios";
import { AuthError, SignInResponse, UserSignInParams } from "@/@types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
      const response = await axios.post(`${API_BASE_URL}/users/signin`, {
        email: data.email,
        password: data.password,
      });

      // Store token in localStorage
      localStorage.setItem("token", response.data.access_token);

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
      const response = await axios.get(`${API_BASE_URL}/users/me`);
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
      const response = await axios.post(
        `${API_BASE_URL}/users/personal-info`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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
      const response = await axios.post(`${API_BASE_URL}/users/resend-code`, {
        email,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error("Failed to resend code. Please try again.");
    }
  },

  // Add to existing authApi object
  async googleSignIn(token: string): Promise<SignInResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/social/google`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("token", response.data.access_token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.access_token}`;

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error("Google sign in failed. Please try again.");
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

      localStorage.setItem("token", response.data.access_token);
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

  async appleSignIn(token: string): Promise<SignInResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/social/apple`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      localStorage.setItem("token", response.data.access_token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.access_token}`;

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error("Apple sign in failed. Please try again.");
    }
  },
};

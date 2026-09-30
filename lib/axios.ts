import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Extend AxiosRequestConfig to include retry properties
interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
  _isRetry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  withCredentials: true,
});

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Function to check if error is retryable (cold start, timeout, network error)
const isRetryableError = (error: AxiosError): boolean => {
  if (!error.response) {
    // Network error, timeout, or connection refused
    return true;
  }

  // Retry on 5xx server errors (but not 4xx client errors)
  const status = error.response.status;
  return status >= 500 && status < 600;
};

// Delay helper with exponential backoff
const delay = (ms: number, attempt: number) =>
  new Promise(resolve => setTimeout(resolve, ms * Math.pow(2, attempt - 1)));

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(null);
    }
  });

  failedQueue = [];
};

// Response interceptor to handle token refresh and retries.
// Auth travels in httpOnly cookies, so there is no token to read or attach here.
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: RetryConfig = error.config;

    // Handle retries for cold starts and network errors
    if (isRetryableError(error) && !originalRequest._isRetry) {
      const retryCount = originalRequest._retryCount || 0;

      if (retryCount < MAX_RETRIES) {
        originalRequest._retryCount = retryCount + 1;
        originalRequest._isRetry = true;

        console.log(`Retrying request (attempt ${retryCount + 1}/${MAX_RETRIES})...`, error.message);

        // Wait before retrying with exponential backoff
        await delay(RETRY_DELAY, retryCount + 1);

        return axiosInstance(originalRequest);
      }

      console.error(`Max retries (${MAX_RETRIES}) exceeded for request`);
    }

    // Check if the error is due to an expired token (401 or 403)
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // The refresh_token cookie is sent automatically; the response sets a new access_token cookie.
        await axios.post(`${API_BASE_URL}/users/refresh`, {}, { withCredentials: true });

        processQueue(null);

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        processQueue(refreshError);

        // Redirect to home page (signin modal will open)
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

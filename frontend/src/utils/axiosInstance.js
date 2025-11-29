import axios from "axios";
import { BASE_URL } from "./constants";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // Increased to 60 seconds for Render cold starts
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable credentials for CORS
});

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Helper function for retry delay with exponential backoff
const retryDelay = (retryCount) => {
  return new Promise(resolve => {
    setTimeout(resolve, RETRY_DELAY * Math.pow(2, retryCount));
  });
};

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    console.log(`🔵 Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("🔴 Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor with retry logic
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  async (error) => {
    const config = error.config;

    // Log the error
    console.error(`❌ Response error: ${error.message}`, {
      url: config?.url,
      status: error.response?.status,
      code: error.code
    });

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Retry logic for timeout and network errors
    if (!config || !config.retry) {
      config.retry = 0;
    }

    const shouldRetry = (
      config.retry < MAX_RETRIES &&
      (error.code === 'ECONNABORTED' || // Timeout
        error.code === 'ERR_NETWORK' ||  // Network error
        error.response?.status === 503 || // Service unavailable
        error.response?.status === 504)   // Gateway timeout
    );

    if (shouldRetry) {
      config.retry += 1;
      console.log(`🔄 Retrying request (${config.retry}/${MAX_RETRIES}): ${config.url}`);

      await retryDelay(config.retry - 1);
      return axiosInstance(config);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;


import { boot } from "quasar/wrappers";
import axios from "axios";

// Create a custom axios instance
const api = axios.create({
  baseURL: "https://wsi-be.netlify.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default boot(({ app, router }) => {
  // Request Interceptor: Add Authorization Header
  api.interceptors.request.use(
    (config) => {
      const token = sessionStorage.getItem("access-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      // Handle request errors
      return Promise.reject(error);
    }
  );

  // Response Interceptor: Handle 401/403 Unauthorized
  api.interceptors.response.use(
    (response) => {
      // Return the response if successful
      return response;
    },
    (error) => {
      console.error("API Error:", error);

      // Handle 401 and 403 errors globally
      if (error.response?.status === 401 || error.response?.status === 403) {
        sessionStorage.clear(); // Clear stored tokens or sensitive data
        router.push({ path: "/", query: { expired: "true" } }); // Redirect to mobile login route
      }

      // Reject other errors to allow local handling
      return Promise.reject(error);
    }
  );

  // Make the axios instance available globally
  app.config.globalProperties.$axios = axios; // Generic axios
  app.config.globalProperties.$api = api; // Custom API instance
});

export { api };
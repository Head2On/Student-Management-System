// src/lib/apiClient.ts
import axios from 'axios';

// 1. Get the backend URL from environment variables
const baseURL = process.env.NEXT_PUBLIC_API_URL;

// 2. Create the axios instance
const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Check if window is defined (i.e., we are in the browser)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      
      // THIS IS THE FIX:
      // Only add the token if it exists AND the URL is NOT the login page.
      if (token && config.url !== '/api/users/login/') {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
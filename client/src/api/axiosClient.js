import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token if saved in localStorage
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('code_minder_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common error states
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0] ||
      error.message ||
      'An unexpected error occurred';

    // If unauthorized and not already on auth pages, clear stored token
    if (error.response?.status === 401) {
      localStorage.removeItem('code_minder_token');
      localStorage.removeItem('code_minder_user');
    }

    return Promise.reject(new Error(message));
  }
);

export default axiosClient;

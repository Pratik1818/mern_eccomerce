/**
 * Axios instance for API calls. In dev, use /api/v1 (Vite proxy to backend). Else use env or 8005.
 */
import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '/api/v1' : 'http://localhost:8005/api/v1');

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT from localStorage to requests (for SPA when not using cookie)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, clear token and optionally redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      // Dispatch or redirect can be done via a custom event or store
    }
    return Promise.reject(err);
  }
);

export default api;
export { API_URL };

import axios from 'axios';

const USER_SERVICE_BASE = import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:5001/api';
const ORDER_SERVICE_BASE = import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:5002/api';

// Create Axios instances
export const userProductApi = axios.create({
  baseURL: USER_SERVICE_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const orderCartApi = axios.create({
  baseURL: ORDER_SERVICE_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Helper to attach auth token
const attachAuthInterceptor = (apiInstance) => {
  apiInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Token expired or invalid
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Dispatch custom event to notify App
          window.dispatchEvent(new CustomEvent('auth:expired'));
        }
      }
      return Promise.reject(error);
    }
  );
};

attachAuthInterceptor(userProductApi);
attachAuthInterceptor(orderCartApi);

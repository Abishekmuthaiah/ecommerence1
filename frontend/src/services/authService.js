import { userProductApi } from './apiClient';

export const authService = {
  // Register user
  register: async (userData) => {
    const res = await userProductApi.post('/auth/register', userData);
    return res.data;
  },

  // Login user
  login: async (credentials) => {
    const res = await userProductApi.post('/auth/login', credentials);
    return res.data;
  },

  // Get current user profile
  getProfile: async () => {
    const res = await userProductApi.get('/users/profile');
    return res.data;
  },

  // Update profile
  updateProfile: async (data) => {
    const res = await userProductApi.put('/users/profile', data);
    return res.data;
  },

  // Get all users (admin)
  getAllUsers: async () => {
    const res = await userProductApi.get('/users');
    return res.data;
  },

  // Get user/product stats (admin)
  getStats: async () => {
    const res = await userProductApi.get('/stats/summary');
    return res.data;
  },
};

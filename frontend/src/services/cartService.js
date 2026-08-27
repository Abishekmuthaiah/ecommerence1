import { orderCartApi } from './apiClient';

export const cartService = {
  // Get cart for user
  getCart: async (userId) => {
    const res = await orderCartApi.get(`/cart/${userId}`);
    return res.data;
  },

  // Add item to cart
  addToCart: async (cartData) => {
    const res = await orderCartApi.post('/cart', cartData);
    return res.data;
  },

  // Update item quantity
  updateCartItem: async (id, quantity) => {
    const res = await orderCartApi.put(`/cart/${id}`, { quantity });
    return res.data;
  },

  // Remove single item
  removeCartItem: async (id) => {
    const res = await orderCartApi.delete(`/cart/${id}`);
    return res.data;
  },

  // Clear user cart
  clearCart: async (userId) => {
    const res = await orderCartApi.delete(`/cart/user/${userId}`);
    return res.data;
  },

  // Sync guest cart on login
  syncCart: async (userId, items) => {
    const res = await orderCartApi.post('/cart/sync', { user_id: userId, items });
    return res.data;
  },
};

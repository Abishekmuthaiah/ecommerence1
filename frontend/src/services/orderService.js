import { orderCartApi } from './apiClient';

export const orderService = {
  // Create order
  createOrder: async (orderData) => {
    const res = await orderCartApi.post('/orders', orderData);
    return res.data;
  },

  // Get user order history
  getUserOrders: async (userId) => {
    const res = await orderCartApi.get(`/orders/user/${userId}`);
    return res.data;
  },

  // Get single order details
  getOrderById: async (id) => {
    const res = await orderCartApi.get(`/orders/${id}`);
    return res.data;
  },

  // Update order status (admin)
  updateOrderStatus: async (id, statusData) => {
    const res = await orderCartApi.put(`/orders/${id}/status`, statusData);
    return res.data;
  },

  // Get all orders (admin)
  getAllOrders: async (params = {}) => {
    const res = await orderCartApi.get('/orders', { params });
    return res.data;
  },

  // Get order analytics & revenue stats (admin)
  getOrderStats: async () => {
    const res = await orderCartApi.get('/orders/stats/summary');
    return res.data;
  },

  // Cancel order (customer or admin)
  cancelOrder: async (id) => {
    const res = await orderCartApi.put(`/orders/${id}/cancel`);
    return res.data;
  },
};

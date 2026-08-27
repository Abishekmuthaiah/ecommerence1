import { userProductApi } from './apiClient';

export const productService = {
  // Get products with query parameters (search, category, sort, price, page, limit)
  getProducts: async (params = {}) => {
    const res = await userProductApi.get('/products', { params });
    return res.data;
  },

  // Get single product details
  getProductById: async (id) => {
    const res = await userProductApi.get(`/products/${id}`);
    return res.data;
  },

  // Create product (admin)
  createProduct: async (productData) => {
    const res = await userProductApi.post('/products', productData);
    return res.data;
  },

  // Update product (admin)
  updateProduct: async (id, productData) => {
    const res = await userProductApi.put(`/products/${id}`, productData);
    return res.data;
  },

  // Delete product (admin)
  deleteProduct: async (id) => {
    const res = await userProductApi.delete(`/products/${id}`);
    return res.data;
  },

  // Get all categories
  getCategories: async () => {
    const res = await userProductApi.get('/categories');
    return res.data;
  },

  // Create category (admin)
  createCategory: async (categoryData) => {
    const res = await userProductApi.post('/categories', categoryData);
    return res.data;
  },
};

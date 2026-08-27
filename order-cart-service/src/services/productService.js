const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const USER_PRODUCT_SERVICE_URL = process.env.USER_PRODUCT_SERVICE_URL || 'http://localhost:5001/api';

/**
 * Fetch product details by ID from User/Product Microservice
 */
async function getProductById(productId) {
  try {
    const response = await axios.get(`${USER_PRODUCT_SERVICE_URL}/products/${productId}`, {
      timeout: 5000,
    });
    if (response.data && response.data.success) {
      return response.data.product;
    }
    return null;
  } catch (error) {
    console.error(`⚠️ [Inter-Service Call] Failed to fetch product ${productId} from User/Product Service:`, error.message);
    return null;
  }
}

/**
 * Decrement product stock after order placement
 */
async function updateProductStock(items) {
  try {
    const payload = {
      items: items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
    };
    const response = await axios.post(`${USER_PRODUCT_SERVICE_URL}/products/reduce-stock`, payload, {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error('⚠️ [Inter-Service Call] Failed to reduce product stock:', error.message);
    // Non-blocking log, order already placed
    return null;
  }
}

module.exports = {
  getProductById,
  updateProductStock,
  USER_PRODUCT_SERVICE_URL,
};

const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getOrderStats,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', createOrder);
router.get('/user/:userId', getUserOrders);
router.get('/stats/summary', protect, adminOnly, getOrderStats);
router.get('/', protect, adminOnly, getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;

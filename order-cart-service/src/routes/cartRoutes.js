const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearUserCart,
  syncGuestCart,
} = require('../controllers/cartController');

router.post('/sync', syncGuestCart);
router.get('/:userId', getCart);
router.post('/', addToCart);
router.put('/:id', updateCartItem);
router.delete('/:id', removeCartItem);
router.delete('/user/:userId', clearUserCart);

module.exports = router;

const { CartItem } = require('../models');
const { getProductById } = require('../services/productService');

// @desc    Get cart items for a user
// @route   GET /api/cart/:userId
// @access  Public / Protected
const getCart = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const items = await CartItem.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
    });

    // Enrich cart items with live product data from Product Service
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const itemObj = item.toJSON();
        const liveProduct = await getProductById(item.product_id);
        if (liveProduct) {
          itemObj.product_name = liveProduct.name;
          itemObj.product_image = liveProduct.image;
          itemObj.current_price = liveProduct.discount_price || liveProduct.price;
          itemObj.original_price = liveProduct.price;
          itemObj.stock = liveProduct.stock;
          itemObj.category = liveProduct.category;
        }
        return itemObj;
      })
    );

    const subtotal = enrichedItems.reduce(
      (sum, item) => sum + (parseFloat(item.current_price || item.price) * item.quantity),
      0
    );

    res.json({
      success: true,
      count: enrichedItems.length,
      items: enrichedItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching cart',
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Public / Protected
const addToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity, price, product_name, product_image } = req.body;

    if (!user_id || !product_id) {
      return res.status(400).json({
        success: false,
        message: 'user_id and product_id are required',
      });
    }

    const qty = parseInt(quantity, 10) || 1;

    // Cross-Service Validation: Check product existence and live price/stock
    const liveProduct = await getProductById(product_id);
    let finalPrice = price;
    let finalName = product_name;
    let finalImage = product_image;

    if (liveProduct) {
      if (liveProduct.stock <= 0) {
        return res.status(400).json({
          success: false,
          message: `"${liveProduct.name}" is currently out of stock`,
        });
      }
      finalPrice = liveProduct.discount_price || liveProduct.price;
      finalName = liveProduct.name;
      finalImage = liveProduct.image;
    }

    // Check if item already in user's cart
    let cartItem = await CartItem.findOne({
      where: { user_id: parseInt(user_id, 10), product_id: parseInt(product_id, 10) },
    });

    if (cartItem) {
      cartItem.quantity += qty;
      cartItem.price = finalPrice || cartItem.price;
      if (finalName) cartItem.product_name = finalName;
      if (finalImage) cartItem.product_image = finalImage;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        user_id: parseInt(user_id, 10),
        product_id: parseInt(product_id, 10),
        quantity: qty,
        price: finalPrice || 0,
        product_name: finalName || 'Product',
        product_image: finalImage || '',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      item: cartItem,
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error adding to cart',
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Public / Protected
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await CartItem.findByPk(req.params.id);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found',
      });
    }

    const newQty = parseInt(quantity, 10);
    if (newQty <= 0) {
      await cartItem.destroy();
      return res.json({
        success: true,
        message: 'Item removed from cart',
      });
    }

    cartItem.quantity = newQty;
    await cartItem.save();

    res.json({
      success: true,
      message: 'Cart item updated',
      item: cartItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating cart item',
    });
  }
};

// @desc    Remove single item from cart
// @route   DELETE /api/cart/:id
// @access  Public / Protected
const removeCartItem = async (req, res) => {
  try {
    const cartItem = await CartItem.findByPk(req.params.id);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found',
      });
    }

    await cartItem.destroy();

    res.json({
      success: true,
      message: 'Item removed from cart',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error removing cart item',
    });
  }
};

// @desc    Clear all items for a user
// @route   DELETE /api/cart/user/:userId
// @access  Public / Protected
const clearUserCart = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    await CartItem.destroy({
      where: { user_id: userId },
    });

    res.json({
      success: true,
      message: 'Cart cleared successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error clearing cart',
    });
  }
};

// @desc    Sync / merge guest cart items with DB on login
// @route   POST /api/cart/sync
// @access  Public / Protected
const syncGuestCart = async (req, res) => {
  try {
    const { user_id, items } = req.body;
    if (!user_id || !Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'user_id and items array are required' });
    }

    for (const item of items) {
      const liveProduct = await getProductById(item.product_id);
      const price = liveProduct ? (liveProduct.discount_price || liveProduct.price) : item.price;
      const name = liveProduct ? liveProduct.name : item.product_name;
      const image = liveProduct ? liveProduct.image : item.product_image;

      let cartItem = await CartItem.findOne({
        where: { user_id: parseInt(user_id, 10), product_id: parseInt(item.product_id, 10) },
      });

      if (cartItem) {
        cartItem.quantity += parseInt(item.quantity, 10) || 1;
        await cartItem.save();
      } else {
        await CartItem.create({
          user_id: parseInt(user_id, 10),
          product_id: parseInt(item.product_id, 10),
          quantity: parseInt(item.quantity, 10) || 1,
          price: price || 0,
          product_name: name || 'Product',
          product_image: image || '',
        });
      }
    }

    res.json({
      success: true,
      message: 'Cart synchronized successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearUserCart,
  syncGuestCart,
};

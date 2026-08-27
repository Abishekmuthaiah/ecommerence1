const { Order, OrderItem, CartItem } = require('../models');
const { getProductById, updateProductStock } = require('../services/productService');
const { Op } = require('sequelize');

// @desc    Create new order & clear cart
// @route   POST /api/orders
// @access  Public / Protected
const createOrder = async (req, res) => {
  try {
    const {
      user_id,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      city,
      state,
      pincode,
      payment_method,
      items,
    } = req.body;

    if (!user_id || !customer_name || !customer_email || !shipping_address || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required customer & shipping details',
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order',
      });
    }

    // Step 1: Validate stock & pricing for all items from Product Service
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await getProductById(item.product_id);
      const qty = parseInt(item.quantity, 10) || 1;
      
      let itemPrice = item.price;
      let itemName = item.product_name;
      let itemImage = item.product_image;

      if (product) {
        if (product.stock < qty) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for "${product.name}". Only ${product.stock} available.`,
          });
        }
        itemPrice = product.discount_price || product.price;
        itemName = product.name;
        itemImage = product.image;
      }

      const itemTotal = parseFloat((itemPrice * qty).toFixed(2));
      subtotal += itemTotal;

      validatedItems.push({
        product_id: parseInt(item.product_id, 10),
        product_name: itemName,
        product_image: itemImage,
        price: parseFloat(itemPrice),
        quantity: qty,
        total: itemTotal,
      });
    }

    // Calculate totals
    const shipping_fee = subtotal > 100 ? 0.00 : 9.99; // Free shipping over $100
    const total_amount = parseFloat((subtotal + shipping_fee).toFixed(2));

    const payment_status = payment_method === 'Cash on Delivery' ? 'Pending' : 'Paid';

    // Step 2: Create Order in MySQL
    const order = await Order.create({
      user_id: parseInt(user_id, 10),
      customer_name,
      customer_email,
      customer_phone: customer_phone || '',
      shipping_address,
      city,
      state,
      pincode,
      payment_method: payment_method || 'Demo Online Payment',
      payment_status,
      order_status: 'Confirmed',
      subtotal: parseFloat(subtotal.toFixed(2)),
      shipping_fee,
      total_amount,
    });

    // Step 3: Create Order Items
    const orderItemsData = validatedItems.map(item => ({
      ...item,
      order_id: order.id,
    }));
    await OrderItem.bulkCreate(orderItemsData);

    // Step 4: Decrement stock in User & Product Microservice via REST API
    await updateProductStock(validatedItems);

    // Step 5: Clear User's Cart
    await CartItem.destroy({
      where: { user_id: parseInt(user_id, 10) },
    });

    // Return complete order
    const completedOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items' }],
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: completedOrder,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating order',
    });
  }
};

// @desc    Get user's order history
// @route   GET /api/orders/user/:userId
// @access  Public / Protected
const getUserOrders = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [{ model: OrderItem, as: 'items' }],
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user orders',
    });
  }
};

// @desc    Get single order details
// @route   GET /api/orders/:id
// @access  Public / Protected
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: 'items' }],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order #${req.params.id} not found`,
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching order details',
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status, payment_status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (status) {
      const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Valid values: ${validStatuses.join(', ')}`,
        });
      }
      order.order_status = status;
    }

    if (payment_status) {
      order.payment_status = payment_status;
    }

    await order.save();

    const updated = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items' }],
    });

    res.json({
      success: true,
      message: `Order status updated to ${order.order_status}`,
      order: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating order status',
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const { status, search, limit = 50, page = 1 } = req.query;
    const whereClause = {};

    if (status && status !== 'All') {
      whereClause.order_status = status;
    }

    if (search) {
      whereClause[Op.or] = [
        { customer_name: { [Op.like]: `%${search}%` } },
        { customer_email: { [Op.like]: `%${search}%` } },
        { id: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [{ model: OrderItem, as: 'items' }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit, 10),
      offset,
    });

    res.json({
      success: true,
      total: count,
      page: parseInt(page, 10),
      pages: Math.ceil(count / parseInt(limit, 10)),
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching all orders',
    });
  }
};

// @desc    Get order dashboard metrics / stats
// @route   GET /api/orders/stats/summary
// @access  Private/Admin
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.count();
    const pendingOrders = await Order.count({ where: { order_status: { [Op.in]: ['Pending', 'Confirmed', 'Processing'] } } });
    const deliveredOrders = await Order.count({ where: { order_status: 'Delivered' } });
    const cancelledOrders = await Order.count({ where: { order_status: 'Cancelled' } });
    
    const revenueResult = await Order.sum('total_amount', {
      where: { order_status: { [Op.ne]: 'Cancelled' } },
    });

    const totalRevenue = revenueResult || 0;

    const recentOrders = await Order.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      include: [{ model: OrderItem, as: 'items' }],
    });

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      },
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error calculating order statistics',
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getOrderStats,
};

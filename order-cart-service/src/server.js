const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/db');
const { Order, OrderItem } = require('./models');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    service: 'order-cart-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found on Order & Cart Service`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Order-Cart Service Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Auto seed initial demo orders if empty
async function autoSeedOrders() {
  try {
    const count = await Order.count();
    if (count === 0) {
      console.log('🌱 Seeding initial demo customer orders...');
      const order1 = await Order.create({
        id: 1,
        user_id: 2,
        customer_name: 'Alex Customer',
        customer_email: 'customer@ecommerce.com',
        customer_phone: '+1 555-0144',
        shipping_address: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'Oregon',
        pincode: '97477',
        payment_method: 'Demo Online Payment',
        payment_status: 'Paid',
        order_status: 'Delivered',
        subtotal: 149.99,
        shipping_fee: 0.00,
        total_amount: 149.99,
      });

      await OrderItem.create({
        order_id: order1.id,
        product_id: 1,
        product_name: 'AeroSound Pro Wireless Headphones',
        product_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        price: 149.99,
        quantity: 1,
        total: 149.99,
      });

      const order2 = await Order.create({
        id: 2,
        user_id: 2,
        customer_name: 'Alex Customer',
        customer_email: 'customer@ecommerce.com',
        customer_phone: '+1 555-0144',
        shipping_address: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'Oregon',
        pincode: '97477',
        payment_method: 'Cash on Delivery',
        payment_status: 'Pending',
        order_status: 'Processing',
        subtotal: 109.99,
        shipping_fee: 0.00,
        total_amount: 109.99,
      });

      await OrderItem.create({
        order_id: order2.id,
        product_id: 7,
        product_name: 'HyperKey Pro Mechanical Keyboard',
        product_image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
        price: 109.99,
        quantity: 1,
        total: 109.99,
      });
    }
  } catch (err) {
    console.error('⚠️ Auto-seed orders notice:', err.message);
  }
}

// Start Server
async function startServer() {
  try {
    await connectDB();
    await sequelize.sync({ alter: false });
    await autoSeedOrders();

    app.listen(PORT, () => {
      console.log(`🚀 [Order & Cart Service] running at http://localhost:${PORT}`);
      console.log(`   - API Base: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start Order & Cart Service:', error);
    process.exit(1);
  }
}

startServer();

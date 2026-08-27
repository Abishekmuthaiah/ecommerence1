const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/db');
const { User, Category, Product } = require('./models');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    service: 'user-product-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found on User & Product Service`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[User-Product Service Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Seed default data if empty
async function autoSeed() {
  try {
    const userCount = await User.count();
    if (userCount === 0) {
      console.log('🌱 Seeding initial demo users...');
      const adminPassword = await bcrypt.hash('Admin@123', 10);
      const customerPassword = await bcrypt.hash('Customer@123', 10);

      await User.bulkCreate([
        {
          id: 1,
          name: 'Admin User',
          email: 'admin@ecommerce.com',
          password: adminPassword,
          phone: '+1 555-0199',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        },
        {
          id: 2,
          name: 'Alex Customer',
          email: 'customer@ecommerce.com',
          password: customerPassword,
          phone: '+1 555-0144',
          role: 'customer',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        },
      ]);
    }

    const categoryCount = await Category.count();
    if (categoryCount === 0) {
      console.log('🌱 Seeding initial categories...');
      await Category.bulkCreate([
        { id: 1, name: 'Electronics', slug: 'electronics', description: 'Cutting-edge consumer gadgets, smart home devices, and displays.', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600' },
        { id: 2, name: 'Audio', slug: 'audio', description: 'High-fidelity audio, studio monitors, noise-cancelling headphones.', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600' },
        { id: 3, name: 'Wearables', slug: 'wearables', description: 'Smart watches, fitness trackers, and modern personal tech.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600' },
        { id: 4, name: 'Gaming', slug: 'gaming', description: 'Pro-grade gaming peripherals, mechanical keyboards, and precision mice.', image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600' },
        { id: 5, name: 'Accessories', slug: 'accessories', description: 'Durable cables, fast chargers, ergonomic stands, and everyday carry gear.', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600' },
      ]);
    }

    const productCount = await Product.count();
    if (productCount === 0) {
      console.log('🌱 Seeding initial products...');
      await Product.bulkCreate([
        { id: 1, name: 'AeroSound Pro Wireless Headphones', slug: 'aerosound-pro-wireless-headphones', description: 'Engineered with active noise cancellation, 40-hour battery life, and ultra-comfortable memory foam ear cushions for studio quality listening.', price: 14999.00, discount_price: 11999.00, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', category: 'Audio', category_id: 2, stock: 45, rating: 4.8, num_reviews: 128, is_featured: true },
        { id: 2, name: 'Titan Horizon Smart Watch Ultra', slug: 'titan-horizon-smart-watch-ultra', description: 'Sapphire glass display with precision dual-frequency GPS, biometric health tracking, ECG monitoring, and 7-day battery life in a titanium case.', price: 24999.00, discount_price: 19999.00, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', category: 'Wearables', category_id: 3, stock: 30, rating: 4.9, num_reviews: 95, is_featured: true },
        { id: 3, name: 'Apex Stealth 16 Gaming Laptop', slug: 'apex-stealth-16-gaming-laptop', description: 'Powered by Intel Core i9 processor, NVIDIA RTX 4080 GPU, 32GB DDR5 RAM, and a blistering fast 240Hz QHD display for uncompromising power.', price: 179999.00, discount_price: 149999.00, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800', category: 'Electronics', category_id: 1, stock: 15, rating: 4.9, num_reviews: 64, is_featured: true },
        { id: 4, name: 'Nova Ultra 5G Smartphone', slug: 'nova-ultra-5g-smartphone', description: '6.8-inch Dynamic AMOLED 2X display, 200MP pro-grade camera sensor, all-day battery with 65W fast charging, and edge-to-edge titanium frame.', price: 79999.00, discount_price: 69999.00, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800', category: 'Electronics', category_id: 1, stock: 25, rating: 4.7, num_reviews: 210, is_featured: true },
        { id: 5, name: 'PulseWave 360 Bluetooth Speaker', slug: 'pulsewave-360-bluetooth-speaker', description: 'IPX7 waterproof portable speaker with punchy bass, dual passive radiators, 24-hour playtime, and synchronized LED ambient party light ring.', price: 6999.00, discount_price: 4999.00, image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800', category: 'Audio', category_id: 2, stock: 60, rating: 4.6, num_reviews: 88, is_featured: false },
        { id: 6, name: 'Viper Claw RGB Gaming Mouse', slug: 'viper-claw-rgb-gaming-mouse', description: 'Ultra-lightweight 58g honeycomb design, 26,000 DPI optical sensor, optical mechanical switches, and lag-free 1ms 2.4GHz wireless connection.', price: 4499.00, discount_price: 3299.00, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800', category: 'Gaming', category_id: 4, stock: 80, rating: 4.7, num_reviews: 142, is_featured: true },
        { id: 7, name: 'HyperKey Pro Mechanical Keyboard', slug: 'hyperkey-pro-mechanical-keyboard', description: 'Custom hot-swappable linear mechanical switches, solid aluminum chassis, sound dampening foam, RGB backlighting, and programmable macro dial.', price: 9999.00, discount_price: 7999.00, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800', category: 'Gaming', category_id: 4, stock: 40, rating: 4.8, num_reviews: 115, is_featured: false },
        { id: 8, name: 'VoltCharge 100W GaN Fast Charger', slug: 'voltcharge-100w-gan-fast-charger', description: 'Compact multi-port USB-C Gallium Nitride wall charger with intelligent power distribution. Charges 3 devices simultaneously at maximum speed.', price: 3999.00, discount_price: 2999.00, image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800', category: 'Accessories', category_id: 5, stock: 120, rating: 4.9, num_reviews: 310, is_featured: false },
        { id: 9, name: 'UrbanShield Waterproof Tech Backpack', slug: 'urbanshield-waterproof-tech-backpack', description: 'Anti-theft ergonomic commuter backpack with padded 16-inch laptop compartment, hidden passport pocket, and integrated USB pass-through port.', price: 5999.00, discount_price: 4499.00, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', category: 'Accessories', category_id: 5, stock: 50, rating: 4.6, num_reviews: 75, is_featured: false },
        { id: 10, name: 'QuantumView 65" 4K OLED Smart TV', slug: 'quantumview-65-4k-oled-smart-tv', description: 'Stunning self-lit OLED pixels, Dolby Vision HDR, Dolby Atmos spatial audio, HDMI 2.1 120Hz gaming mode, and hands-free voice assistant.', price: 129999.00, discount_price: 109999.00, image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800', category: 'Electronics', category_id: 1, stock: 10, rating: 4.8, num_reviews: 52, is_featured: true },
        { id: 11, name: 'StudioVibe Wireless Earbuds', slug: 'studiovibe-wireless-earbuds', description: 'Crystal-clear acoustic clarity, transparency mode, water resistance, and pocket-sized wireless charging case with 32-hour overall endurance.', price: 7999.00, discount_price: 5999.00, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800', category: 'Audio', category_id: 2, stock: 70, rating: 4.5, num_reviews: 93, is_featured: false },
        { id: 12, name: 'ArmorFlex Ergonomic Laptop Stand', slug: 'armorflex-ergonomic-laptop-stand', description: 'Premium aircraft-grade anodized aluminum riser with 360-degree rotation and adjustable height for optimal posture and efficient cooling.', price: 2999.00, discount_price: 1999.00, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800', category: 'Accessories', category_id: 5, stock: 90, rating: 4.7, num_reviews: 68, is_featured: false },
      ]);
    }
  } catch (err) {
    console.error('⚠️ Auto-seed notice:', err.message);
  }
}

// Start Server
async function startServer() {
  try {
    await connectDB();
    await sequelize.sync({ alter: false });
    await autoSeed();

    app.listen(PORT, () => {
      console.log(`🚀 [User & Product Service] running at http://localhost:${PORT}`);
      console.log(`   - API Base: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start User & Product Service:', error);
    process.exit(1);
  }
}

startServer();

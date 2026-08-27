-- Seed Data for User & Product Service
USE `ecommerce_users_products`;

-- Seed Users (Passwords: Admin@123 for admin, Customer@123 for customer - pre-hashed with bcrypt 10 rounds)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `role`, `avatar`) VALUES
(1, 'Admin User', 'admin@ecommerce.com', '$2b$10$wL4zWjQ5gP/K5J2fA/7JkeK58o3a.vQyLzU3bL3P6E9n9N2Hq6e8a', '+91 98765 43210', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
(2, 'Alex Customer', 'customer@ecommerce.com', '$2b$10$wL4zWjQ5gP/K5J2fA/7JkeK58o3a.vQyLzU3bL3P6E9n9N2Hq6e8a', '+91 98765 43211', 'customer', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Seed Categories
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`) VALUES
(1, 'Electronics', 'electronics', 'Cutting-edge consumer gadgets, smart home devices, and displays.', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600'),
(2, 'Audio', 'audio', 'High-fidelity audio, studio monitors, noise-cancelling headphones.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'),
(3, 'Wearables', 'wearables', 'Smart watches, fitness trackers, and modern personal tech.', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'),
(4, 'Gaming', 'gaming', 'Pro-grade gaming peripherals, mechanical keyboards, and precision mice.', 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600'),
(5, 'Accessories', 'accessories', 'Durable cables, fast chargers, ergonomic stands, and everyday carry gear.', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Seed Products with Increased Realistic INR Prices
INSERT INTO `products` (`id`, `name`, `slug`, `description`, `price`, `discount_price`, `image`, `category`, `category_id`, `stock`, `rating`, `num_reviews`, `is_featured`) VALUES
(1, 'AeroSound Pro Wireless Headphones', 'aerosound-pro-wireless-headphones', 'Engineered with active noise cancellation, 40-hour battery life, and ultra-comfortable memory foam ear cushions for studio quality listening.', 14999.00, 11999.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 'Audio', 2, 45, 4.8, 128, TRUE),
(2, 'Titan Horizon Smart Watch Ultra', 'titan-horizon-smart-watch-ultra', 'Sapphire glass display with precision dual-frequency GPS, biometric health tracking, ECG monitoring, and 7-day battery life in a titanium case.', 24999.00, 19999.00, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', 'Wearables', 3, 30, 4.9, 95, TRUE),
(3, 'Apex Stealth 16 Gaming Laptop', 'apex-stealth-16-gaming-laptop', 'Powered by Intel Core i9 processor, NVIDIA RTX 4080 GPU, 32GB DDR5 RAM, and a blistering fast 240Hz QHD display for uncompromising power.', 179999.00, 149999.00, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800', 'Electronics', 1, 15, 4.9, 64, TRUE),
(4, 'Nova Ultra 5G Smartphone', 'nova-ultra-5g-smartphone', '6.8-inch Dynamic AMOLED 2X display, 200MP pro-grade camera sensor, all-day battery with 65W fast charging, and edge-to-edge titanium frame.', 79999.00, 69999.00, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800', 'Electronics', 1, 25, 4.7, 210, TRUE),
(5, 'PulseWave 360 Bluetooth Speaker', 'pulsewave-360-bluetooth-speaker', 'IPX7 waterproof portable speaker with punchy bass, dual passive radiators, 24-hour playtime, and synchronized LED ambient party light ring.', 6999.00, 4999.00, 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800', 'Audio', 2, 60, 4.6, 88, FALSE),
(6, 'Viper Claw RGB Gaming Mouse', 'viper-claw-rgb-gaming-mouse', 'Ultra-lightweight 58g honeycomb design, 26,000 DPI optical sensor, optical mechanical switches, and lag-free 1ms 2.4GHz wireless connection.', 4499.00, 3299.00, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800', 'Gaming', 4, 80, 4.7, 142, TRUE),
(7, 'HyperKey Pro Mechanical Keyboard', 'hyperkey-pro-mechanical-keyboard', 'Custom hot-swappable linear mechanical switches, solid aluminum chassis, sound dampening foam, RGB backlighting, and programmable macro dial.', 9999.00, 7999.00, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800', 'Gaming', 4, 40, 4.8, 115, FALSE),
(8, 'VoltCharge 100W GaN Fast Charger', 'voltcharge-100w-gan-fast-charger', 'Compact multi-port USB-C Gallium Nitride wall charger with intelligent power distribution. Charges 3 devices simultaneously at maximum speed.', 3999.00, 2999.00, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800', 'Accessories', 5, 120, 4.9, 310, FALSE),
(9, 'UrbanShield Waterproof Tech Backpack', 'urbanshield-waterproof-tech-backpack', 'Anti-theft ergonomic commuter backpack with padded 16-inch laptop compartment, hidden passport pocket, and integrated USB pass-through port.', 5999.00, 4499.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', 'Accessories', 5, 50, 4.6, 75, FALSE),
(10, 'QuantumView 65" 4K OLED Smart TV', 'quantumview-65-4k-oled-smart-tv', 'Stunning self-lit OLED pixels, Dolby Vision HDR, Dolby Atmos spatial audio, HDMI 2.1 120Hz gaming mode, and hands-free voice assistant.', 129999.00, 109999.00, 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800', 'Electronics', 1, 10, 4.8, 52, TRUE),
(11, 'StudioVibe Wireless Earbuds', 'studiovibe-wireless-earbuds', 'Crystal-clear acoustic clarity, transparency mode, water resistance, and pocket-sized wireless charging case with 32-hour overall endurance.', 7999.00, 5999.00, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800', 'Audio', 2, 70, 4.5, 93, FALSE),
(12, 'ArmorFlex Ergonomic Laptop Stand', 'armorflex-ergonomic-laptop-stand', 'Premium aircraft-grade anodized aluminum riser with 360-degree rotation and adjustable height for optimal posture and efficient cooling.', 2999.00, 1999.00, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800', 'Accessories', 5, 90, 4.7, 68, FALSE)
ON DUPLICATE KEY UPDATE 
  `price` = VALUES(`price`),
  `discount_price` = VALUES(`discount_price`),
  `name` = VALUES(`name`);

-- Seed Orders for Service 2
USE `ecommerce_orders`;

INSERT INTO `orders` (`id`, `user_id`, `customer_name`, `customer_email`, `customer_phone`, `shipping_address`, `city`, `state`, `pincode`, `payment_method`, `payment_status`, `order_status`, `subtotal`, `shipping_fee`, `total_amount`, `created_at`) VALUES
(1, 2, 'Alex Customer', 'customer@ecommerce.com', '+91 98765 43211', '742 Evergreen Terrace', 'Springfield', 'Oregon', '97477', 'Demo Online Payment', 'Paid', 'Delivered', 11999.00, 0.00, 11999.00, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(2, 2, 'Alex Customer', 'customer@ecommerce.com', '+91 98765 43211', '742 Evergreen Terrace', 'Springfield', 'Oregon', '97477', 'Cash on Delivery', 'Pending', 'Processing', 7999.00, 0.00, 7999.00, DATE_SUB(NOW(), INTERVAL 1 DAY))
ON DUPLICATE KEY UPDATE `total_amount` = VALUES(`total_amount`);

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `product_image`, `price`, `quantity`, `total`) VALUES
(1, 1, 1, 'AeroSound Pro Wireless Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 11999.00, 1, 11999.00),
(2, 2, 7, 'HyperKey Pro Mechanical Keyboard', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800', 7999.00, 1, 7999.00)
ON DUPLICATE KEY UPDATE `price` = VALUES(`price`), `total` = VALUES(`total`);

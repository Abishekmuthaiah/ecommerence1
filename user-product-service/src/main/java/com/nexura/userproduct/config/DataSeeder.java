package com.nexura.userproduct.config;

import com.nexura.userproduct.model.Category;
import com.nexura.userproduct.model.Product;
import com.nexura.userproduct.model.User;
import com.nexura.userproduct.repository.CategoryRepository;
import com.nexura.userproduct.repository.ProductRepository;
import com.nexura.userproduct.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedCategories();
        seedProducts();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            System.out.println("🌱 [User-Product Service] Seeding demo users...");

            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@ecommerce.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setPhone("+1 555-0199");
            admin.setRole("admin");
            admin.setAvatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150");

            User customer = new User();
            customer.setName("Alex Customer");
            customer.setEmail("customer@ecommerce.com");
            customer.setPassword(passwordEncoder.encode("Customer@123"));
            customer.setPhone("+1 555-0144");
            customer.setRole("customer");
            customer.setAvatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150");

            userRepository.saveAll(Arrays.asList(admin, customer));
        }
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            System.out.println("🌱 [User-Product Service] Seeding demo categories...");

            List<Category> categories = Arrays.asList(
                    new Category(null, "Electronics", "electronics", "Cutting-edge consumer gadgets, smart home devices, and displays.", "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600"),
                    new Category(null, "Audio", "audio", "High-fidelity audio, studio monitors, noise-cancelling headphones.", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"),
                    new Category(null, "Wearables", "wearables", "Smart watches, fitness trackers, and modern personal tech.", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"),
                    new Category(null, "Gaming", "gaming", "Pro-grade gaming peripherals, mechanical keyboards, and precision mice.", "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600"),
                    new Category(null, "Accessories", "accessories", "Durable cables, fast chargers, ergonomic stands, and everyday carry gear.", "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600")
            );

            categoryRepository.saveAll(categories);
        }
    }

    private void seedProducts() {
        if (productRepository.count() == 0) {
            System.out.println("🌱 [User-Product Service] Seeding demo products...");

            List<Product> products = Arrays.asList(
                    new Product(null, "AeroSound Pro Wireless Headphones", "aerosound-pro-wireless-headphones",
                            "Engineered with active noise cancellation, 40-hour battery life, and ultra-comfortable memory foam ear cushions for studio quality listening.",
                            14999.00, 11999.00, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
                            "Audio", 2L, 45, 4.8, 128, true),

                    new Product(null, "Titan Horizon Smart Watch Ultra", "titan-horizon-smart-watch-ultra",
                            "Sapphire glass display with precision dual-frequency GPS, biometric health tracking, ECG monitoring, and 7-day battery life in a titanium case.",
                            24999.00, 19999.00, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
                            "Wearables", 3L, 30, 4.9, 95, true),

                    new Product(null, "Apex Stealth 16 Gaming Laptop", "apex-stealth-16-gaming-laptop",
                            "Powered by Intel Core i9 processor, NVIDIA RTX 4080 GPU, 32GB DDR5 RAM, and a blistering fast 240Hz QHD display for uncompromising power.",
                            179999.00, 149999.00, "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800",
                            "Electronics", 1L, 15, 4.9, 64, true),

                    new Product(null, "Nova Ultra 5G Smartphone", "nova-ultra-5g-smartphone",
                            "6.8-inch Dynamic AMOLED 2X display, 200MP pro-grade camera sensor, all-day battery with 65W fast charging, and edge-to-edge titanium frame.",
                            79999.00, 69999.00, "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
                            "Electronics", 1L, 25, 4.7, 210, true),

                    new Product(null, "PulseWave 360 Bluetooth Speaker", "pulsewave-360-bluetooth-speaker",
                            "IPX7 waterproof portable speaker with punchy bass, dual passive radiators, 24-hour playtime, and synchronized LED ambient party light ring.",
                            6999.00, 4999.00, "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800",
                            "Audio", 2L, 60, 4.6, 88, false),

                    new Product(null, "Viper Claw RGB Gaming Mouse", "viper-claw-rgb-gaming-mouse",
                            "Ultra-lightweight 58g honeycomb design, 26,000 DPI optical sensor, optical mechanical switches, and lag-free 1ms 2.4GHz wireless connection.",
                            4499.00, 3299.00, "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800",
                            "Gaming", 4L, 80, 4.7, 142, true),

                    new Product(null, "HyperKey Pro Mechanical Keyboard", "hyperkey-pro-mechanical-keyboard",
                            "Custom hot-swappable linear mechanical switches, solid aluminum chassis, sound dampening foam, RGB backlighting, and programmable macro dial.",
                            9999.00, 7999.00, "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
                            "Gaming", 4L, 40, 4.8, 115, false),

                    new Product(null, "VoltCharge 100W GaN Fast Charger", "voltcharge-100w-gan-fast-charger",
                            "Compact multi-port USB-C Gallium Nitride wall charger with intelligent power distribution. Charges 3 devices simultaneously at maximum speed.",
                            3999.00, 2999.00, "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800",
                            "Accessories", 5L, 120, 4.9, 310, false),

                    new Product(null, "UrbanShield Waterproof Tech Backpack", "urbanshield-waterproof-tech-backpack",
                            "Anti-theft ergonomic commuter backpack with padded 16-inch laptop compartment, hidden passport pocket, and integrated USB pass-through port.",
                            5999.00, 4499.00, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
                            "Accessories", 5L, 50, 4.6, 75, false),

                    new Product(null, "QuantumView 65\" 4K OLED Smart TV", "quantumview-65-4k-oled-smart-tv",
                            "Stunning self-lit OLED pixels, Dolby Vision HDR, Dolby Atmos spatial audio, HDMI 2.1 120Hz gaming mode, and hands-free voice assistant.",
                            129999.00, 109999.00, "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800",
                            "Electronics", 1L, 10, 4.8, 52, true),

                    new Product(null, "StudioVibe Wireless Earbuds", "studiovibe-wireless-earbuds",
                            "Crystal-clear acoustic clarity, transparency mode, water resistance, and pocket-sized wireless charging case with 32-hour overall endurance.",
                            7999.00, 5999.00, "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
                            "Audio", 2L, 70, 4.5, 93, false),

                    new Product(null, "ArmorFlex Ergonomic Laptop Stand", "armorflex-ergonomic-laptop-stand",
                            "Premium aircraft-grade anodized aluminum riser with 360-degree rotation and adjustable height for optimal posture and efficient cooling.",
                            2999.00, 1999.00, "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
                            "Accessories", 5L, 90, 4.7, 68, false)
            );

            productRepository.saveAll(products);
        }
    }
}

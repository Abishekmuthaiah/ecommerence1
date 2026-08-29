package com.nexura.ordercart.config;

import com.nexura.ordercart.model.Order;
import com.nexura.ordercart.model.OrderItem;
import com.nexura.ordercart.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public void run(String... args) {
        if (orderRepository.count() == 0) {
            System.out.println("🌱 [Order-Cart Service] Seeding initial demo orders...");

            Order order1 = new Order();
            order1.setUserId(2L);
            order1.setCustomerName("Alex Customer");
            order1.setCustomerEmail("customer@ecommerce.com");
            order1.setCustomerPhone("+91 98765 43211");
            order1.setShippingAddress("742 Evergreen Terrace");
            order1.setCity("Springfield");
            order1.setState("Oregon");
            order1.setPincode("97477");
            order1.setPaymentMethod("Demo Online Payment");
            order1.setPaymentStatus("Paid");
            order1.setOrderStatus("Delivered");
            order1.setSubtotal(11999.00);
            order1.setShippingFee(0.00);
            order1.setTotalAmount(11999.00);

            OrderItem item1 = new OrderItem(
                    null,
                    null,
                    1L,
                    "AeroSound Pro Wireless Headphones",
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
                    11999.00,
                    1,
                    11999.00
            );
            order1.addItem(item1);
            orderRepository.save(order1);

            Order order2 = new Order();
            order2.setUserId(2L);
            order2.setCustomerName("Alex Customer");
            order2.setCustomerEmail("customer@ecommerce.com");
            order2.setCustomerPhone("+91 98765 43211");
            order2.setShippingAddress("742 Evergreen Terrace");
            order2.setCity("Springfield");
            order2.setState("Oregon");
            order2.setPincode("97477");
            order2.setPaymentMethod("Cash on Delivery");
            order2.setPaymentStatus("Pending");
            order2.setOrderStatus("Processing");
            order2.setSubtotal(7999.00);
            order2.setShippingFee(0.00);
            order2.setTotalAmount(7999.00);

            OrderItem item2 = new OrderItem(
                    null,
                    null,
                    7L,
                    "HyperKey Pro Mechanical Keyboard",
                    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
                    7999.00,
                    1,
                    7999.00
            );
            order2.addItem(item2);
            orderRepository.save(order2);
        }
    }
}

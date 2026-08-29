package com.nexura.ordercart.controller;

import com.nexura.ordercart.client.ProductServiceClient;
import com.nexura.ordercart.dto.CreateOrderRequest;
import com.nexura.ordercart.dto.LiveProductDto;
import com.nexura.ordercart.dto.OrderStatusRequest;
import com.nexura.ordercart.model.Order;
import com.nexura.ordercart.model.OrderItem;
import com.nexura.ordercart.repository.CartItemRepository;
import com.nexura.ordercart.repository.OrderRepository;
import jakarta.persistence.criteria.Predicate;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductServiceClient productServiceClient;

    private static final List<String> VALID_STATUSES = Arrays.asList(
            "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"
    );

    @PostMapping
    public ResponseEntity<?> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "No items in order");
            return ResponseEntity.badRequest().body(error);
        }

        double subtotal = 0.0;
        List<OrderItem> orderItems = new ArrayList<>();
        List<Map<String, Object>> stockItemsToReduce = new ArrayList<>();

        for (CreateOrderRequest.OrderItemDto itemDto : request.getItems()) {
            LiveProductDto product = productServiceClient.getProductById(itemDto.getProductId());
            int qty = itemDto.getQuantity() != null && itemDto.getQuantity() > 0 ? itemDto.getQuantity() : 1;

            double itemPrice = itemDto.getPrice() != null ? itemDto.getPrice() : 0.0;
            String itemName = itemDto.getProductName() != null ? itemDto.getProductName() : "Product";
            String itemImage = itemDto.getProductImage() != null ? itemDto.getProductImage() : "";

            if (product != null) {
                if (product.getStock() < qty) {
                    Map<String, Object> error = new HashMap<>();
                    error.put("success", false);
                    error.put("message", "Insufficient stock for \"" + product.getName() + "\". Only " + product.getStock() + " available.");
                    return ResponseEntity.badRequest().body(error);
                }
                itemPrice = product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice();
                itemName = product.getName();
                itemImage = product.getImage();
            }

            double itemTotal = BigDecimal.valueOf(itemPrice * qty).setScale(2, RoundingMode.HALF_UP).doubleValue();
            subtotal += itemTotal;

            OrderItem orderItem = new OrderItem(
                    null,
                    null,
                    itemDto.getProductId(),
                    itemName,
                    itemImage,
                    itemPrice,
                    qty,
                    itemTotal
            );
            orderItems.add(orderItem);

            Map<String, Object> reduceItem = new HashMap<>();
            reduceItem.put("product_id", itemDto.getProductId());
            reduceItem.put("quantity", qty);
            stockItemsToReduce.add(reduceItem);
        }

        subtotal = BigDecimal.valueOf(subtotal).setScale(2, RoundingMode.HALF_UP).doubleValue();
        double shippingFee = subtotal > 100.0 ? 0.00 : 9.99;
        double totalAmount = BigDecimal.valueOf(subtotal + shippingFee).setScale(2, RoundingMode.HALF_UP).doubleValue();

        String paymentMethod = request.getPaymentMethod() != null ? request.getPaymentMethod() : "Demo Online Payment";
        String paymentStatus = "Cash on Delivery".equalsIgnoreCase(paymentMethod) ? "Pending" : "Paid";

        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setCustomerPhone(request.getCustomerPhone() != null ? request.getCustomerPhone() : "");
        order.setShippingAddress(request.getShippingAddress());
        order.setCity(request.getCity());
        order.setState(request.getState());
        order.setPincode(request.getPincode());
        order.setPaymentMethod(paymentMethod);
        order.setPaymentStatus(paymentStatus);
        order.setOrderStatus("Confirmed");
        order.setSubtotal(subtotal);
        order.setShippingFee(shippingFee);
        order.setTotalAmount(totalAmount);

        for (OrderItem item : orderItems) {
            order.addItem(item);
        }

        Order savedOrder = orderRepository.save(order);

        // Reduce product stock in User-Product service
        productServiceClient.reduceStock(stockItemsToReduce);

        // Clear user's cart
        cartItemRepository.deleteByUserId(request.getUserId());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Order created successfully");
        response.put("order", savedOrder);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserOrders(@PathVariable Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", orders.size());
        response.put("orders", orders);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        Optional<Order> orderOpt = orderRepository.findById(id);

        if (orderOpt.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Order #" + id + " not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("order", orderOpt.get());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody OrderStatusRequest request) {
        Optional<Order> orderOpt = orderRepository.findById(id);

        if (orderOpt.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Order not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        Order order = orderOpt.get();

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            if (!VALID_STATUSES.contains(request.getStatus())) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Invalid status. Valid values: " + String.join(", ", VALID_STATUSES));
                return ResponseEntity.badRequest().body(error);
            }
            order.setOrderStatus(request.getStatus());
        }

        if (request.getPaymentStatus() != null && !request.getPaymentStatus().isBlank()) {
            order.setPaymentStatus(request.getPaymentStatus());
        }

        Order saved = orderRepository.save(order);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Order status updated to " + saved.getOrderStatus());
        response.put("order", saved);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<?> getAllOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "50") int limit) {

        int pageNumber = Math.max(0, page - 1);
        int pageSize = Math.max(1, limit);

        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));

        Specification<Order> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null && !status.trim().isEmpty() && !"all".equalsIgnoreCase(status)) {
                predicates.add(criteriaBuilder.equal(root.get("orderStatus"), status.trim()));
            }

            if (search != null && !search.trim().isEmpty()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                Predicate nameLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("customerName")), pattern);
                Predicate emailLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("customerEmail")), pattern);
                Predicate idLike = criteriaBuilder.like(root.get("id").as(String.class), "%" + search.trim() + "%");
                predicates.add(criteriaBuilder.or(nameLike, emailLike, idLike));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Page<Order> orderPage = orderRepository.findAll(spec, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("total", orderPage.getTotalElements());
        response.put("page", page);
        response.put("pages", orderPage.getTotalPages());
        response.put("orders", orderPage.getContent());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats/summary")
    public ResponseEntity<?> getOrderStats() {
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByOrderStatusIn(Arrays.asList("Pending", "Confirmed", "Processing"));
        long deliveredOrders = orderRepository.countByOrderStatus("Delivered");
        long cancelledOrders = orderRepository.countByOrderStatus("Cancelled");
        Double totalRevenue = orderRepository.sumTotalRevenue();
        if (totalRevenue == null) totalRevenue = 0.0;
        totalRevenue = BigDecimal.valueOf(totalRevenue).setScale(2, RoundingMode.HALF_UP).doubleValue();

        List<Order> recentOrders = orderRepository.findTop5ByOrderByCreatedAtDesc();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOrders", totalOrders);
        stats.put("pendingOrders", pendingOrders);
        stats.put("deliveredOrders", deliveredOrders);
        stats.put("cancelledOrders", cancelledOrders);
        stats.put("totalRevenue", totalRevenue);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("stats", stats);
        response.put("recentOrders", recentOrders);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {
        Optional<Order> orderOpt = orderRepository.findById(id);

        if (orderOpt.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Order #" + id + " not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        Order order = orderOpt.get();

        if ("Cancelled".equalsIgnoreCase(order.getOrderStatus())) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Order #" + id + " is already cancelled");
            return ResponseEntity.badRequest().body(error);
        }

        if ("Delivered".equalsIgnoreCase(order.getOrderStatus())) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Delivered orders cannot be cancelled");
            return ResponseEntity.badRequest().body(error);
        }

        order.setOrderStatus("Cancelled");
        if ("Paid".equalsIgnoreCase(order.getPaymentStatus())) {
            order.setPaymentStatus("Refunded");
        } else {
            order.setPaymentStatus("Cancelled");
        }

        Order saved = orderRepository.save(order);

        // Restock inventory in User-Product microservice
        if (saved.getItems() != null && !saved.getItems().isEmpty()) {
            List<Map<String, Object>> restockItems = new ArrayList<>();
            for (OrderItem item : saved.getItems()) {
                Map<String, Object> stockItem = new HashMap<>();
                stockItem.put("product_id", item.getProductId());
                stockItem.put("quantity", item.getQuantity());
                restockItems.add(stockItem);
            }
            productServiceClient.restockProduct(restockItems);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Order #" + id + " has been cancelled successfully");
        response.put("order", saved);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrderPost(@PathVariable Long id) {
        return cancelOrder(id);
    }
}

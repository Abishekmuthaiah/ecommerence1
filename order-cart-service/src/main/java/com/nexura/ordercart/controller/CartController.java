package com.nexura.ordercart.controller;

import com.nexura.ordercart.client.ProductServiceClient;
import com.nexura.ordercart.dto.AddToCartRequest;
import com.nexura.ordercart.dto.LiveProductDto;
import com.nexura.ordercart.dto.SyncCartRequest;
import com.nexura.ordercart.dto.UpdateCartRequest;
import com.nexura.ordercart.model.CartItem;
import com.nexura.ordercart.repository.CartItemRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductServiceClient productServiceClient;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getCart(@PathVariable Long userId) {
        List<CartItem> items = cartItemRepository.findByUserIdOrderByCreatedAtDesc(userId);

        double subtotal = 0.0;

        for (CartItem item : items) {
            LiveProductDto liveProduct = productServiceClient.getProductById(item.getProductId());
            if (liveProduct != null) {
                item.setProductName(liveProduct.getName());
                item.setProductImage(liveProduct.getImage());
                double currentPrice = liveProduct.getDiscountPrice() != null ? liveProduct.getDiscountPrice() : liveProduct.getPrice();
                item.setCurrentPrice(currentPrice);
                item.setOriginalPrice(liveProduct.getPrice());
                item.setStock(liveProduct.getStock());
                item.setCategory(liveProduct.getCategory());
                subtotal += currentPrice * item.getQuantity();
            } else {
                double price = item.getPrice() != null ? item.getPrice() : 0.0;
                item.setCurrentPrice(price);
                item.setOriginalPrice(price);
                subtotal += price * item.getQuantity();
            }
        }

        BigDecimal roundedSubtotal = BigDecimal.valueOf(subtotal).setScale(2, RoundingMode.HALF_UP);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", items.size());
        response.put("items", items);
        response.put("subtotal", roundedSubtotal.doubleValue());

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> addToCart(@Valid @RequestBody AddToCartRequest request) {
        int qty = request.getQuantity() != null && request.getQuantity() > 0 ? request.getQuantity() : 1;

        LiveProductDto liveProduct = productServiceClient.getProductById(request.getProductId());
        Double finalPrice = request.getPrice();
        String finalName = request.getProductName();
        String finalImage = request.getProductImage();

        if (liveProduct != null) {
            if (liveProduct.getStock() <= 0) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "\"" + liveProduct.getName() + "\" is currently out of stock");
                return ResponseEntity.badRequest().body(error);
            }
            finalPrice = liveProduct.getDiscountPrice() != null ? liveProduct.getDiscountPrice() : liveProduct.getPrice();
            finalName = liveProduct.getName();
            finalImage = liveProduct.getImage();
        }

        Optional<CartItem> existingOpt = cartItemRepository.findByUserIdAndProductId(request.getUserId(), request.getProductId());
        CartItem cartItem;

        if (existingOpt.isPresent()) {
            cartItem = existingOpt.get();
            cartItem.setQuantity(cartItem.getQuantity() + qty);
            if (finalPrice != null) cartItem.setPrice(finalPrice);
            if (finalName != null) cartItem.setProductName(finalName);
            if (finalImage != null) cartItem.setProductImage(finalImage);
            cartItem = cartItemRepository.save(cartItem);
        } else {
            cartItem = new CartItem(
                    null,
                    request.getUserId(),
                    request.getProductId(),
                    qty,
                    finalPrice != null ? finalPrice : 0.0,
                    finalName != null ? finalName : "Product",
                    finalImage != null ? finalImage : ""
            );
            cartItem = cartItemRepository.save(cartItem);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Item added to cart");
        response.put("item", cartItem);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCartItem(@PathVariable Long id, @RequestBody UpdateCartRequest request) {
        Optional<CartItem> cartItemOpt = cartItemRepository.findById(id);

        if (cartItemOpt.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Cart item not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        CartItem cartItem = cartItemOpt.get();
        int newQty = request.getQuantity() != null ? request.getQuantity() : 0;

        if (newQty <= 0) {
            cartItemRepository.delete(cartItem);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Item removed from cart");
            return ResponseEntity.ok(response);
        }

        cartItem.setQuantity(newQty);
        CartItem saved = cartItemRepository.save(cartItem);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Cart item updated");
        response.put("item", saved);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeCartItem(@PathVariable Long id) {
        Optional<CartItem> cartItemOpt = cartItemRepository.findById(id);

        if (cartItemOpt.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Cart item not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        cartItemRepository.delete(cartItemOpt.get());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Item removed from cart");

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<?> clearUserCart(@PathVariable Long userId) {
        cartItemRepository.deleteByUserId(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Cart cleared successfully");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/sync")
    public ResponseEntity<?> syncGuestCart(@RequestBody SyncCartRequest request) {
        if (request == null || request.getUserId() == null || request.getItems() == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "user_id and items array are required");
            return ResponseEntity.badRequest().body(error);
        }

        for (SyncCartRequest.SyncCartItem item : request.getItems()) {
            if (item.getProductId() != null) {
                LiveProductDto liveProduct = productServiceClient.getProductById(item.getProductId());
                Double price = liveProduct != null
                        ? (liveProduct.getDiscountPrice() != null ? liveProduct.getDiscountPrice() : liveProduct.getPrice())
                        : item.getPrice();
                String name = liveProduct != null ? liveProduct.getName() : item.getProductName();
                String image = liveProduct != null ? liveProduct.getImage() : item.getProductImage();
                int qty = item.getQuantity() != null && item.getQuantity() > 0 ? item.getQuantity() : 1;

                Optional<CartItem> existingOpt = cartItemRepository.findByUserIdAndProductId(request.getUserId(), item.getProductId());
                if (existingOpt.isPresent()) {
                    CartItem cartItem = existingOpt.get();
                    cartItem.setQuantity(cartItem.getQuantity() + qty);
                    cartItemRepository.save(cartItem);
                } else {
                    CartItem cartItem = new CartItem(
                            null,
                            request.getUserId(),
                            item.getProductId(),
                            qty,
                            price != null ? price : 0.0,
                            name != null ? name : "Product",
                            image != null ? image : ""
                    );
                    cartItemRepository.save(cartItem);
                }
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Cart synchronized successfully");

        return ResponseEntity.ok(response);
    }
}

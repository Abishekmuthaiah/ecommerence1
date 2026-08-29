package com.nexura.userproduct.controller;

import com.nexura.userproduct.repository.CategoryRepository;
import com.nexura.userproduct.repository.ProductRepository;
import com.nexura.userproduct.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/summary")
    public ResponseEntity<?> getStatsSummary() {
        long totalUsers = userRepository.countByRole("customer");
        long totalAdmins = userRepository.countByRole("admin");
        long totalProducts = productRepository.count();
        long totalCategories = categoryRepository.count();
        long lowStockProducts = productRepository.countByStockLessThanEqual(5);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalAdmins", totalAdmins);
        stats.put("totalProducts", totalProducts);
        stats.put("totalCategories", totalCategories);
        stats.put("lowStockProducts", lowStockProducts);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("stats", stats);

        return ResponseEntity.ok(response);
    }
}

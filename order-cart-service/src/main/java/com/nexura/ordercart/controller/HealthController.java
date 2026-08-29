package com.nexura.ordercart.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<?> checkHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("service", "order-cart-service");
        response.put("status", "healthy");
        response.put("timestamp", Instant.now().toString());

        return ResponseEntity.ok(response);
    }
}

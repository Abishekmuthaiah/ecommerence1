package com.nexura.ordercart.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexura.ordercart.dto.LiveProductDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProductServiceClient {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${user-product-service.url:http://localhost:5001/api}")
    private String userServiceUrl;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    public LiveProductDto getProductById(Long productId) {
        try {
            String url = userServiceUrl + "/products/" + productId;
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                if (root.path("success").asBoolean(false) && root.has("product")) {
                    return objectMapper.treeToValue(root.get("product"), LiveProductDto.class);
                }
            }
        } catch (Exception ex) {
            System.err.println("⚠️ [Inter-Service Call] Failed to fetch product #" + productId + ": " + ex.getMessage());
        }
        return null;
    }

    public boolean reduceStock(List<Map<String, Object>> items) {
        try {
            String url = userServiceUrl + "/products/reduce-stock";
            Map<String, Object> payload = new HashMap<>();
            payload.put("items", items);

            ResponseEntity<String> response = restTemplate.postForEntity(url, payload, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception ex) {
            System.err.println("⚠️ [Inter-Service Call] Failed to reduce stock: " + ex.getMessage());
            return false;
        }
    }

    public boolean restockProduct(List<Map<String, Object>> items) {
        try {
            String url = userServiceUrl + "/products/restock";
            Map<String, Object> payload = new HashMap<>();
            payload.put("items", items);

            ResponseEntity<String> response = restTemplate.postForEntity(url, payload, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception ex) {
            System.err.println("⚠️ [Inter-Service Call] Failed to restock product: " + ex.getMessage());
            return false;
        }
    }
}

package com.nexura.userproduct.controller;

import com.nexura.userproduct.dto.ProductRequest;
import com.nexura.userproduct.dto.StockReduceRequest;
import com.nexura.userproduct.model.Product;
import com.nexura.userproduct.repository.ProductRepository;
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    private String slugify(String text) {
        if (text == null) return "";
        return text.toLowerCase().trim().replaceAll("\\s+", "-").replaceAll("[^\\w-]+", "");
    }

    @GetMapping
    public ResponseEntity<?> getProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Boolean inStock) {

        int pageNumber = Math.max(0, page - 1);
        int pageSize = Math.max(1, limit);

        Sort sortOrder = Sort.by(Sort.Direction.DESC, "createdAt");
        if ("price_asc".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by(Sort.Direction.ASC, "price");
        } else if ("price_desc".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by(Sort.Direction.DESC, "price");
        } else if ("rating".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by(Sort.Direction.DESC, "rating");
        } else if ("name_asc".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by(Sort.Direction.ASC, "name");
        } else if ("oldest".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by(Sort.Direction.ASC, "createdAt");
        }

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sortOrder);

        String keyword = search != null ? search : q;

        Specification<Product> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (keyword != null && !keyword.trim().isEmpty()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                Predicate nameLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), pattern);
                Predicate descLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), pattern);
                Predicate catLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("category")), pattern);
                predicates.add(criteriaBuilder.or(nameLike, descLike, catLike));
            }

            if (category != null && !category.trim().isEmpty() && !"all".equalsIgnoreCase(category)) {
                predicates.add(criteriaBuilder.equal(criteriaBuilder.lower(root.get("category")), category.trim().toLowerCase()));
            }

            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            if (Boolean.TRUE.equals(featured)) {
                predicates.add(criteriaBuilder.equal(root.get("isFeatured"), true));
            }

            if (Boolean.TRUE.equals(inStock)) {
                predicates.add(criteriaBuilder.greaterThan(root.get("stock"), 0));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Page<Product> productPage = productRepository.findAll(spec, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("total", productPage.getTotalElements());
        response.put("page", page);
        response.put("pages", productPage.getTotalPages());
        response.put("limit", pageSize);
        response.put("products", productPage.getContent());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Product with ID " + id + " not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("product", productOpt.get());

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@Valid @RequestBody ProductRequest request) {
        String slug = slugify(request.getName()) + "-" + (System.currentTimeMillis() % 10000);

        Product product = new Product();
        product.setName(request.getName());
        product.setSlug(slug);
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setDiscountPrice(request.getDiscountPrice());
        product.setImage(request.getImage());
        product.setCategory(request.getCategory());
        product.setCategoryId(request.getCategoryId());
        product.setStock(request.getStock() != null ? request.getStock() : 0);
        product.setRating(request.getRating() != null ? request.getRating() : 4.5);
        product.setNumReviews(0);
        product.setIsFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false);

        Product savedProduct = productRepository.save(product);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Product created successfully");
        response.put("product", savedProduct);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody ProductRequest request) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Product not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        Product product = productOpt.get();

        if (request.getName() != null && !request.getName().isBlank()) {
            product.setName(request.getName());
            product.setSlug(slugify(request.getName()));
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }
        if (request.getPrice() != null) {
            product.setPrice(request.getPrice());
        }
        if (request.getDiscountPrice() != null) {
            product.setDiscountPrice(request.getDiscountPrice());
        }
        if (request.getImage() != null) {
            product.setImage(request.getImage());
        }
        if (request.getCategory() != null) {
            product.setCategory(request.getCategory());
        }
        if (request.getCategoryId() != null) {
            product.setCategoryId(request.getCategoryId());
        }
        if (request.getStock() != null) {
            product.setStock(request.getStock());
        }
        if (request.getRating() != null) {
            product.setRating(request.getRating());
        }
        if (request.getIsFeatured() != null) {
            product.setIsFeatured(request.getIsFeatured());
        }

        Product savedProduct = productRepository.save(product);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Product updated successfully");
        response.put("product", savedProduct);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Product not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        productRepository.delete(productOpt.get());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Product deleted successfully");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/reduce-stock")
    public ResponseEntity<?> reduceStock(@RequestBody StockReduceRequest request) {
        if (request == null || request.getItems() == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Items array is required");
            return ResponseEntity.badRequest().body(error);
        }

        for (StockReduceRequest.StockItem item : request.getItems()) {
            if (item.getProductId() != null) {
                Optional<Product> productOpt = productRepository.findById(item.getProductId());
                if (productOpt.isPresent()) {
                    Product product = productOpt.get();
                    int qty = item.getQuantity() != null ? item.getQuantity() : 1;
                    product.setStock(Math.max(0, product.getStock() - qty));
                    productRepository.save(product);
                }
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Stock updated successfully");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/restock")
    public ResponseEntity<?> restockProduct(@RequestBody StockReduceRequest request) {
        if (request == null || request.getItems() == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Items array is required");
            return ResponseEntity.badRequest().body(error);
        }

        for (StockReduceRequest.StockItem item : request.getItems()) {
            if (item.getProductId() != null) {
                Optional<Product> productOpt = productRepository.findById(item.getProductId());
                if (productOpt.isPresent()) {
                    Product product = productOpt.get();
                    int qty = item.getQuantity() != null ? item.getQuantity() : 1;
                    product.setStock(product.getStock() + qty);
                    productRepository.save(product);
                }
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Stock restored successfully");

        return ResponseEntity.ok(response);
    }
}

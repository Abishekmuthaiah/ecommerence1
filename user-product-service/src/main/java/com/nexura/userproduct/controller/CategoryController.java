package com.nexura.userproduct.controller;

import com.nexura.userproduct.dto.CategoryRequest;
import com.nexura.userproduct.model.Category;
import com.nexura.userproduct.repository.CategoryRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    private String slugify(String input) {
        if (input == null) return "";
        return input.toLowerCase().trim().replaceAll("\\s+", "-").replaceAll("[^\\w-]+", "");
    }

    @GetMapping
    public ResponseEntity<?> getCategories() {
        List<Category> categories = categoryRepository.findAllByOrderByNameAsc();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("categories", categories);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@Valid @RequestBody CategoryRequest categoryRequest) {
        String slug = slugify(categoryRequest.getName());

        Category category = new Category();
        category.setName(categoryRequest.getName());
        category.setSlug(slug);
        category.setDescription(categoryRequest.getDescription());
        category.setImage(categoryRequest.getImage() != null && !categoryRequest.getImage().isBlank()
                ? categoryRequest.getImage()
                : "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600");

        Category savedCategory = categoryRepository.save(category);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("category", savedCategory);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

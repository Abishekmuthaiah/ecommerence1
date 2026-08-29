package com.nexura.userproduct.controller;

import com.nexura.userproduct.dto.UpdateProfileRequest;
import com.nexura.userproduct.model.User;
import com.nexura.userproduct.repository.UserRepository;
import com.nexura.userproduct.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Not authorized");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        Optional<User> userOpt = userRepository.findById(currentUser.getId());
        if (userOpt.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "User profile not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("user", userOpt.get());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserPrincipal currentUser,
                                           @RequestBody UpdateProfileRequest updateRequest) {
        if (currentUser == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Not authorized");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        Optional<User> userOpt = userRepository.findById(currentUser.getId());
        if (userOpt.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        User user = userOpt.get();
        if (updateRequest.getName() != null && !updateRequest.getName().isBlank()) {
            user.setName(updateRequest.getName());
        }
        if (updateRequest.getPhone() != null) {
            user.setPhone(updateRequest.getPhone());
        }
        if (updateRequest.getAvatar() != null && !updateRequest.getAvatar().isBlank()) {
            user.setAvatar(updateRequest.getAvatar());
        }
        if (updateRequest.getPassword() != null && !updateRequest.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(updateRequest.getPassword()));
        }

        User savedUser = userRepository.save(user);

        Map<String, Object> userDto = new HashMap<>();
        userDto.put("id", savedUser.getId());
        userDto.put("name", savedUser.getName());
        userDto.put("email", savedUser.getEmail());
        userDto.put("phone", savedUser.getPhone());
        userDto.put("role", savedUser.getRole());
        userDto.put("avatar", savedUser.getAvatar());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Profile updated successfully");
        response.put("user", userDto);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAllByOrderByCreatedAtDesc();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", users.size());
        response.put("users", users);

        return ResponseEntity.ok(response);
    }
}

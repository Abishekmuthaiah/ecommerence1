package com.nexura.userproduct.controller;

import com.nexura.userproduct.dto.LoginRequest;
import com.nexura.userproduct.dto.RegisterRequest;
import com.nexura.userproduct.model.User;
import com.nexura.userproduct.repository.UserRepository;
import com.nexura.userproduct.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "An account with this email already exists");
            return ResponseEntity.badRequest().body(error);
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setPhone(registerRequest.getPhone());
        user.setRole("customer");
        user.setAvatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150");

        User savedUser = userRepository.save(user);
        String token = tokenProvider.generateToken(savedUser.getId(), savedUser.getRole());

        Map<String, Object> userDto = new HashMap<>();
        userDto.put("id", savedUser.getId());
        userDto.put("name", savedUser.getName());
        userDto.put("email", savedUser.getEmail());
        userDto.put("phone", savedUser.getPhone());
        userDto.put("role", savedUser.getRole());
        userDto.put("avatar", savedUser.getAvatar());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Account registered successfully");
        response.put("token", token);
        response.put("user", userDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());

        if (userOpt.isEmpty() || !passwordEncoder.matches(loginRequest.getPassword(), userOpt.get().getPassword())) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        User user = userOpt.get();
        String token = tokenProvider.generateToken(user.getId(), user.getRole());

        Map<String, Object> userDto = new HashMap<>();
        userDto.put("id", user.getId());
        userDto.put("name", user.getName());
        userDto.put("email", user.getEmail());
        userDto.put("phone", user.getPhone());
        userDto.put("role", user.getRole());
        userDto.put("avatar", user.getAvatar());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("token", token);
        response.put("user", userDto);

        return ResponseEntity.ok(response);
    }
}

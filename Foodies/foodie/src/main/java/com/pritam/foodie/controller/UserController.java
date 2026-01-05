package com.pritam.foodie.controller;

import com.pritam.foodie.model.User;
import com.pritam.foodie.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // 1. Get My Profile
    @GetMapping("/profile")
    public ResponseEntity<User> getMyProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    // 2. Update My Profile (Address/Phone)
    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(Authentication authentication, @RequestBody User updatedData) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update fields
        if (updatedData.getAddress() != null) user.setAddress(updatedData.getAddress());
        if (updatedData.getPhone() != null) user.setPhone(updatedData.getPhone());
        if (updatedData.getFullName() != null) user.setFullName(updatedData.getFullName());

        return ResponseEntity.ok(userRepository.save(user));
    }
}
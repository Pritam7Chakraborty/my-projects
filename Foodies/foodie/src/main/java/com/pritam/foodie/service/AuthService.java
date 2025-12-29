package com.pritam.foodie.service;

import com.pritam.foodie.dto.RegisterRequest;
import com.pritam.foodie.model.User;
import com.pritam.foodie.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(RegisterRequest request){
        // 1. Check if email exists
        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already uses by another account!");
        }

        // 2. Create new user object
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());

        // 3. Encrypt the password before saving!
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userRepository.save(user);
    }
}

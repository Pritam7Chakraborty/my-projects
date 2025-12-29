package com.pritam.foodie.controller;

import com.pritam.foodie.dto.LoginRequest;
import com.pritam.foodie.dto.LoginResponse;
import com.pritam.foodie.dto.RegisterRequest;
import com.pritam.foodie.model.User;
import com.pritam.foodie.service.AuthService;
import com.pritam.foodie.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request){
        User registeredUser = authService.registerUser(request);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request){
        // 1. Authenticate (Check Password)
        // This line attempts to match email & password in DB
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        if(authentication.isAuthenticated()){
            String token = jwtUtil.generateToken(request.getEmail());
            return ResponseEntity.ok(new LoginResponse(token,"Login Successful! Welcome back."));
        }
        else {
            throw new RuntimeException("Invalid Access");
        }
    }
}

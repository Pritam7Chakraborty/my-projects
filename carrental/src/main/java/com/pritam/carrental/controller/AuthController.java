package com.pritam.carrental.controller;

import com.pritam.carrental.dto.UserDTO;
import com.pritam.carrental.payload.ApiResponse;
import com.pritam.carrental.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<String>> signup(@Valid @RequestBody UserDTO userDTO) {
        String message = authService.signup(userDTO);
        return ResponseEntity.ok(ApiResponse.success("Signup successful", message));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> login(@Valid @RequestBody UserDTO userDTO) {
        String token = authService.login(userDTO);
        return ResponseEntity.ok(ApiResponse.success("Login successful", token));
    }
}

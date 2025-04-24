package com.pritam.carrental.controller;

import com.pritam.carrental.dto.UserDTO;
import com.pritam.carrental.dto.AuthResponseDTO;
import com.pritam.carrental.payload.ApiResponse;
import com.pritam.carrental.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> signup(@Valid @RequestBody UserDTO userDTO) {
        AuthResponseDTO response = authService.signup(userDTO);
        return ResponseEntity.ok(ApiResponse.success("Signup successful", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> login(@Valid @RequestBody UserDTO userDTO) {
        AuthResponseDTO response = authService.login(userDTO);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }
}

package com.pritam.carrental.service;

import com.pritam.carrental.dto.UserDTO;
import com.pritam.carrental.dto.AuthResponseDTO;
import com.pritam.carrental.entity.User;
import com.pritam.carrental.entity.Role;
import com.pritam.carrental.repository.UserRepository;
import com.pritam.carrental.security.JwtHelper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtHelper jwtHelper;

    public AuthResponseDTO signup(UserDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            log.warn("Signup failed: email {} already registered", dto.getEmail());
            throw new IllegalArgumentException("Email is already registered.");
        }

        User user = User.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(dto.getRole() != null ? dto.getRole() : Role.CUSTOMER)
                .build();

        userRepository.save(user);
        log.info("User registered: {}", dto.getEmail());

        String token = jwtHelper.generateToken(user.getEmail());
        return new AuthResponseDTO(user.getEmail(), token, user.getRole().name());
    }

    public AuthResponseDTO login(UserDTO dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login failed: user {} not found", dto.getEmail());
                    return new IllegalArgumentException("Invalid email or password.");
                });

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            log.warn("Login failed: invalid password for user {}", dto.getEmail());
            throw new IllegalArgumentException("Invalid email or password.");
        }

        log.info("User logged in: {}", dto.getEmail());
        String token = jwtHelper.generateToken(user.getEmail());
        return new AuthResponseDTO(user.getEmail(), token, user.getRole().name());
    }
}

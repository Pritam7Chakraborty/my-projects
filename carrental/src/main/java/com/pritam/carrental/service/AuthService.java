package com.pritam.carrental.service;

import com.pritam.carrental.dto.UserDTO;
import com.pritam.carrental.entity.User;
import com.pritam.carrental.enums.Role;
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

    public String signup(UserDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            log.warn("Signup failed: email {} already registered", dto.getEmail());
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(dto.getRole() == null ? Role.ROLE_USER : dto.getRole())
                .build();

        userRepository.save(user);
        log.info("New user registered: {}", user.getEmail());

        return "User registered successfully";
    }

    public String login(UserDTO dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login failed: user {} not found", dto.getEmail());
                    return new RuntimeException("Invalid email or password");
                });

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            log.warn("Login failed: incorrect password for {}", dto.getEmail());
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtHelper.generateToken(user);
        log.info("User logged in: {}", dto.getEmail());

        return token;
    }
}

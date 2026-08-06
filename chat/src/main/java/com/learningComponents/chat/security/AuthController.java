package com.learningComponents.chat.security;

import com.learningComponents.chat.user.Status;
import com.learningComponents.chat.user.User;
import com.learningComponents.chat.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestParam String username, @RequestParam String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
        }

        User newUser = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .status(Status.OFFLINE)
                .displayName(username)
                .themeColor("#7C6FFF")
                .build();

        userRepository.save(newUser);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String username, @RequestParam String password) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent() && passwordEncoder.matches(password, userOptional.get().getPassword())) {

            // Set user to ONLINE and save
            User user = userOptional.get();
            user.setStatus(Status.ONLINE);
            userRepository.save(user);

            String token = jwtService.generateToken(username);
            return ResponseEntity.ok(token);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
}
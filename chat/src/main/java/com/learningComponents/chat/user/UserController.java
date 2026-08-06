package com.learningComponents.chat.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/active")
    public ResponseEntity<List<User>> getActiveUsers() {
        return ResponseEntity.ok(userRepository.findAllByStatus(Status.ONLINE));
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestBody ProfileUpdateRequest request) {
        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Only update fields if they were provided in the request
            if (request.getDisplayName() != null && !request.getDisplayName().isEmpty()) {
                user.setDisplayName(request.getDisplayName());
            }
            if (request.getThemeColor() != null && !request.getThemeColor().isEmpty()) {
                user.setThemeColor(request.getThemeColor());
            }
            if (request.getAvatarBase64() != null && !request.getAvatarBase64().isEmpty()) {
                user.setAvatarBase64(request.getAvatarBase64());
            }

            userRepository.save(user);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }
}
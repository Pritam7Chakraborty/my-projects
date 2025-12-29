package com.pritam.foodie.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/demo")
public class DemoController {

    // 1. Accessible by ANY logged-in user (Customer, Admin, etc.)
    @GetMapping("/user")
    public ResponseEntity<String> sayHelloUser() {
        return ResponseEntity.ok("👋 Hello User! This is a standard protected endpoint.");
    }

    // 2. Accessible ONLY by ADMINS
    @GetMapping("/admin")
    public ResponseEntity<String> sayHelloAdmin() {
        return ResponseEntity.ok("😎 Hello Admin! You are seeing VIP content.");
    }
    // ... inside DemoController class

    @GetMapping("/debug")
    public ResponseEntity<String> debugMyRole() {
        org.springframework.security.core.Authentication auth =
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();

        return ResponseEntity.ok("User: " + auth.getName() + "\nAuthorities: " + auth.getAuthorities());
    }
}
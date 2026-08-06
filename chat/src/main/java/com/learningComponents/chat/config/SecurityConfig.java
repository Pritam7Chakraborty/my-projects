package com.learningComponents.chat.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Allow access to static resources and the frontend UI
                        .requestMatchers("/", "/index.html", "/css/**", "/js/**").permitAll()
                        // Allow the initial WebSocket handshake (we secure the actual STOMP connection via the interceptor)
                        .requestMatchers("/ws/**").permitAll()
                        // Allow auth, user status, and dynamic message history paths
                        .requestMatchers("/api/auth/login", "/api/auth/register", "/api/messages/**", "/api/users/**").permitAll()
                        // Require authentication for anything else
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
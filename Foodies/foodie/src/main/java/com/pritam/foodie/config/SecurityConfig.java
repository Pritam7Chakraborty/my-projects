package com.pritam.foodie.config;

import com.pritam.foodie.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // <i>. Auth & Debug (Public)
                        // Public Endpoints
                        .requestMatchers("/auth/**", "/demo/debug").permitAll()

                        // <ii>. Restaurants (Public View, Admin Create)

                        // 1. Allow EVERYONE to GET the restaurant list
                        .requestMatchers(HttpMethod.GET,"/api/restaurants").permitAll()
                        // 2. Only ADMIN can POST (Create) a restaurant
                        .requestMatchers(HttpMethod.POST, "/api/restaurants").hasAuthority("ROLE_ADMIN")

                        // <iii>. Food Menu (Public View, Admin Add)
                        .requestMatchers(HttpMethod.GET,"/api/food/**").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/food/**").hasAuthority("ROLE_ADMIN")

                        // VIP Section (Demo)
                        .requestMatchers("/demo/admin/**").hasAuthority("ROLE_ADMIN")

                        // Allow authenticated users (Customers & Admins) to place orders
                        .requestMatchers(HttpMethod.POST, "/api/orders").authenticated()

                        // 1. Allow Users to View their OWN orders
                        .requestMatchers(HttpMethod.GET, "/api/orders").authenticated()

                        // 2. Allow Admins to Update Status
                        .requestMatchers(HttpMethod.POST, "/api/orders/**").hasAuthority("ROLE_ADMIN")

                        // Lock everything else
                        .anyRequest().authenticated()
                )
                // 1. Make session stateless (No cookies!)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // 2. Add our JWT Filter before the standard Username/Password filter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
    

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
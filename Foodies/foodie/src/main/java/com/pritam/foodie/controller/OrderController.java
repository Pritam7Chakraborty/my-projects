package com.pritam.foodie.controller;

import com.pritam.foodie.dto.OrderRequest;
import com.pritam.foodie.model.Order;
import com.pritam.foodie.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequest request){
        // 1. Get the currently logged-in user's email from the Security Context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        // 2. Call the service logic
        Order savedOrder = orderService.placeOrder(userEmail,request);
        return ResponseEntity.ok(savedOrder);
    }

    // My Order History
    @GetMapping
    public ResponseEntity<List<Order>> getMyOrders(){
        // 1. Get logged-in user's email
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        // 2. We need to find the User ID from the email
        // (We can assume the user exists because they are logged in)
        // ideally you'd inject UserService, but let's assume we fetch the user or repo here.
        // For simplicity, let's update OrderService to handle this lookup.
        List<Order> orders = orderService.getUserOrders(userEmail);
        return ResponseEntity.ok(orders);
    }

    // NEW: Admin updates status (e.g., "DELIVERED")
    // URL: POST /api/orders/{orderId}/status?status=DELIVERED
    @PostMapping("/{orderId}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable Long orderId,@RequestParam String status){
        Order updateOrder = orderService.updateOrderStatus(orderId,status);
        return ResponseEntity.ok(updateOrder);
    }
}

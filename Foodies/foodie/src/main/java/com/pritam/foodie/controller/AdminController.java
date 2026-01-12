package com.pritam.foodie.controller;

import com.pritam.foodie.model.Order;
import com.pritam.foodie.repository.OrderRepository;
import com.pritam.foodie.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;

    @GetMapping("/stats")
    public Map<String, Object> getAdminStats() {
        List<Order> allOrders = orderRepository.findAll();

        // 1. Calculate Total Revenue
        double totalRevenue = allOrders.stream().mapToDouble(Order::getTotalAmount).sum();

        // 2. Calculate Total Orders
        int totalOrders = allOrders.size();

        // 3. Calculate Total Users
        long totalUsers = userRepository.count();

        // 4. Mock Data for the Graph (Since we don't have months of history yet)
        // In a real app, you would query "Group By Date"
        List<Map<String, Object>> graphData = List.of(
                Map.of("name", "Jan", "sales", 4000),
                Map.of("name", "Feb", "sales", 3000),
                Map.of("name", "Mar", "sales", 2000),
                Map.of("name", "Apr", "sales", 2780),
                Map.of("name", "May", "sales", 1890),
                Map.of("name", "Jun", "sales", 2390),
                Map.of("name", "Jul", "sales", 3490)
        );

        Map<String, Object> response = new HashMap<>();
        response.put("totalRevenue", totalRevenue);
        response.put("totalOrders", totalOrders);
        response.put("totalUsers", totalUsers);
        response.put("salesData", graphData);

        return response;
    }
}
package com.pritam.foodie.service;

import com.pritam.foodie.dto.OrderRequest;
import com.pritam.foodie.model.*;
import com.pritam.foodie.repository.FoodItemRepository;
import com.pritam.foodie.repository.OrderRepository;
import com.pritam.foodie.repository.RestaurantRepository;
import com.pritam.foodie.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private UserRepository userRepository;

    public Order placeOrder(String userEmail, OrderRequest request){
        // 1. Find the User who is ordering
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(()-> new RuntimeException("User not found"));

        // 2. Find the Restaurant
        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(()-> new RuntimeException("Restaurant not found"));

        // 3. Create the Order Object
        Order order = new Order();
        order.setUser(user);
        order.setRestaurant(restaurant);
        order.setStatus("PENDING");

        order.setDeliveryAddress(request.getAddress());

        // 4. Loop through items to calculate Total & Build OrderItems
        double totalAmount = 0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderRequest.CartItem cartItem: request.getItems()){
            FoodItem food = foodItemRepository.findById(cartItem.getFoodId())
                    .orElseThrow(()-> new RuntimeException("Food not found"));

            // Calculate cost for this item line
            totalAmount += (food.getPrice() * cartItem.getQuantity());

            // Create the OrderItem entity
            OrderItem item = new OrderItem();
            item.setFoodItem(food);
            item.setQuantity(cartItem.getQuantity());
            item.setOrder(order); // Link back to the parent order

            orderItems.add(item);
        }

        // 5. Set final details
        order.setTotalAmount(totalAmount);
        order.setItems(orderItems);

        // 6. Save! (Cascade will automatically save the OrderItems too)
        return orderRepository.save(order);
    }

    //Get Orders for a specific User Email
    public List<Order> getUserOrders(String userEmail){
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(()-> new RuntimeException("User not found"));

        return orderRepository.findByUserId(user.getId());
    }

    //Update Status Logic
    public Order updateOrderStatus(Long orderId, String newStatus){
        Order order = orderRepository.findById(orderId)
                .orElseThrow(()-> new RuntimeException("Order not found"));
        order.setStatus(newStatus.toUpperCase());
        return orderRepository.save(order);
    }
}

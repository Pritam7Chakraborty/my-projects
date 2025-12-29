package com.pritam.foodie.controller;

import com.pritam.foodie.model.FoodItem;
import com.pritam.foodie.model.Restaurant;
import com.pritam.foodie.repository.FoodItemRepository;
import com.pritam.foodie.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food")
public class FoodController {

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    // 1. ADMIN ONLY: Add Food to a Restaurant
    // URL: POST /api/food/{restaurantId}
    @PostMapping("/{restaurantId}")
    public FoodItem createFood(@PathVariable Long restaurantId, @RequestBody FoodItem foodItem){
        // First, find the restaurant
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(()-> new RuntimeException("Restaurant not found"));
        // Link the food to the restaurant
        foodItem.setRestaurant(restaurant);

        return foodItemRepository.save(foodItem);
    }

    // 2. PUBLIC: Get Menu for a Restaurant
    // URL: GET /api/food/{restaurantId}
    @GetMapping("/{restaurantId}")
    public List<FoodItem> getMenu(@PathVariable Long restaurantId){
        return foodItemRepository.findByRestaurantId(restaurantId);
    }

}

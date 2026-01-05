package com.pritam.foodie.controller;

import com.pritam.foodie.model.Restaurant;
import com.pritam.foodie.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantRepository restaurantRepository;

    // 1. PUBLIC: Get all restaurants
    @GetMapping
    public List<Restaurant> getAllRestaurants(){
        return restaurantRepository.findAll();
    }

    // 2. ADMIN ONLY: Create a new restaurant
    @PostMapping
    public Restaurant createRestaurant(@RequestBody Restaurant restaurant){
        return restaurantRepository.save(restaurant);
    }

    // 3. PUBLIC: Get Single Restaurant by ID
    @GetMapping("/{id}")
    public Restaurant getRestaurantById(@PathVariable Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
    }

    // 4. OWNER/ADMIN: Toggle Restaurant Open/Closed Status
    @PutMapping("/{id}/status")
    public Restaurant updateRestaurantStatus(@PathVariable Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        // Flip the status (True -> False, False -> True)
        restaurant.setOpen(!restaurant.isOpen());

        return restaurantRepository.save(restaurant);
    }
}
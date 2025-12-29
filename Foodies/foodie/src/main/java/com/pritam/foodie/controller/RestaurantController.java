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
}

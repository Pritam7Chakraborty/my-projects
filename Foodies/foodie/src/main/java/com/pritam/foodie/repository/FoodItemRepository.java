package com.pritam.foodie.repository;

import com.pritam.foodie.model.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodItemRepository extends JpaRepository<FoodItem,Long> {
    // Custom query to find food by the restaurant's ID
    List<FoodItem> findByRestaurantId(Long restaurantId);
}

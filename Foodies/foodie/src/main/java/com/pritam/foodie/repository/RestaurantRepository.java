package com.pritam.foodie.repository;

import com.pritam.foodie.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantRepository extends JpaRepository<Restaurant,Long> {
    // Basic CRUD operations are built-in!
}
